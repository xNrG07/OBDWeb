#!/usr/bin/env node
// build.js – Build static HTML pages from JSON (no framework, no backend)
// Notes:
// - SITE_URL is used for canonical URLs + sitemap (should be your real domain in production).
// - BASE_PATH is optional (useful for GitHub Pages like "/my-repo"). Keep it empty for root domains.
// - This build generates:
//   * Generic OBD-II code pages: /code/P0xxx/
//   * DACH brand pages: /marke/<brand>/ and /marke/<brand>/code/P0xxx/
//   * Optional BMW internal code pages: /bmw/<code>/ (data quality depends on your dataset)

const fs = require("fs");
const path = require("path");

const DIST = path.join(__dirname, "dist");
const SRC = path.join(__dirname, "src");

// Configure these via env when deploying
const SITE_URL = (process.env.SITE_URL || "https://example.com").replace(/\/+$/, "");
const BASE_PATH = (process.env.BASE_PATH || "").replace(/\/+$/, ""); // e.g. "/my-repo" or ""

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

// Prefix for links inside the static site (works for root + subpath deployments)
function href(p) {
  if (!p.startsWith("/")) p = "/" + p;
  return BASE_PATH + p;
}

// Absolute URL for canonical + sitemap
function abs(p) {
  if (!p.startsWith("/")) p = "/" + p;
  return SITE_URL + BASE_PATH + p;
}

function readJson(file, fallback) {
  const full = path.join(SRC, file);
  if (!fs.existsSync(full)) return fallback;
  return JSON.parse(fs.readFileSync(full, "utf-8"));
}

const urgencyLabel = { low: "Niedrig", medium: "Mittel", high: "Hoch" };
const urgencyDesc = {
  low: "Kein akutes Sicherheitsrisiko. Zeitnah prüfen lassen, besonders vor der AU/TÜV.",
  medium: "Sollte in den nächsten Tagen bis Wochen untersucht werden. Weiterfahrt meist möglich.",
  high: "Zeitnah handeln. Bei blinkender Motorkontrollleuchte: Geschwindigkeit reduzieren und Werkstatt aufsuchen.",
};

const categoryLabel = {
  catalyst: "Katalysator",
  fuel: "Kraftstoffsystem",
  misfire: "Zündaussetzer",
  evap: "EVAP-System",
  sensor: "Sensoren",
  egr: "Abgasrückführung",
  throttle: "Drosselklappe / Leerlauf",
  transmission: "Getriebe",
};

const bmwSystemLabel = {
  DME: "DME – Motor (Benzin)",
  DDE: "DDE – Motor (Diesel)",
  EGS: "EGS – Getriebe",
  ACSM: "ACSM – Airbag/Sicherheit",
  DSC: "DSC – Stabilitätskontrolle",
  FRM: "FRM – Beleuchtung",
  CAS: "CAS – Zugang/Start",
  KOMBI: "KOMBI – Instrumente",
};

const codes = readJson("codes.json", []);
const bmwCodes = readJson("bmw-codes.json", []);
const brands = readJson("brands.json", []);
const brandOverridesRaw = readJson("brand-overrides.json", { overrides: [] });
const brandOverrides = Array.isArray(brandOverridesRaw.overrides) ? brandOverridesRaw.overrides : [];

const css = fs.readFileSync(path.join(SRC, "style.css"), "utf-8");

// Pre-rendered datalist options for all generic OBD-II codes
const codeOptionsAll = codes
  .map((c) => `<option value="${c.code}" label="${esc(c.title)}"></option>`)
  .join("\n");

console.log(
  `Building ${codes.length} OBD-II + ${bmwCodes.length} BMW pages + ${brands.length} brand pages...`
);

// Simple favicon (inline SVG file)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#2563eb"/>
  <path d="M18 38h28l4 8H14l4-8Zm6-20h16l6 20H18l6-20Z" fill="#fff" opacity="0.95"/>
  <circle cx="22" cy="46" r="4" fill="#fff"/>
  <circle cx="42" cy="46" r="4" fill="#fff"/>
</svg>`;

const searchIconSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

function headCommon({ title, description, canonical, extraJsonLd = "" }) {
  const jsonLd = extraJsonLd
    ? `<script type="application/ld+json">${extraJsonLd}</script>`
    : "";
  return `
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#2563eb">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="${href("/favicon.svg")}" type="image/svg+xml">
  <link rel="stylesheet" href="${href("/style.css")}">
  ${jsonLd}
</head>`.trim();
}

function header() {
  return `
<header>
  <div class="container">
    <a href="${href("/")}" class="logo">OBD <span>Fehlercode Finder</span></a>
    <nav>
      <a href="${href("/")}">Start</a>
      <a href="${href("/marken/")}">Marken (DACH)</a>
      <a href="${href("/wissen/")}">Wissen</a>
      <a href="${href("/#bmw-section")}">BMW (Beta)</a>
      <a href="${href("/datenschutz/")}">Datenschutz</a>
      <a href="${href("/impressum/")}">Impressum</a>
    </nav>
  </div>
</header>`.trim();
}

function footer() {
  const year = new Date().getFullYear();
  return `
<footer>
  <div class="container">
    <div class="disclaimer">
      <p><strong>Haftungsausschluss:</strong> Diese Website dient ausschließlich der allgemeinen Information. Sie stellt keine Reparatur-, Rechts- oder Kaufberatung dar. Für Diagnose und Reparatur wende dich an eine qualifizierte Kfz-Werkstatt. Alle Angaben ohne Gewähr.</p>
      <p style="margin-top:0.75rem">
        <a href="${href("/marken/")}">Marken</a> ·
        <a href="${href("/wissen/")}">Wissen</a> ·
        <a href="${href("/datenschutz/")}">Datenschutz</a> ·
        <a href="${href("/impressum/")}">Impressum</a>
      </p>
      <p style="margin-top:0.75rem">&copy; ${year} OBD Fehlercode Finder</p>
    </div>
  </div>
</footer>`.trim();
}

function faqLdJson(faqs) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (faqs || []).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });
}

function listHtml(arr) {
  return (arr || []).map((s) => `<li>${esc(s)}</li>`).join("");
}

function faqHtml(faqs) {
  return (faqs || [])
    .map(
      (f) =>
        `<li class="faq-item"><div class="faq-question">${esc(
          f.q
        )}</div><div class="faq-answer">${esc(f.a)}</div></li>`
    )
    .join("");
}

function websiteJsonLd() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: abs("/"),
    name: "OBD Fehlercode Finder",
    potentialAction: {
      "@type": "SearchAction",
      target: abs("/") + "?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  });
}

function toastHtml() {
  return `<div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}

const commonClientJs = `
<script>
(function(){
  function showToast(msg){
    var t = document.getElementById('toast');
    if(!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(window.__toastT);
    window.__toastT = setTimeout(function(){ t.classList.remove('show'); }, 1800);
  }
  window.showToast = showToast;

  // Copy buttons
  document.querySelectorAll('[data-copy]').forEach(function(btn){
    btn.addEventListener('click', async function(){
      var text = this.getAttribute('data-copy') || '';
      try{
        await navigator.clipboard.writeText(text);
        showToast('Kopiert: ' + text);
      }catch(e){
        showToast('Kopieren nicht möglich');
      }
    });
  });

  // Copy link
  document.querySelectorAll('[data-copy-link]').forEach(function(btn){
    btn.addEventListener('click', async function(){
      try{
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link kopiert');
      }catch(e){
        showToast('Kopieren nicht möglich');
      }
    });
  });

  // Share
  document.querySelectorAll('[data-share]').forEach(function(btn){
    btn.addEventListener('click', async function(){
      var title = document.title;
      var url = window.location.href;
      if(navigator.share){
        try{ await navigator.share({ title: title, url: url }); }
        catch(e){}
      }else{
        try{ await navigator.clipboard.writeText(url); showToast('Link kopiert'); }
        catch(e){ showToast('Teilen nicht möglich'); }
      }
    });
  });

  // FAQ toggle
  document.querySelectorAll('.faq-question').forEach(function(el){
    el.addEventListener('click', function(){
      this.parentElement.classList.toggle('open');
    });
  });
})();
</script>`.trim();

