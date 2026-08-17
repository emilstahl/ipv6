# Claude guidelines for this repo

- Always write pull request titles and bodies in **English**. Commit messages too.
- Site content, ISP data comments (`data/*.json` `comment` fields) and README stay in **Danish** — that is the site's language.
- Every ISP is one JSON file in `data/`, validated against `schema.json` in CI (`npx ajv-cli validate -s schema.json -d "data/*.json"`).
- `npm test` runs the semantic data checks (unique names/hostnames, real dates not in the future, `partial` implies `ipv6`).
- Claims about an ISP's IPv6 status need a source in `sources[]` — link the provider's own page where possible.
