# IPv6-adresse.dk source & data

[IPv6-adresse.dk](https://ipv6-adresse.dk) — status på danske internetudbyderes IPv6-understøttelse.

## Bidrag med data

Hver udbyder er én JSON-fil i [`data/`](data/), valideret mod [`schema.json`](schema.json) i CI. Ret eller tilføj en udbyder via pull request:

```json
{
  "name": "Udbyder A/S",
  "url": "https://udbyder.dk",
  "ipv6": true,
  "partial": false,
  "assignedprefix": "/56",
  "comment": "Kommentar fra udbyderen",
  "sources": [
    { "name": "Kilde", "url": "https://kilde.dk/artikel", "date": "2026-07-31" }
  ]
}
```

`assignedprefix` udelades hvis ukendt. `sources[].date` skal være `YYYY-MM-DD`.

## Udvikling

```sh
npm install
npm run develop   # dev-server på localhost:8000
npm run build     # produktion — genererer også public/_headers (CSP m.m.)
```

Kræver Node 20.19+ (`sass` sætter den nedre grænse). CI og deploy bruger den version, der står i [`.nvmrc`](.nvmrc).

## Test

```sh
npm test          # unit- og datakvalitetstests (node --test) med coverage
npm run build     # e2e-testene kører mod produktionsbygget…
npm run test:e2e  # …serveret via `gatsby serve` (Playwright)
```

Logikken bor i små CommonJS-moduler i [`src/utils/`](src/utils/), så `node --test` kan
køre dem uden transpilering — komponenterne er tynde skaller udenom. `test/data.test.js`
tjekker det, JSON-skemaet ikke kan udtrykke (ægte datoer, ingen dubletter,
`partial` kræver `ipv6`). Playwright-testene i [`e2e/`](e2e/) mocker tjek-endpointet
og rammer alle tilstande af »Har jeg IPv6?«-widgetten i det rigtige bundle.