function normalizeBrandSlug(slug) {
  return String(slug || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
}

function normalizeCodeInput(q) {
  return String(q || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9]/g, "");
}

// ── Validation (fail fast) ─────────────────
function validate() {
  const errs = [];
  const codeSet = new Set(codes.map((c) => c.code));
  const bmwSet = new Set(bmwCodes.map((c) => c.code));

  function req(obj, key, name) {
    if (obj[key] === undefined || obj[key] === null || obj[key] === "") {
      errs.push(`${name}: missing ${key}`);
    }
  }

  codes.forEach((c, i) => {
    const name = `codes[${i}] ${c.code || "(no code)"}`;
    req(c, "code", name);
    req(c, "title", name);
    req(c, "shortMeaning", name);
    req(c, "meaningLong", name);
    req(c, "category", name);
    req(c, "urgency", name);
    req(c, "symptoms", name);
    req(c, "causes", name);
    req(c, "firstChecks", name);
    req(c, "whenToShop", name);
    req(c, "faqs", name);

    const code = String(c.code || "");
    if (!/^[PCBU]\d{4}$/.test(code)) errs.push(`${name}: invalid code format (expected P0xxx/C0xxx/B0xxx/U0xxx)`);
    if (!categoryLabel[c.category]) errs.push(`${name}: unknown category '${c.category}'`);
    if (!urgencyLabel[c.urgency]) errs.push(`${name}: unknown urgency '${c.urgency}'`);

    (c.related || []).forEach((r) => {
      if (!codeSet.has(r)) errs.push(`${name}: related '${r}' does not exist`);
    });
  });

  bmwCodes.forEach((c, i) => {
    const name = `bmwCodes[${i}] ${c.code || "(no code)"}`;
    req(c, "code", name);
    req(c, "title", name);
    req(c, "shortMeaning", name);
    req(c, "meaningLong", name);
    req(c, "system", name);
    req(c, "urgency", name);
    req(c, "symptoms", name);
    req(c, "causes", name);
    req(c, "firstChecks", name);
    req(c, "whenToShop", name);
    req(c, "faqs", name);

    const code = String(c.code || "").toUpperCase();
    if (!/^[0-9A-F]{4,6}$/.test(code)) errs.push(`${name}: suspicious code format`);
    if (!urgencyLabel[c.urgency]) errs.push(`${name}: unknown urgency '${c.urgency}'`);

    (c.related || []).forEach((r) => {
      if (!bmwSet.has(r)) errs.push(`${name}: related '${r}' does not exist`);
    });
  });

  brands.forEach((b, i) => {
    const name = `brands[${i}] ${b.slug || "(no slug)"}`;
    req(b, "slug", name);
    req(b, "name", name);
  });

  // Overrides must reference an existing brand + P0xxx code
  const brandSet = new Set(brands.map((b) => b.slug));
  brandOverrides.forEach((o, i) => {
    const name = `overrides[${i}]`;
    if (!brandSet.has(o.brand)) errs.push(`${name}: brand '${o.brand}' not in brands.json`);
    if (!/^[PCBU]\d{4}$/.test(String(o.code || ""))) errs.push(`${name}: invalid code '${o.code}'`);
    if (o.notes && !Array.isArray(o.notes)) errs.push(`${name}: notes must be array`);
    if (o.sources && !Array.isArray(o.sources)) errs.push(`${name}: sources must be array`);
  });

  if (errs.length) {
    console.error("\nVALIDATION FAILED:\n" + errs.slice(0, 120).join("\n"));
    if (errs.length > 120) console.error(`... plus ${errs.length - 120} more`);
    process.exit(1);
  }
}

// ── Templates / Blocks ────────────────────
function actionsHtml({ copyText, reportSubject }) {
  const mail = `mailto:DEINE-EMAIL@BEISPIEL.AT?subject=${encodeURIComponent(reportSubject)}&body=${encodeURIComponent(
    "Bitte beschreibe kurz, was falsch ist oder was fehlt (inkl. Fahrzeug/Modell/Motor, wenn relevant)."
  )}`;

  return `
<div class="actions">
  <button class="btn primary" type="button" data-copy="${esc(copyText)}">Code kopieren</button>
  <button class="btn" type="button" data-copy-link>Link kopieren</button>
  <button class="btn" type="button" data-share>Teilen</button>
  <a class="btn" href="${mail}">Fehler melden</a>
</div>`.trim();
}

function nextStepsHtml() {
  return `
<div class="content-section">
  <h2>Nächste Schritte</h2>
  <ul>
    <li><a href="${href("/wissen/obd2-auslesen/")}">OBD2 auslesen: so funktioniert’s</a></li>
    <li><a href="${href("/wissen/bank1-bank2/")}">Bank 1 / Bank 2 erklärt</a></li>
    <li><a href="${href("/wissen/motorkontrollleuchte/")}">Motorkontrollleuchte: dauerhaft vs. blinkend</a></li>
  </ul>
</div>`.trim();
}

function brandPillsHtml(code) {
  // Keep it compact: 6 most common DACH brands for quick navigation
  const pillBrands = ["vw", "audi", "bmw", "mercedes", "skoda", "opel"]
    .map((slug) => brands.find((b) => b.slug === slug))
    .filter(Boolean);

  if (!pillBrands.length) return "";

  return `
<div class="content-section">
  <h2>Dieser Code nach Marke</h2>
  <div class="pills">
    ${pillBrands
      .map(
        (b) =>
          `<span class="pill"><a href="${href(`/marke/${b.slug}/code/${code}/`)}">${esc(b.name)}</a></span>`
      )
      .join("\n")}
  </div>
  <p class="note" style="margin-top:0.75rem">
    Hinweis: Für <strong>P0xxx</strong> ist die Grundbedeutung standardisiert. Unterschiede sind meist in typischen Ursachen/Diagnosewegen je nach Motor/Modell.
  </p>
</div>`.trim();
}

function breadcrumbHtml(items) {
  // items: [{label, url?}, ...]
  return `
<div class="breadcrumb">
  ${items
    .map((it, idx) => {
      const sep = idx === 0 ? "" : " › ";
      return sep + (it.url ? `<a href="${it.url}">${esc(it.label)}</a>` : esc(it.label));
    })
    .join("")}
</div>`.trim();
}

// ── Build pages ───────────────────────────
function writeAssets() {
  ensureDir(DIST);
  fs.writeFileSync(path.join(DIST, "style.css"), css, "utf-8");
  fs.writeFileSync(path.join(DIST, "favicon.svg"), faviconSvg, "utf-8");
  console.log("  style.css");
  console.log("  favicon.svg");
}

