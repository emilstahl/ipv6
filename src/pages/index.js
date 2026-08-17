import * as React      from "react";
import HeaderComponent from '../components/Header/component';
import DoIHaveIPv6     from '../components/DoIHaveIPv6/component';
import Footer          from '../components/Footer/component';
import { graphql }     from 'gatsby';
import 'gridjs/dist/theme/mermaid.min.css';
import { _, Grid }     from 'gridjs-react';

import '../styles/index.style.scss';

import AdoptionChart from '../components/AdoptionChart/component';
import { safeUrl, safeDate, formatDate } from '../utils/safe';
import { ispState, compareState, comparePrefix, newestDate, ispStats } from '../utils/isp';

// gridjs addresses cells by position, so the hidden columns the visible
// formatters read from are declared once here and looked up by name. Reordering
// or adding a column can no longer feed the wrong field into an href.
const HIDDEN_COLUMNS = ['color', 'url', 'b2b'];
const hidden = name => HIDDEN_COLUMNS.indexOf(name);

// Danish display labels for the technology enum in schema.json.
const TECHNOLOGY_LABELS = {
  fiber: 'Fiber',
  coax: 'Coax',
  xdsl: 'xDSL',
  mobile: 'Mobil',
  fwa: 'Fast trådløs',
  satellite: 'Satellit',
};

// gridjs' default filter only stringifies string cells, so array cells
// (technologies, sources) would never match a search. This selector makes
// them searchable by their visible Danish labels and source names; hidden
// columns are still skipped by gridjs before the selector runs.
const searchableText = (cell) => {
  if (Array.isArray(cell)) {
    return cell
      .map(x => typeof x === 'string' ? (TECHNOLOGY_LABELS[x] || x) : ((x && x.name) || ''))
      .join(' ');
  }
  return cell == null ? '' : String(cell);
};

export const query = graphql`
  query GetISPData {
    allDataJson(
      sort: [{ ipv6: DESC }, { partial: ASC }, { name: ASC }]
    ) {
      edges {
        node {
          name
          url
          ipv6
          partial
          b2b
          assignedprefix
          technologies
          comment
          sources {
            date
            name
            url
          }
        }
      }
    }
  }
`

