# Echo Carrie

The source for [echoscarrie.com](https://echoscarrie.com): a website that
listens first.

Visitors leave a thought and receive one of three short forms of response:
a mirror, a turn, or a door into one of Carrie's four creative frequencies.

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