function buildIndex() {
  const topIds = [
    "P0420",
    "P0171",
    "P0300",
    "P0455",
    "P0128",
    "P0401",
    "P0442",
    "P0172",
    "P0101",
    "P0505",
    "P0301",
    "P0302",
    "P0440",
    "P0135",
    "P0174",
    "P0430",
    "P0700",
    "P0340",
    "P0335",
    "P0121",
  ];

  const topCodes = topIds.map((id) => codes.find((c) => c.code === id)).filter(Boolean);

  const cats = {};
  codes.forEach((c) => {
    if (!cats[c.category]) cats[c.category] = [];
    cats[c.category].push(c);
  });

  let catBtns = "";
  Object.keys(categoryLabel).forEach((k) => {
    if (cats[k]) catBtns += `<a href="#cat-${k}" class="cat-tag">${esc(categoryLabel[k])}</a> `;
  });

  let catSec = "";
  Object.keys(categoryLabel).forEach((k) => {
    if (!cats[k]) return;
    catSec += `<h2 class="section-title" id="cat-${k}">${esc(categoryLabel[k])}</h2><ul class="code-list">`;
    cats[k].forEach((c) => {
      catSec += `<li><a href="${href("/code/" + c.code + "/")}"><span class="code-badge">${c.code}</span><span class="code-title">${esc(
        c.title
      )}</span><span class="urgency-dot ${c.urgency}"></span></a></li>`;
    });
    catSec += `</ul>`;
  });

  let topList = `<ul class="code-list">`;
  topCodes.forEach((c) => {
    topList += `<li><a href="${href("/code/" + c.code + "/")}"><span class="code-badge">${c.code}</span><span class="code-title">${esc(
      c.title
    )}</span><span class="urgency-dot ${c.urgency}"></span></a></li>`;
  });
  topList += `</ul>`;

  // BMW groups
  const bSys = {};
  bmwCodes.forEach((c) => {
    if (!bSys[c.system]) bSys[c.system] = [];
    bSys[c.system].push(c);
  });

  let bBtns = "";
  Object.keys(bmwSystemLabel).forEach((k) => {
    if (bSys[k]) bBtns += `<a href="#bmw-${k}" class="cat-tag">${esc(bmwSystemLabel[k])}</a> `;
  });

  let bSec = "";
  Object.keys(bmwSystemLabel).forEach((k) => {
    if (!bSys[k]) return;
    bSec += `<h3 class="section-title" id="bmw-${k}">${esc(bmwSystemLabel[k])}</h3><ul class="code-list">`;
    bSys[k].forEach((c) => {
      bSec += `<li><a href="${href("/bmw/" + c.code + "/")}"><span class="code-badge">${esc(
        c.code
      )}</span><span class="code-title">${esc(c.title)}</span><span class="urgency-dot ${c.urgency}"></span></a></li>`;
    });
    bSec += `</ul>`;
  });

  // Build search data (client-side)
  // Keep it minimal: generic codes + BMW internal codes + brands + guides
  const guides = [
    { t: "OBD2 auslesen: so funktioniert’s", u: href("/wissen/obd2-auslesen/") },
    { t: "Bank 1 / Bank 2 erklärt", u: href("/wissen/bank1-bank2/") },
    { t: "Motorkontrollleuchte: dauerhaft vs. blinkend", u: href("/wissen/motorkontrollleuchte/") },
  ];

  const searchData = [];
  codes.forEach((c) =>
    searchData.push({ type: "obd", c: c.code, t: c.title, u: href("/code/" + c.code + "/") })
  );
  bmwCodes.forEach((c) =>
    searchData.push({ type: "bmw", c: c.code, t: "[BMW] " + c.title, u: href("/bmw/" + c.code + "/") })
  );
  brands.forEach((b) =>
    searchData.push({ type: "brand", c: b.slug, t: b.name, u: href("/marke/" + b.slug + "/") })
  );
  guides.forEach((g) => searchData.push({ type: "guide", c: "", t: g.t, u: g.u }));

  const title = "OBD Fehlercode Finder – OBD-II Codes & DACH Marken";
  const description = `OBD-II Fehlercodes schnell finden und verstehen (Bedeutung, Symptome, Ursachen). Zusätzlich: Marken-Fokus für DACH (VW, Audi, BMW, Mercedes, Škoda, …).`;

  const brandOptions = [
    `<option value="">Marke wählen…</option>`,
    ...brands.map((b) => `<option value="${esc(b.slug)}">${esc(b.name)}</option>`),
  ].join("\n");

  const brandGrid = brands
    .map(
      (b) =>
        `<a class="brand-card" href="${href(`/marke/${b.slug}/`)}"><div class="brand-name">${esc(
          b.name
        )}</div><div class="brand-sub">OBD-II Codes nach Marke</div></a>`
    )
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="de">
${headCommon({
  title,
  description,
  canonical: abs("/"),
  extraJsonLd: websiteJsonLd(),
})}
<body>
${header()}
<main>
  <div class="container">
    <div class="search-section">
      <h1>OBD-II Fehlercodes nachschlagen</h1>
      <p>Wähle entweder direkt einen Code – oder öffne ihn im Kontext einer Marke (DACH‑Fokus).</p>

      <div class="search-panels" aria-label="Suchen">
        <div class="panel">
          <h2>Nur Fehlercode</h2>
          <div class="panel-row">
            <div class="search-box wide">
              ${searchIconSvg}
              <input type="text" id="codeOnly" list="codeList" placeholder="z. B. P0420" autocomplete="off" aria-label="Fehlercode">
            </div>
            <button class="btn primary" type="button" id="openCode">Öffnen</button>
          </div>
          <p class="panel-note">Für <strong>P0xxx</strong> ist die Grundbedeutung standardisiert (OBD‑II).</p>
        </div>

        <div class="panel">
          <h2>Marke + Fehlercode</h2>
          <div class="panel-row">
            <div class="select-wrap">
              <select id="brandSelect" class="select" aria-label="Marke">
                ${brandOptions}
              </select>
            </div>
            <div class="search-box wide">
              ${searchIconSvg}
              <input type="text" id="brandCode" list="codeList" placeholder="Code wählen (z. B. P0420)" autocomplete="off" aria-label="Fehlercode nach Marke" disabled>
            </div>
            <button class="btn primary" type="button" id="openBrandCode" disabled>Öffnen</button>
          </div>
          <p class="panel-note">Marken unterscheiden sich meist in <em>typischen Ursachen</em> und Diagnosewegen – nicht in der Code‑Grundbedeutung.</p>
        </div>
      </div>

      <datalist id="codeList">
        ${codeOptionsAll}
      </datalist>
    </div>

    <div class="ad-slot"><!-- Ad placeholder --></div>

    <h2 class="section-title">Beliebte Marken (DACH)</h2>
    <div class="brand-grid">
      ${brandGrid}
    </div>

    <div class="categories">${catBtns}</div>

    <h2 class="section-title">Häufig gesuchte OBD-II Codes</h2>
    ${topList}

    ${catSec}

    <div class="section-divider">
      <h2 style="font-size:1.4rem;margin-bottom:0.5rem">Wissen</h2>
      <ul class="guide-list">
        <li><a href="${href("/wissen/obd2-auslesen/")}">OBD2 auslesen: so funktioniert’s</a><p>Port finden, Scanner/Apps, typische Fehler beim Auslesen.</p></li>
        <li><a href="${href("/wissen/bank1-bank2/")}">Bank 1 / Bank 2 erklärt</a><p>Was die „Bank“ bedeutet und warum es wichtig ist.</p></li>
        <li><a href="${href("/wissen/motorkontrollleuchte/")}">Motorkontrollleuchte: dauerhaft vs. blinkend</a><p>Wann du weiterfahren kannst und wann nicht.</p></li>
      </ul>
    </div>

    <div id="bmw-section" class="section-divider">
      <h2 style="font-size:1.4rem;margin-bottom:0.5rem">BMW Fehlercodes (Beta)</h2>
      <p style="color:var(--text-muted);margin-bottom:1rem">
        Herstellerspezifische BMW-Codes – Qualität hängt von deiner Datenquelle ab. Wenn etwas nicht passt: „Fehler melden“ auf der Code-Seite.
      </p>
      <div class="categories">${bBtns}</div>
      ${bSec}
    </div>
  </div>
</main>

${footer()}
${toastHtml()}
${commonClientJs}

<script>
(function(){
  function norm(q){
    return String(q||"").trim().toUpperCase().replace(/\s+/g,"").replace(/[^A-Z0-9]/g, "");
  }
  function isObd(q){ return /^[PCBU]\d{4}$/.test(q); }
  function toast(msg){
    if(window.showToast) window.showToast(msg);
    else alert(msg);
  }

  var codeOnly = document.getElementById('codeOnly');
  var openCode = document.getElementById('openCode');

  var brandSel = document.getElementById('brandSelect');
  var brandCode = document.getElementById('brandCode');
  var openBrand = document.getElementById('openBrandCode');

  function setBrandEnabled(){
    var enabled = !!brandSel.value;
    brandCode.disabled = !enabled;
    openBrand.disabled = !enabled;
    if(enabled) brandCode.focus();
  }

  function openGeneric(){
    var v = norm(codeOnly.value);
    if(!isObd(v)){
      toast('Bitte einen gültigen OBD-II Code eingeben (z. B. P0420).');
      codeOnly.focus();
      return;
    }
    window.location.href = ${JSON.stringify(BASE_PATH)} + '/code/' + v + '/';
  }

  function openBrandCode(){
    var b = brandSel.value;
    if(!b){
      toast('Bitte zuerst eine Marke auswählen.');
      brandSel.focus();
      return;
    }
    var v = norm(brandCode.value);
    if(!isObd(v)){
      toast('Bitte einen gültigen OBD-II Code auswählen (z. B. P0420).');
      brandCode.focus();
      return;
    }
    window.location.href = ${JSON.stringify(BASE_PATH)} + '/marke/' + b + '/code/' + v + '/';
  }

  openCode.addEventListener('click', openGeneric);
  codeOnly.addEventListener('keydown', function(e){ if(e.key==='Enter') openGeneric(); });

  openBrand.addEventListener('click', openBrandCode);
  brandCode.addEventListener('keydown', function(e){ if(e.key==='Enter') openBrandCode(); });

  brandSel.addEventListener('change', setBrandEnabled);

  // Prefill support: ?code=P0420  or ?brand=vw&code=P0420
  var params = new URLSearchParams(window.location.search);
  var bParam = params.get('brand');
  var cParam = params.get('code');
  if(bParam){
    brandSel.value = bParam;
    setBrandEnabled();
  }else{
    setBrandEnabled();
  }
  if(cParam){
    var c = norm(cParam);
    if(bParam){
      brandCode.value = c;
    }else{
      codeOnly.value = c;
    }
  }
})();
</script>
</body>
</html>`;

  ensureDir(DIST);
  fs.writeFileSync(path.join(DIST, "index.html"), html, "utf-8");
  console.log("  index.html");
}

function buildBrandsIndex() {
  const dir = path.join(DIST, "marken");
  ensureDir(dir);

  const title = "Automarken (DACH) – OBD-II Fehlercodes";
  const description = "Wähle eine Marke (DACH-Fokus) und suche OBD-II Fehlercodes nach Hersteller-Kontext.";

  const grid = brands
    .map(
      (b) =>
        `<a class="brand-card" href="${href(`/marke/${b.slug}/`)}"><div class="brand-name">${esc(
          b.name
        )}</div><div class="brand-sub">OBD-II Codes nach Marke</div></a>`
    )
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="de">
${headCommon({
  title,
  description,
  canonical: abs("/marken/"),
})}
<body>
${header()}
<main>
  <div class="container">
    ${breadcrumbHtml([
      { label: "Startseite", url: href("/") },
      { label: "Marken (DACH)" },
    ])}

    <div class="code-header">
      <h1>Marken (DACH)</h1>
      <p class="short-meaning">Wähle eine Marke. Danach kannst du OBD-II Codes direkt im Marken-Kontext öffnen (z. B. „P0420 VW“).</p>
    </div>

    <div class="brand-grid">
      ${grid}
    </div>

    <div class="content-section">
      <h2>Hinweis</h2>
      <p><strong>P0xxx</strong> Codes sind standardisiert. Marken-/Modell-Unterschiede zeigen sich meistens in typischen Ursachen, Diagnosewegen und Motorvarianten.</p>
    </div>
  </div>
</main>
${footer()}
</body>
</html>`;

  fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8");
  console.log("  marken/index.html");
}

