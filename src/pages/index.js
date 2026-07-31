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

// Newest valid date across an ISP's sources, regardless of array order
const newestDate = sources => sources.reduce((max, s) => {
  const d = safeDate(s.date);
  return d && (!max || d > max) ? d : max;
}, null);

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
          assignedprefix
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
  const ispData = data.allDataJson.edges.map(x => ({
    ...x.node,
    color: !x.node.ipv6 ? '#ef9a9a' : (x.node.partial) ? '#ffe082' : '#a5d6a7',
    state: !x.node.ipv6 ? 'Nej' : (x.node.partial) ? 'Delvist' : 'Ja',
  }));

  const total = ispData.length;
  const full = ispData.filter(x => x.ipv6 && !x.partial).length;
  const partial = ispData.filter(x => x.ipv6 && x.partial).length;
  const none = total - full - partial;
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
              { name: 'color', hidden: true },
              { name: 'url', hidden: true },
              {
                id: 'name',
                name: 'Navn',
                width: '160px',

                sort: {
                  enabled: true
                },

                formatter: (cell, row) => {
                  const url = safeUrl(row.cell(1).data);
                  if (!url) return cell;

                  return _(
                    <a className="ispLink" href={url.href} title={cell + " (nyt vindue)"} target="_blank" rel="noreferrer">
                      {/* Fetched at build time by onPreBootstrap in gatsby-node.js — same origin,
                          so no visitor data leaks to a third party. Hide it if it is missing. */}
                      <img className="ispLogo" height={"22px"} src={`/favicons/${url.hostname}.png`}
                           onError={e => { e.target.style.visibility = 'hidden' }}
                           alt={cell + " logo"}/>
                      <span className="ispName">{cell}</span>
                    </a>
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
                      backgroundColor: `${row.cell(0).data}`
                    },
                  }
                },
                sort: {
                  enabled: true,
                  compare: (a, b) => {
                    const priority = { "Ja": 0, "Delvist": 1, "Nej": 2 };
                    return priority[a] - priority[b];
                  }
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
                  compare: (a, b) => {
                    // Treat a missing prefix as the largest, so it sorts last
                    const parsePrefix = p => (p ? parseInt(p.replace('/', ''), 10) : 128);
                    return parsePrefix(a) - parsePrefix(b);
                  }
                }
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

            search={true}

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
