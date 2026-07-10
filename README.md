# Echo Carrie

The source for [echoscarrie.com](https://echoscarrie.com): a private listening
surface that notices what a visitor writes and answers from a different angle.

Visitors choose one of three forms of response — a mirror, a turn, or a door —
and can continue the exchange, enter four expandable rooms, revisit earlier
echoes, or clear the site's memory. Language analysis and history stay in the
visitor's browser; the site does not upload their words.

## Local development

```bash
npm install
npm run dev
```

## Publishing

The editable source lives on `main`. A clean static build is published from the
`gh-pages` branch:

```bash
./scripts/publish-pages.sh
```