function buildBrandLanding(b) {
  const brandSlug = normalizeBrandSlug(b.slug);
  const dir = path.join(DIST, "marke", brandSlug);
  ensureDir(dir);

  const title = `${b.name} Fehlercodes – OBD-II Code Finder`;
  const description = `OBD-II Fehlercodes für ${b.name}: Codes nachschlagen und im Marken-Kontext lesen (DACH).`;

  // A compact list of top codes for the brand landing
  const topIds = ["P0420", "P0171", "P0300", "P0455", "P0128", "P0401", "P0442", "P0101", "P0174", "P0430"]; 
  const topCodes = topIds.map((id) => codes.find((c) => c.code === id)).filter(Boolean);

  let topList = `<ul class="code-list">`;
  topCodes.forEach((c) => {
    topList += `<li><a href="${href(`/marke/${brandSlug}/code/${c.code}/`)}"><span class="code-badge">${c.code}</span><span class="code-title">${esc(
      c.title
    )}</span><span class="urgency-dot ${c.urgency}"></span></a></li>`;
  });
  topList += `</ul>`;

  const html = `<!DOCTYPE html>
<html lang="de">
${headCommon({
  title,
  description,
  canonical: abs(`/marke/${brandSlug}/`),
})}
<body>
${header()}
<main>
  <div class="container">
    ${breadcrumbHtml([
      { label: "Startseite", url: href("/") },
      { label: "Marken (DACH)", url: href("/marken/") },
      { label: b.name },
    ])}

    <div class="code-header">
      <h1>${esc(b.name)} – OBD-II Fehlercodes</h1>
      <p class="short-meaning">Suche einen Code (z. B. <strong>P0420</strong>). Du landest automatisch auf der passenden Marken‑Code‑Seite.</p>

      <div class="search-panels" style="margin-top:1rem">
        <div class="panel" style="max-width:680px;margin:0 auto">
          <h2>Code auswählen</h2>
          <div class="panel-row">
            <div class="brand-fixed" aria-label="Marke">${esc(b.name)}</div>
            <div class="search-box wide">
              ${searchIconSvg}
              <input type="text" id="brandCode" list="codeList" placeholder="z. B. P0420" autocomplete="off" aria-label="Fehlercode">
            </div>
            <button class="btn primary" type="button" id="go">Öffnen</button>
            <a class="btn" href="${href("/marken/")}">Zur Markenübersicht</a>
          </div>

          <datalist id="codeList">
            ${codeOptionsAll}
          </datalist>

          <p class="panel-note">Tipp: Wenn du keinen Code hast, musst du ihn zuerst auslesen (siehe <a href="${href("/wissen/obd2-auslesen/")}">OBD2 auslesen</a>).</p>
        </div>
      </div>

      <p class="note" style="margin-top:0.9rem">
        Hinweis: Für <strong>P0xxx</strong> ist die Grundbedeutung standardisiert. Je nach Motor/Modell kann die typische Ursache variieren.
      </p>
    </div>

    <div class="ad-slot"><!-- Ad placeholder --></div>

    <h2 class="section-title">Häufig bei ${esc(b.name)} gesucht</h2>
    ${topList}

    <div class="content-section">
      <h2>Tipps</h2>
      <ul>
        <li>Wenn du nur „Motorkontrollleuchte an“ hast: zuerst Code auslesen (siehe <a href="${href("/wissen/obd2-auslesen/")}">Wissen</a>).</li>
        <li>Bei <strong>blinkender</strong> Motorkontrollleuchte: nicht weiter belasten, zügig Werkstatt (siehe <a href="${href(
          "/wissen/motorkontrollleuchte/"
        )}">Erklärung</a>).</li>
      </ul>
    </div>

    ${b.slug === "bmw" ? `
    <div class="content-section">
      <h2>BMW interne Codes</h2>
      <p>Zusätzlich haben wir einen Bereich für BMW‑interne Codes (Beta): <a href="${href("/#bmw-section")}">BMW‑Liste auf der Startseite</a>.</p>
    </div>` : ""}
  </div>
</main>
${footer()}
${toastHtml()}
${commonClientJs}

<script>
(function(){
  function norm(q){ return String(q||"").trim().toUpperCase().replace(/\s+/g,"").replace(/[^A-Z0-9]/g, ""); }
  function isObd(q){ return /^[PCBU]\d{4}$/.test(q); }
  function toast(msg){
    if(window.showToast) window.showToast(msg);
    else alert(msg);
  }

  var inp = document.getElementById('brandCode');
  var go = document.getElementById('go');

  function open(){
    var v = norm(inp.value);
    if(!isObd(v)){
      toast('Bitte einen gültigen OBD-II Code wählen (z. B. P0420).');
      inp.focus();
      return;
    }
    window.location.href = ${JSON.stringify(href(`/marke/${brandSlug}/code/`))} + v + '/';
  }

  go.addEventListener('click', open);
  inp.addEventListener('keydown', function(e){ if(e.key==='Enter') open(); });
})();
</script>
</body>
</html>`;

  fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8");
}

