# OBD Fehlercode Finder (DACH + Marken)

Static, SEO-friendly website for looking up **OBD‑II fault codes** (German), plus **brand-focused pages for the DACH market**.

No backend, no framework. Build once → deploy the generated `dist/` anywhere.

## Features

- **OBD‑II Codes** with full pages: meaning, symptoms, causes, urgency, safe first checks, workshop advice, FAQs
- **DACH brand focus**
  - Brand landing pages: `/marke/<brand>/`
  - Brand + code pages (e.g. `P0420 VW`): `/marke/<brand>/code/<P0XXX>/`
- **Client-side search** with optional brand selection on the homepage
- **Wissen pages** (short guides): `/wissen/...`
- SEO basics:
  - unique `<title>` + `<meta description>` per page
  - canonical URLs
  - FAQPage JSON‑LD on code pages
  - auto-generated `sitemap.xml` and `robots.txt`
- AdSense-ready placeholders (no scripts included)
- Simple **validation** on build (fails fast when JSON structure is broken)

## Project Structure

```
OBDWeb-main/
├── package.json
├── build.js
├── server.js
├── src/
│   ├── codes.json
│   ├── bmw-codes.json
│   ├── brands.json
│   ├── brand-overrides.json
│   └── style.css
└── dist/                  # generated
    ├── index.html
    ├── marken/index.html
    ├── marke/<brand>/index.html
    ├── marke/<brand>/code/<P0XXX>/index.html
    ├── code/<P0XXX>/index.html
    ├── bmw/<code>/index.html
    ├── wissen/.../index.html
    ├── sitemap.xml
    ├── robots.txt
    └── 404.html
```

## Quick Start

```bash
npm install
npm run build
node server.js
```

Open: `http://localhost:3000`

## Deploy

The `dist/` folder is a fully self-contained static site.

### GitHub Pages (subpath)

```bash
SITE_URL="https://username.github.io" BASE_PATH="/REPO" npm run build
```

### Root domain

```bash
SITE_URL="https://deine-domain.tld" npm run build
```

## Configuration

Environment variables:

- `SITE_URL` (important): used for canonical URLs and the sitemap
- `BASE_PATH` (optional): if you deploy under a subpath (e.g., GitHub Pages)

## Brand-specific notes (optional)

If you want **brand-specific, source-backed** additions for a generic OBD‑II code, add entries to:

- `src/brand-overrides.json`

Structure:

```json
{
  "overrides": [
    {
      "brand": "vw",
      "code": "P0420",
      "notes": ["Short note (should be source-backed)."],
      "sources": ["https://..."]
    }
  ]
}
```

## AdSense Integration

Search for `<!-- Ad placeholder -->` in the generated HTML and replace the `<div class="ad-slot">` block with your AdSense unit.

## Disclaimer

General information only. No repair/legal/buying advice. For diagnosis and repair, consult a qualified workshop.

## License

MIT
