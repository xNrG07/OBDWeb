# OBD Fehlercode Finder

A static, SEO-optimized website for looking up OBD-II fault codes. No backend, no database, no frameworks – just HTML, CSS, and vanilla JS.

## Features

- **150 OBD-II codes** with full descriptions in German
- Per-code detail pages: meaning, symptoms, causes, urgency, first checks, workshop advice, FAQs
- Client-side search (instant, no server needed)
- Category browsing (Catalyst, Fuel, Misfire, EVAP, Sensors, EGR, Throttle, Transmission)
- SEO: unique `<title>` + `<meta description>` per page, canonical URLs, FAQPage JSON-LD, auto-generated sitemap.xml, robots.txt
- AdSense-ready placeholders (no scripts included)
- Fully static output – deploy anywhere

## Project Structure

```
obd-fehlercode-finder/
├── package.json
├── build.js              # Build script: JSON → static HTML
├── generate-codes.js     # One-time generator for codes.json
├── src/
│   ├── codes.json        # All 150 OBD codes (data source)
│   └── style.css         # Stylesheet
├── dist/                 # Build output (generated)
│   ├── index.html
│   ├── sitemap.xml
│   ├── robots.txt
│   └── code/
│       ├── P0420/index.html
│       ├── P0171/index.html
│       └── ... (150 code pages)
└── README.md
```

## Quick Start

```bash
# 1. Build the site
npm run build

# 2. Preview locally (any static server)
npx serve dist
# or: python3 -m http.server -d dist 8000
```

Open `http://localhost:3000` (serve) or `http://localhost:8000` (python).

## Deploy

The `dist/` folder is a fully self-contained static site. Deploy it to:

### GitHub Pages
```bash
# Push dist/ to gh-pages branch
npx gh-pages -d dist
```

### Vercel
```bash
# vercel.json (create in project root):
# { "outputDirectory": "dist" }
vercel --prod
```

### Netlify
Set build command to `node build.js` and publish directory to `dist`.

### Any Static Host
Just upload the contents of `dist/` to your web server.

## Configuration

The build uses these environment variables:

- `SITE_URL` (required for production): Your full domain for canonical URLs & sitemap  
  Example: `https://obd-fehlercode-finder.de`
- `BASE_PATH` (optional): Only needed if you deploy under a subpath (e.g. GitHub Pages)  
  Example: `/OBDWeb-main`

Examples:

```bash
# Root domain deployment
SITE_URL="https://obd-fehlercode-finder.de" npm run build

# GitHub Pages (subpath)
SITE_URL="https://username.github.io" BASE_PATH="/OBDWeb-main" npm run build
```

The build also generates:
- `/datenschutz/` and `/impressum/` (placeholder texts – replace bracketed fields)
- `style.css` + `favicon.svg` in the dist root

## Adding Codes


1. Add entries to `src/codes.json` (follow existing structure)
2. Run `npm run build`
3. Deploy updated `dist/`

## AdSense Integration

Search for `<!-- Ad placeholder` in the generated HTML. Replace the placeholder `<div class="ad-slot">` with your AdSense ad unit code. There are two placements:
- **index.html**: below the search field
- **Each code page**: after the "Wie dringend?" section

## Tech Stack

- Node.js (build only, no runtime dependency)
- Plain HTML5, CSS3, vanilla JavaScript
- Zero npm dependencies
- Zero frameworks

## Disclaimer

This site provides general information only. It does not constitute repair, legal, or purchase advice. For diagnosis and repair, consult a qualified workshop.

## License

MIT
