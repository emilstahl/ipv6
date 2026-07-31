import * as React      from "react";
import HeaderComponent from '../components/Header/component';
import Footer          from '../components/Footer/component';

const styles = {
  section: {
    marginTop: '3rem',
    marginBottom: '3rem',
    lineHeight: 1.6,
  },
  a: {
    color: 'var(--accent)',
  },
}

const PrivacyPage = () => (
  <div>
    <HeaderComponent/>
    <section className="container" style={styles.section}>
      <h1>Privatliv</h1>
      <p>
        IPv6-adresse.dk er et lille open source-projekt, og siden er bygget som en statisk hjemmeside.
        Vi indsamler ikke persondata, vi sætter ingen cookies, og der er derfor heller ingen samtykkebanner
        at klikke væk. Nedenfor står det, siden faktisk gør.
      </p>

      <h2>IPv6-tjekket</h2>
      <p>
        Når du åbner forsiden, sender din browser en forespørgsel
        til <a style={styles.a} href="https://check.ipv6-adresse.dk">https://check.ipv6-adresse.dk</a> for at finde ud af,
        om du har IPv6. Som ved al kommunikation på internettet kender modtageren afsenderens IP-adresse, og det er
        netop din IP-adresse, tjenesten svarer tilbage med — sammen med det opslåede navn på din internetudbyder og
        dit land.
      </p>
      <p>
        Svaret bliver udelukkende vist i din browser. IPv6-adresse.dk gemmer ikke svaret, opretter ingen profiler
        og har ingen database eller brugerkonti. Der er intet at slette hos os, fordi der ikke bliver oprettet noget.
      </p>

      <h2>Ingen indhold fra tredjeparter</h2>
      <p>
        Siden henter ikke billeder, skrifttyper eller scripts fra andre domæner. Udbydernes ikoner i tabellen
        ligger på vores eget domæne og bliver hentet ned én gang, når siden bygges — så dit besøg ikke bliver
        delt med en tredjepart, bare fordi der skal vises et lille logo.
      </p>

      <h2>Hosting og statistik</h2>
      <p>
        Siden hostes hos Cloudflare (Cloudflare Pages), som leverer indholdet til dig. For at kunne gøre det
        behandler Cloudflare tekniske oplysninger om forespørgslen, herunder din IP-adresse. Vi bruger desuden
        Cloudflare Web Analytics til at se, hvor mange der besøger siden. Den løsning er valgt, fordi den er
        cookiefri: den sætter ingen cookies og forsøger ikke at følge dig på tværs af hjemmesider. Vi har ikke
        adgang til oplysninger, der identificerer dig som person, i statistikken.
      </p>

      <h2>Cookies</h2>
      <p>
        IPv6-adresse.dk sætter ingen cookies og bruger ikke localStorage til at genkende dig. Derfor beder vi
        heller ikke om samtykke.
      </p>

      <h2>Retsgrundlag</h2>
      <p>
        Behandlingen af IP-adresser sker som en teknisk forudsætning for at levere siden, for at holde den sikker
        og for at kunne vise dig resultatet af IPv6-tjekket. Retsgrundlaget er vores legitime interesse i at drive
        en fungerende hjemmeside, jf. databeskyttelsesforordningens artikel 6, stk. 1, litra f. Siden selv opbevarer
        ingen data om dig, og der bliver ikke videregivet oplysninger til andre end de nævnte leverandører.
      </p>

      <h2>Kontakt</h2>
      <p>
        Har du spørgsmål om data og privatliv — eller mener du, at noget på denne side ikke stemmer — så skriv
        til <a style={styles.a} href="mailto:ipv6@ipv6-adresse.dk">ipv6@ipv6-adresse.dk</a>. Dataansvarlig er
        projektets ejer, som kan kontaktes på samme adresse. Du kan også klage
        til <a style={styles.a} href="https://www.datatilsynet.dk" target="_blank" rel="noreferrer">Datatilsynet</a>.
      </p>

      <p><small>Sidst opdateret: 31. juli 2026</small></p>
    </section>
    <Footer/>
  </div>
)

export const Head = () => (
  <>
    <title>Privatliv — IPv6-adresse.dk</title>
    <meta name="description" content="Sådan behandler IPv6-adresse.dk data: ingen cookies, ingen tredjepartsindhold og ingen lagring af IPv6-tjekkets resultat." />
  </>
)

export default PrivacyPage