function getBrandOverride(brandSlug, code) {
  const hit = brandOverrides.find(
    (o) => normalizeBrandSlug(o.brand) === brandSlug && String(o.code || "").toUpperCase() === code
  );
  return hit || null;
}

function buildBrandCodePage(b, c) {
  const brandSlug = normalizeBrandSlug(b.slug);
  const dir = path.join(DIST, "marke", brandSlug, "code", c.code);
  ensureDir(dir);

  const title = `${b.name} OBD Code ${c.code} – Bedeutung, Symptome, Ursachen`;
  const description = `${c.code} (${b.name}): ${c.shortMeaning} Symptome, Ursachen, Dringlichkeit und Checks.`;

  const override = getBrandOverride(brandSlug, c.code);

  const brandContext = `
  <div class="content-section">
    <h2>${esc(b.name)}-Kontext (DACH)</h2>
    <p>Die Grundbedeutung von <strong>${esc(c.code)}</strong> ist bei <strong>P0xxx</strong> standardisiert. In der Praxis unterscheiden sich je nach Motor/Modell oft die <em>typischen Ursachen</em> und der <em>Diagnoseweg</em> (Livewerte, Freeze-Frame, Abgas-/Unterdrucktests, etc.).</p>
    <ul>
      <li>Wenn du den Code nur einmal hattest: nach Löschen beobachten – aber Ursache nicht ignorieren.</li>
      <li>Wenn der Code wiederkommt: Livewerte/Freeze-Frame prüfen lassen oder Werkstatt aufsuchen.</li>
    </ul>
  </div>`.trim();

  const overrideBlock = override
    ? `
  <div class="content-section">
    <h2>Marken-Hinweise (quellebasiert)</h2>
    <ul>${listHtml(override.notes || [])}</ul>
    ${(override.sources || []).length
      ? `<p class="note" style="margin-top:0.75rem"><strong>Quellen:</strong> ${(override.sources || [])
          .map((s) => `<a href="${esc(s)}" rel="noopener" target="_blank">${esc(s)}</a>`)
          .join(" · ")}</p>`
      : `<p class="note" style="margin-top:0.75rem">(Noch keine Quellen hinterlegt.)</p>`}
  </div>`.trim()
    : `
  <div class="content-section">
    <h2>Marken-Hinweise</h2>
    <p class="note">Für ${esc(b.name)} sind aktuell keine zusätzlichen, quellebasierten Hinweise hinterlegt. Wenn du verlässliche Quellen hast: „Fehler melden“ und Link mitschicken.</p>
  </div>`.trim();

  const jsonLd = faqLdJson(c.faqs);

  const hint = `<p class="note" style="margin-top:0.75rem">
    Hinweis: Diese Seite ist <strong>${esc(b.name)} + ${esc(c.code)}</strong>. Für die generische Erklärung ohne Marke: <a href="${href(`/code/${c.code}/`)}">${esc(
    c.code
  )} OBD‑II</a>.
  </p>`;

  const related =
    c.related && c.related.length
      ? `<div class="content-section"><h2>Verwandte Fehlercodes</h2><div class="related-codes">${c.related
          .map((r) => `<a href="${href(`/marke/${brandSlug}/code/${r}/`)}">${esc(r)}</a>`)
          .join("")}</div></div>`
      : "";

  const html = `<!DOCTYPE html>
<html lang="de">
${headCommon({
  title,
  description,
  canonical: abs(`/marke/${brandSlug}/code/${c.code}/`),
  extraJsonLd: jsonLd,
})}
<body>
${header()}
<main>
  <div class="container">
    ${breadcrumbHtml([
      { label: "Startseite", url: href("/") },
      { label: "Marken (DACH)", url: href("/marken/") },
      { label: b.name, url: href(`/marke/${brandSlug}/`) },
      { label: c.code },
    ])}

    <div class="code-header">
      <h1>${esc(b.name)} – OBD Code ${esc(c.code)}</h1>
      <p class="short-meaning">${esc(c.shortMeaning)}</p>
      <div class="urgency-badge ${c.urgency}">
        <span class="urgency-dot ${c.urgency}"></span>
        Dringlichkeit: ${urgencyLabel[c.urgency]}
      </div>
      ${actionsHtml({ copyText: c.code, reportSubject: `Hinweis/Fehler: ${b.name} ${c.code}` })}
      ${hint}
    </div>

    ${brandContext}
    ${overrideBlock}

    <div class="content-section">
      <h2>Bedeutung</h2>
      <p>${esc(c.meaningLong)}</p>
    </div>

    <div class="content-section">
      <h2>Symptome</h2>
      <ul>${listHtml(c.symptoms)}</ul>
    </div>

    <div class="content-section">
      <h2>Mögliche Ursachen</h2>
      <ul>${listHtml(c.causes)}</ul>
    </div>

    <div class="content-section">
      <h2>Wie dringend ist ${esc(c.code)}?</h2>
      <p><strong>${urgencyLabel[c.urgency]}:</strong> ${urgencyDesc[c.urgency]}</p>
    </div>

    <div class="ad-slot"><!-- Ad placeholder --></div>

    <div class="content-section">
      <h2>Erste Checks (sichere Basics)</h2>
      <ul>${listHtml(c.firstChecks)}</ul>
      <p style="margin-top:0.75rem;font-size:0.85rem;color:var(--text-muted)"><em>Hinweis: Diese Checks ersetzen keine Diagnose (Livewerte/Freeze-Frame).</em></p>
    </div>

    <div class="content-section">
      <h2>Wann in die Werkstatt?</h2>
      <p>${esc(c.whenToShop)}</p>
    </div>

    ${nextStepsHtml()}

    <div class="content-section">
      <h2>Häufige Fragen zu ${esc(c.code)}</h2>
      <ul class="faq-list">${faqHtml(c.faqs)}</ul>
    </div>

    ${related}
  </div>
</main>

${footer()}
${toastHtml()}
${commonClientJs}
</body>
</html>`;

  fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8");
}