const IndexPage = ({ data }) => {
  const ispData = data.allDataJson.edges.map(x => ({ ...x.node, ...ispState(x.node) }));

  const { total, full, partial, none } = ispStats(ispData);
  const pct = n => (n / total * 100).toFixed(0);

  return (
    <div>
      <HeaderComponent/>
      <div className="hero">
        <div className="container">
          <h1>Vi er løbet tør for IPv4-adresser...</h1>
          <p>
            Derfor er det på tide, at internetudbyderne giver deres kunder den nye version, IPv6-adresser.<br/>
            Heldigvis har nogle udbydere allerede gjort det, andre er i gang, og så er der den klassiske <em>ingen
            tidshorisont</em>.
          </p>

          <blockquote>
            <p>Der er indført mange forbedringer i IPv6, men den største forskel er størrelsen af adressefeltet, som er
              på 128 bit mod kun 32 bit i den gamle IPv4-standard. Udvidelsen af adressefeltet giver teoretisk mulighed
              for op til 3,4 × 10<sup>38</sup> (340 sekstillioner) adresser - sammenlignet med IPv4, som kun havde 4 millarder adresser.</p>
            <footer className="blockquote-footer">
              <a href="https://da.wikipedia.org/wiki/IPv6" target="_blank"
                         rel="noreferrer">
              <cite title="Wikipedia">Wikipedia</cite>
            </a>
            </footer>
          </blockquote>
        </div>
      </div>

      <DoIHaveIPv6/>

      <section id="ispList" className="ispList">
        <div className="container">
          <h2>Liste over danske udbydere</h2>
          <div className="stats">
            <p>Internetudbydere på listen: {total}</p>
            <p>Internetudbydere med <abbr
              title="Fuld IPv6-understøttelse betyder at alle kunder har mulighed for at få IPv6. Der kan dog være udbydere, som kun leverer deres tjenester til erhverv.">fuld
              IPv6-understøttelse</abbr>: {full} ({pct(full)}%)
            </p>
            <p>Internetudbydere med <abbr
              title="Delvis IPv6-understøttelse betyder at nogle kunder kan få IPv6. Det kan f.eks. være erhvervskunder, fiberkunder eller lignende.">delvis
              IPv6-understøttelse</abbr>: {partial} ({pct(partial)}%)
            </p>
            <p>Internetudbydere uden <abbr
              title="Ingen understøttelse betyder at de ikke tilbyder IPv6 til nogle kunder på nuværende tidspunkt.">
              IPv6-understøttelse</abbr>: {none} ({pct(none)}%)
            </p>
          </div>

          <AdoptionChart ispData={ispData}/>

          <Grid
            data={ispData}
            columns={[
              ...HIDDEN_COLUMNS.map(name => ({ name, hidden: true })),
              {
                id: 'name',
                name: 'Navn',
                width: '160px',

                sort: {
                  enabled: true
                },

                formatter: (cell, row) => {
                  const url = safeUrl(row.cell(hidden('url')).data);
                  if (!url) return cell;

                  // The badge stays outside the <a>, so it neither joins the
                  // link's accessible name nor navigates on click.
                  return _(
                    <span>
                      <a className="ispLink" href={url.href} title={cell + " (nyt vindue)"} target="_blank" rel="noreferrer">
                        {/* Fetched at build time by onPreBootstrap in gatsby-node.js — same origin,
                            so no visitor data leaks to a third party. Hide it if it is missing. */}
                        <img className="ispLogo" height={"22px"} src={`/favicons/${url.hostname}.png`}
                             onError={e => { e.target.style.visibility = 'hidden' }}
                             alt={cell + " logo"}/>
                        <span className="ispName">{cell}</span>
                      </a>
                      {row.cell(hidden('b2b')).data &&
                        <span className="b2bBadge" title="Leverer kun til erhvervskunder">Erhverv</span>}
                    </span>
                  )
                }
              },
              {
                id: 'state',
                name: 'IPv6',
                width: '90px',
                attributes: (cell, row) => {
                  if (cell == null) return;
                  return {
                    style: {
                      textAlign: 'center',
                      backgroundColor: `${row.cell(hidden('color')).data}`
                    },
                  }
                },
                sort: {
                  enabled: true,
                  compare: compareState
                }
              },
              {
                id: 'assignedprefix',
                name: 'Præfiks',
                width: '110px',
                formatter: cell => _(<span className="cellText">{cell}</span>),
                attributes: (cell) => {
                  if (cell == null) return;
                  return {
                    style: {
                      textAlign: 'center'
                    }
                  }
                },
                sort: {
                  enabled: true,
                  compare: comparePrefix
                }
              },

              {
                id: 'technologies',
                name: 'Teknologi',
                width: '150px',
                sort: { enabled: false },
                formatter: cell => _(<span className="cellText">
                  {(cell || []).map(t => (
                    <span key={t} className="techTag">{TECHNOLOGY_LABELS[t] || t}</span>
                  ))}
                </span>),
              },
              {
                id: 'comment',
                name: 'Kommentar fra udbyder',
                formatter: cell => _(<span className="cellText">{cell}</span>),
                width: '400px'
              },
              {
                id: 'sources',
                name: 'Kilde',
                formatter: cell => _(<span className="cellText">
                  {cell.map((source, i) => {
                    const date = safeDate(source.date);
                    const dateText = date ? formatDate(date) : '—';
                    return (
                      <React.Fragment key={i}>
                        {i > 0 && <br/>}
                        {safeUrl(source.url)
                          ? <a className="sourceLink" href={source.url}
                               title={`Gå til kilde fra ${dateText} (nyt vindue)`}
                               target="_blank" rel="noreferrer">{source.name}</a>
                          : <span title={dateText}>{source.name}</span>}
                      </React.Fragment>
                    );
                  })}
                </span>),
                width: '110px',
              },
              {
                id: 'sources',
                name: 'Opdateret',
                formatter: cell => {
                  const d = newestDate(cell);
                  return d ? formatDate(d) : '—';
                },
                sort: {
                  enabled: true,
                  compare: (a, b) => (newestDate(a) || 0) - (newestDate(b) || 0),
                },
                width: '120px',
              }
            ]}

            language={{
              'search': {
                'placeholder': '🔎 Søg i tabellen'
              }
            }}

            search={{ selector: searchableText }}

            style={{
              table: {
                'font-size': '80%'
              }
            }}
          />
        </div>
      </section>
      <Footer />

    </div>
  )
}

export const Head = () => (
  <>
    <title>IPv6-adresse.dk — Internetudbydere og IPv6 understøttelse</title>
    <meta name="description" content="IPv6-adresse.dk er samlingspunktet for den danske indførsel af den nye internet-protokol, IPv6. Siden er et open source projekt, og alle kan bidrage til siden!" />
  </>
)

export default IndexPage
