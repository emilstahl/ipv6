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

Kræver Node 20+.