function buildOBD(c) {
  const dir = path.join(DIST, "code", c.code);
  ensureDir(dir);

  const title = `OBD Code ${c.code} – Bedeutung, Symptome, Ursachen`;
  const description = `${c.code}: ${c.shortMeaning} Symptome, Ursachen, Dringlichkeit und Checks.`;

  const related =
    c.related && c.related.length
      ? `<div class="content-section"><h2>Verwandte Fehlercodes</h2><div class="related-codes">${c.related
          .map((r) => `<a href="${href("/code/" + r + "/")}">${esc(r)}</a>`)
          .join("")}</div></div>`
      : "";

  const hint = `<p class="note" style="margin-top:0.75rem">
    Hinweis: OBD-II Codes (v. a. <strong>P0xxx</strong>) sind generisch. Die genaue Ursache kann je nach Hersteller/Modell/Motorisierung abweichen – für eine sichere Diagnose ist ein Live-Daten/Freeze-Frame-Check sinnvoll.
  </p>`;

  const jsonLd = faqLdJson(c.faqs);

  const html = `<!DOCTYPE html>
<html lang="de">
${headCommon({
  title,
  description,
  canonical: abs(`/code/${c.code}/`),
  extraJsonLd: jsonLd,
})}
<body>
${header()}
<main>
  <div class="container">
    ${breadcrumbHtml([
      { label: "Startseite", url: href("/") },
      { label: categoryLabel[c.category] || c.category, url: href("/#cat-" + c.category) },
      { label: c.code },
    ])}

    <div class="code-header">
      <h1>${esc(title)}</h1>
      <p class="short-meaning">${esc(c.shortMeaning)}</p>
      <div class="urgency-badge ${c.urgency}">
        <span class="urgency-dot ${c.urgency}"></span>
        Dringlichkeit: ${urgencyLabel[c.urgency]}
      </div>
      ${actionsHtml({ copyText: c.code, reportSubject: `Hinweis/Fehler: OBD ${c.code}` })}
      ${hint}
    </div>

    <div class="content-section">
      <h2>Bedeutung</h2>
      <p>${esc(c.meaningLong)}</p>
    </div>

    ${brandPillsHtml(c.code)}

    <div class="content-section">
      <h2>Symptome</h2>
      <ul>${listHtml(c.symptoms)}</ul>
    </div>

    <div class="content-section">
      <h2>Mögliche Ursachen</h2>
      <ul>${listHtml(c.causes)}</ul>
    </div>

    <div class="content-section">
      <h2>Wie dringend ist ${esc(c.code)}?</h2>
      <p><strong>${urgencyLabel[c.urgency]}:</strong> ${urgencyDesc[c.urgency]}</p>
    </div>

    <div class="ad-slot"><!-- Ad placeholder --></div>

    <div class="content-section">
      <h2>Erste Checks (sichere Basics)</h2>
      <ul>${listHtml(c.firstChecks)}</ul>
      <p style="margin-top:0.75rem;font-size:0.85rem;color:var(--text-muted)"><em>Hinweis: Diese Prüfungen ersetzen keine professionelle Diagnose.</em></p>
    </div>

    <div class="content-section">
      <h2>Wann in die Werkstatt?</h2>
      <p>${esc(c.whenToShop)}</p>
    </div>

    ${nextStepsHtml()}

    <div class="content-section">
      <h2>Häufige Fragen zu ${esc(c.code)}</h2>
      <ul class="faq-list">${faqHtml(c.faqs)}</ul>
    </div>

    ${related}
  </div>
</main>

${footer()}
${toastHtml()}
${commonClientJs}
</body>
</html>`;

  fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8");
}

function buildBMW(c) {
  const dir = path.join(DIST, "bmw", c.code);
  ensureDir(dir);

  const systemNice = bmwSystemLabel[c.system] || c.system;

  const title = `BMW Fehlercode ${c.code} (${c.system}) – Bedeutung & Ursachen`;
  const description = `BMW ${c.code}: ${c.shortMeaning} Steuergerät: ${c.system}. Symptome, Ursachen und Checks.`;

  const related =
    c.related && c.related.length
      ? `<div class="content-section"><h2>Verwandte BMW-Codes</h2><div class="related-codes">${c.related
          .map((r) => `<a href="${href("/bmw/" + r + "/")}">${esc(r)}</a>`)
          .join("")}</div></div>`
      : "";

  const jsonLd = faqLdJson(c.faqs);

  const html = `<!DOCTYPE html>
<html lang="de">
${headCommon({
  title,
  description,
  canonical: abs(`/bmw/${c.code}/`),
  extraJsonLd: jsonLd,
})}
<body>
${header()}
<main>
  <div class="container">
    ${breadcrumbHtml([
      { label: "Startseite", url: href("/") },
      { label: "BMW (Beta)", url: href("/#bmw-section") },
      { label: "BMW " + c.system, url: href("/#bmw-" + c.system) },
      { label: c.code },
    ])}

    <div class="code-header">
      <h1>BMW Fehlercode ${esc(c.code)} – ${esc(c.title)}</h1>
      <p class="short-meaning"><strong>Steuergerät:</strong> ${esc(systemNice)}</p>
      <p class="short-meaning">${esc(c.shortMeaning)}</p>
      <div class="urgency-badge ${c.urgency}">
        <span class="urgency-dot ${c.urgency}"></span>
        Dringlichkeit: ${urgencyLabel[c.urgency]}
      </div>
      ${actionsHtml({ copyText: c.code, reportSubject: `Hinweis/Fehler: BMW ${c.code}` })}
      <p class="note" style="margin-top:0.75rem">
        Hinweis: BMW-interne Codes können je nach Baureihe/Softwarestand abweichen. Für sichere Diagnose: ISTA/Freeze-Frame/Livewerte prüfen.
      </p>
    </div>

    <div class="content-section">
      <h2>Bedeutung</h2>
      <p>${esc(c.meaningLong)}</p>
    </div>

    <div class="content-section">
      <h2>Symptome</h2>
      <ul>${listHtml(c.symptoms)}</ul>
    </div>

    <div class="content-section">
      <h2>Mögliche Ursachen</h2>
      <ul>${listHtml(c.causes)}</ul>
    </div>

    <div class="content-section">
      <h2>Wie dringend ist ${esc(c.code)}?</h2>
      <p><strong>${urgencyLabel[c.urgency]}:</strong> ${urgencyDesc[c.urgency]}</p>
    </div>

    <div class="ad-slot"><!-- Ad placeholder --></div>

    <div class="content-section">
      <h2>Erste Checks (sichere Basics)</h2>
      <ul>${listHtml(c.firstChecks)}</ul>
      <p style="margin-top:0.75rem;font-size:0.85rem;color:var(--text-muted)"><em>BMW-interne Codes lassen sich oft nur mit BMW-Diagnose-Tools vollständig auswerten.</em></p>
    </div>

    <div class="content-section">
      <h2>Wann in die Werkstatt?</h2>
      <p>${esc(c.whenToShop)}</p>
    </div>

    ${nextStepsHtml()}

    <div class="content-section">
      <h2>Häufige Fragen zu ${esc(c.code)}</h2>
      <ul class="faq-list">${faqHtml(c.faqs)}</ul>
    </div>

    ${related}
  </div>
</main>

${footer()}
${toastHtml()}
${commonClientJs}
</body>
</html>`;

  fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8");
}

function buildSimplePage({ slug, pageTitle, description, canonicalPath, bodyHtml, jsonLd = "" }) {
  const dir = path.join(DIST, slug);
  ensureDir(dir);

  const html = `<!DOCTYPE html>
<html lang="de">
${headCommon({
  title: pageTitle,
  description,
  canonical: abs(canonicalPath || `/${slug}/`),
  extraJsonLd: jsonLd,
})}
<body>
${header()}
<main>
  <div class="container">
    <div class="code-header">
      <h1>${esc(pageTitle)}</h1>
      <p class="short-meaning">${esc(description)}</p>
    </div>

    <div class="content-section legal">
      ${bodyHtml}
    </div>
  </div>
</main>
${footer()}
</body>
</html>`;

  fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8");
  console.log(`  ${slug}/index.html`);
}

function buildLegalPages() {
  // NOTE: These are structured placeholders. Replace bracketed fields with your real details.
  buildSimplePage({
    slug: "impressum",
    pageTitle: "Impressum",
    description: "Anbieterkennzeichnung gemäß geltendem Recht.",
    bodyHtml: `
      <h2>Angaben zum Diensteanbieter</h2>
      <p><strong>Name/Unternehmen:</strong> [DEIN NAME ODER FIRMA]<br>
      <strong>Adresse:</strong> [STRASSE, PLZ, ORT, LAND]</p>

      <h2>Kontakt</h2>
      <p><strong>E-Mail:</strong> [DEINE EMAIL]<br>
      <strong>Telefon (optional):</strong> [DEINE NUMMER]</p>

      <h2>Haftung für Inhalte</h2>
      <p>Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen wir jedoch keine Gewähr.</p>

      <h2>Haftung für Links</h2>
      <p>Diese Website enthält ggf. Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.</p>

      <h2>Urheberrecht</h2>
      <p>Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung.</p>
    `,
  });

  buildSimplePage({
    slug: "datenschutz",
    pageTitle: "Datenschutzerklärung",
    description: "Informationen zur Verarbeitung personenbezogener Daten.",
    bodyHtml: `
      <h2>1. Verantwortlicher</h2>
      <p><strong>[DEIN NAME / FIRMA]</strong><br>
      [ADRESSE]<br>
      E-Mail: [EMAIL]</p>

      <h2>2. Allgemeine Hinweise</h2>
      <p>Diese Website dient der Information zu OBD-Fehlercodes. Es werden keine Nutzerkonten angeboten und im MVP keine personenbezogenen Daten aktiv gespeichert.</p>

      <h2>3. Server-Logfiles</h2>
      <p>Beim Aufruf der Website können durch den Hosting-Provider technisch bedingt Daten (z. B. IP-Adresse, Zeitpunkt, aufgerufene Seite, User-Agent) in Server-Logfiles verarbeitet werden. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherem Betrieb).</p>

      <h2>4. Werbung / Google AdSense (optional)</h2>
      <p>Wenn du Google AdSense einbindest, können Cookies und ähnliche Technologien eingesetzt werden, um Anzeigen zu personalisieren oder nicht zu personalisieren. Ergänze hier die konkreten Angaben deines Setups (Consent-Banner, personalisierte Anzeigen, etc.).</p>

      <h2>5. Kontaktaufnahme</h2>
      <p>Wenn du per E-Mail Kontakt aufnimmst, werden die übermittelten Daten zur Bearbeitung der Anfrage verarbeitet (Art. 6 Abs. 1 lit. b oder f DSGVO).</p>

      <h2>6. Deine Rechte</h2>
      <p>Du hast Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch sowie ein Beschwerderecht bei einer Aufsichtsbehörde.</p>

      <h2>7. Aktualität</h2>
      <p>Diese Datenschutzerklärung wird bei Bedarf angepasst, z. B. bei Einbindung neuer Dienste.</p>
    `,
  });
}

function buildInfoPages() {
  // Index
  const dir = path.join(DIST, "wissen");
  ensureDir(dir);

  const title = "Wissen – OBD2, Bank 1/2, Motorkontrollleuchte";
  const description = "Kurze Erklärseiten zu typischen OBD-Themen.";

  const list = `
  <ul class="guide-list">
    <li><a href="${href("/wissen/obd2-auslesen/")}">OBD2 auslesen: so funktioniert’s</a><p>Port, Scanner, Apps, typische Fehler beim Auslesen.</p></li>
    <li><a href="${href("/wissen/bank1-bank2/")}">Bank 1 / Bank 2 erklärt</a><p>V‑Motoren, Reihenmotoren, warum das in Codes auftaucht.</p></li>
    <li><a href="${href("/wissen/motorkontrollleuchte/")}">Motorkontrollleuchte: dauerhaft vs. blinkend</a><p>Wann es kritisch ist und was du vermeiden solltest.</p></li>
  </ul>`;

  const html = `<!DOCTYPE html>
<html lang="de">
${headCommon({ title, description, canonical: abs("/wissen/") })}
<body>
${header()}
<main>
  <div class="container">
    ${breadcrumbHtml([{ label: "Startseite", url: href("/") }, { label: "Wissen" }])}

    <div class="code-header">
      <h1>Wissen</h1>
      <p class="short-meaning">Kurz erklärt – damit du Fehlercodes besser einordnen kannst.</p>
    </div>
    ${list}
  </div>
</main>
${footer()}
</body>
</html>`;

  fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8");
  console.log("  wissen/index.html");

  // OBD2 auslesen
  buildSimplePage({
    slug: "wissen/obd2-auslesen",
    pageTitle: "OBD2 auslesen: so funktioniert’s",
    description: "OBD-Port finden, Scanner/Apps nutzen und typische Fehler vermeiden.",
    canonicalPath: "/wissen/obd2-auslesen/",
    bodyHtml: `
      <h2>1) OBD-Port finden</h2>
      <p>Meist sitzt der OBD2-Port im Fahrerfußraum (unter dem Lenkrad) oder seitlich am Armaturenbrett. Bei manchen Modellen ist er hinter einer Abdeckung versteckt.</p>

      <h2>2) Scanner/Adapter</h2>
      <ul>
        <li><strong>Einfacher OBD2-Scanner:</strong> zeigt Codes an, kann oft löschen.</li>
        <li><strong>ELM327-Adapter + App:</strong> Handy verbindet sich (Bluetooth/WLAN) und zeigt Codes/Livewerte (Qualität schwankt).</li>
      </ul>

      <h2>3) Richtig auslesen</h2>
      <ul>
        <li>Zündung an (Motor aus) – je nach Gerät.</li>
        <li>Codes notieren: <strong>Code</strong> + <strong>Status</strong> (pending/confirmed) + ggf. Freeze-Frame.</li>
        <li>Nach dem Löschen beobachten, ob der Code wiederkommt.</li>
      </ul>

      <h2>4) Typische Fehler</h2>
      <ul>
        <li>Billig-Adapter liefert falsche Daten oder bricht ab.</li>
        <li>Nur Code löschen ohne Ursache zu beheben → kommt wieder.</li>
        <li>Bei blinkender MIL weiter Vollgas fahren → kann Folgeschäden verursachen.</li>
      </ul>

      <p class="note">Hinweis: Diese Seite ist keine Reparaturanleitung. Für sichere Diagnose sind Livewerte und ggf. Werkstatt-Tests nötig.</p>
    `,
  });

  // Bank 1/2
  buildSimplePage({
    slug: "wissen/bank1-bank2",
    pageTitle: "Bank 1 / Bank 2 erklärt",
    description: "Was „Bank“ bedeutet und warum es in Fehlercodes auftaucht.",
    canonicalPath: "/wissen/bank1-bank2/",
    bodyHtml: `
      <h2>Was ist „Bank“?</h2>
      <p>Bei V‑Motoren gibt es zwei Zylinderreihen – das nennt man Bank 1 und Bank 2. Bank 1 ist die Seite mit Zylinder 1. Bei Reihenmotoren gibt es oft nur eine Bank.</p>

      <h2>Warum ist das wichtig?</h2>
      <ul>
        <li>Codes wie <strong>P0420</strong> (Bank 1) und <strong>P0430</strong> (Bank 2) beziehen sich auf die jeweilige Abgasstrecke.</li>
        <li>Bei Gemisch-/Sensorcodes hilft es zu wissen, welche Seite betroffen ist.</li>
      </ul>

      <h2>Wie finde ich Bank 1?</h2>
      <p>Im Zweifel: Service-Dokumentation, Motorcode oder Werkstatt. „Zylinder 1“ ist nicht immer auf derselben Fahrzeugseite.</p>
    `,
  });

  // MIL
  buildSimplePage({
    slug: "wissen/motorkontrollleuchte",
    pageTitle: "Motorkontrollleuchte: dauerhaft vs. blinkend",
    description: "Was das Leuchten bedeutet und wann es kritisch wird.",
    canonicalPath: "/wissen/motorkontrollleuchte/",
    bodyHtml: `
      <h2>Dauerhaft an</h2>
      <p>Meist liegt ein Fehler vor, der Emissionen/Regelung betrifft. Weiterfahrt ist oft möglich, aber du solltest zeitnah auslesen und Ursachen prüfen lassen – besonders vor längeren Fahrten.</p>

      <h2>Blinkend</h2>
      <p>Das kann auf akute Zündaussetzer hindeuten. In diesem Fall: Last reduzieren, nicht hoch drehen, möglichst bald anhalten und Werkstatt kontaktieren. Weiterfahrt unter hoher Last kann Folgeschäden verursachen (z. B. am Kat).</p>

      <h2>Was du sofort tun kannst</h2>
      <ul>
        <li>Code auslesen und notieren.</li>
        <li>Bei ungewöhnlichen Geräuschen/Leistungsverlust: vorsichtig weiter oder stehen lassen.</li>
        <li>Bei blinkender MIL: nicht „wegfahren bis es passt“.</li>
      </ul>
    `,
  });
}

function build404() {
  // GitHub Pages uses /404.html
  const html = `<!DOCTYPE html>
<html lang="de">
${headCommon({
  title: "404 – Seite nicht gefunden",
  description: "Die Seite wurde nicht gefunden. Suche nach einem OBD-II Fehlercode.",
  canonical: abs("/404.html"),
})}
<body>
${header()}
<main>
  <div class="container">
    <div class="code-header">
      <h1>404 – Seite nicht gefunden</h1>
      <p class="short-meaning">Vielleicht war der Link falsch. Suche nach einem Fehlercode (z. B. P0420) oder geh zurück zur Startseite.</p>

      <div class="search-controls" style="margin-top:1rem">
        <div class="select-wrap">
          <select id="b" class="select" aria-label="Marke">
            <option value="">Alle Marken</option>
            ${brands.map((b) => `<option value="${esc(b.slug)}">${esc(b.name)}</option>`).join("\n")}
          </select>
        </div>
        <div class="search-box wide">
          ${searchIconSvg}
          <input type="text" id="q" placeholder="Code eingeben…" autocomplete="off" aria-label="Code suchen">
        </div>
        <button class="btn primary" type="button" id="go">Suchen</button>
      </div>
    </div>

    <div class="content-section">
      <p><a href="${href("/")}">Zur Startseite</a> · <a href="${href("/marken/")}">Marken</a> · <a href="${href("/wissen/")}">Wissen</a></p>
    </div>
  </div>
</main>
${footer()}

<script>
(function(){
  function norm(q){ return String(q||"").trim().toUpperCase().replace(/\s+/g,"").replace(/[^A-Z0-9]/g, ""); }
  function isObd(q){ return /^[PCBU]\d{4}$/.test(q); }

  var inp = document.getElementById('q');
  var sel = document.getElementById('b');
  var go = document.getElementById('go');

  function open(){
    var v = norm(inp.value);
    var b = sel.value;
    if(!v){ window.location.href = ${JSON.stringify(href('/'))}; return; }
    if(isObd(v)){
      if(b){ window.location.href = ${JSON.stringify(href('/marke/'))} + b + '/code/' + v + '/'; return; }
      window.location.href = ${JSON.stringify(href('/code/'))} + v + '/';
      return;
    }
    window.location.href = ${JSON.stringify(href('/'))} + '?brand=' + encodeURIComponent(b) + '&q=' + encodeURIComponent(inp.value);
  }

  go.addEventListener('click', open);
  inp.addEventListener('keydown', function(e){ if(e.key==='Enter') open(); });
})();
</script>
</body>
</html>`;

  ensureDir(DIST);
  fs.writeFileSync(path.join(DIST, "404.html"), html, "utf-8");
  // also provide /404/index.html for some hosts
  const dir = path.join(DIST, "404");
  ensureDir(dir);
  fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8");
  console.log("  404.html");
}

function buildSitemap() {
  const d = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `<url><loc>${abs("/")}</loc><lastmod>${d}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n`;
  xml += `<url><loc>${abs("/marken/")}</loc><lastmod>${d}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>\n`;
  xml += `<url><loc>${abs("/wissen/")}</loc><lastmod>${d}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>\n`;
  ["/wissen/obd2-auslesen/", "/wissen/bank1-bank2/", "/wissen/motorkontrollleuchte/"].forEach((p) => {
    xml += `<url><loc>${abs(p)}</loc><lastmod>${d}</lastmod><changefreq>yearly</changefreq><priority>0.4</priority></url>\n`;
  });

  xml += `<url><loc>${abs("/datenschutz/")}</loc><lastmod>${d}</lastmod><changefreq>yearly</changefreq><priority>0.2</priority></url>\n`;
  xml += `<url><loc>${abs("/impressum/")}</loc><lastmod>${d}</lastmod><changefreq>yearly</changefreq><priority>0.2</priority></url>\n`;

  // Brands
  brands.forEach((b) => {
    xml += `<url><loc>${abs("/marke/" + b.slug + "/")}</loc><lastmod>${d}</lastmod><changefreq>weekly</changefreq><priority>0.55</priority></url>\n`;
  });

  // Generic OBD codes
  codes.forEach((c) => {
    xml += `<url><loc>${abs("/code/" + c.code + "/")}</loc><lastmod>${d}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`;
  });

  // Brand + code pages (DACH focus)
  brands.forEach((b) => {
    codes.forEach((c) => {
      xml += `<url><loc>${abs("/marke/" + b.slug + "/code/" + c.code + "/")}</loc><lastmod>${d}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n`;
    });
  });

  // BMW internal codes
  bmwCodes.forEach((c) => {
    xml += `<url><loc>${abs("/bmw/" + c.code + "/")}</loc><lastmod>${d}</lastmod><changefreq>monthly</changefreq><priority>0.55</priority></url>\n`;
  });

  xml += `</urlset>`;
  fs.writeFileSync(path.join(DIST, "sitemap.xml"), xml, "utf-8");
  console.log("  sitemap.xml");
}

function buildRobots() {
  const txt = `User-agent: *\nAllow: /\n\nSitemap: ${abs("/sitemap.xml")}\n`;
  fs.writeFileSync(path.join(DIST, "robots.txt"), txt, "utf-8");
  console.log("  robots.txt");
}

// ── RUN ───────────────────────────────────
if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });

validate();
writeAssets();

buildIndex();
buildBrandsIndex();

// Generic codes
codes.forEach(buildOBD);
console.log(`  ${codes.length} OBD-II pages`);

// Brand pages
brands.forEach(buildBrandLanding);
console.log(`  ${brands.length} brand landing pages`);
brands.forEach((b) => codes.forEach((c) => buildBrandCodePage(b, c)));
console.log(`  ${brands.length * codes.length} brand+code pages`);

// BMW internal codes
bmwCodes.forEach(buildBMW);
console.log(`  ${bmwCodes.length} BMW pages`);

buildInfoPages();
buildLegalPages();
build404();

buildSitemap();
buildRobots();

console.log(`\nDone! Output in ./dist/`);
