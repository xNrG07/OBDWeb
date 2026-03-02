#!/usr/bin/env node
// build.js – Build static HTML pages from JSON (no framework, no backend)
// Notes:
// - SITE_URL is used for canonical URLs + sitemap (should be your real domain in production).
// - BASE_PATH is optional (useful for GitHub Pages like "/my-repo"). Keep it empty for root domains.

const fs = require("fs");
const path = require("path");

const DIST = path.join(__dirname, "dist");
const SRC = path.join(__dirname, "src");

// Configure these via env when deploying
const SITE_URL = (process.env.SITE_URL || "https://example.com").replace(/\/+$/, "");
const BASE_PATH = (process.env.BASE_PATH || "").replace(/\/+$/, ""); // e.g. "/OBDWeb-main" or ""

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

const urgencyLabel = { low: "Niedrig", medium: "Mittel", high: "Hoch" };
const urgencyDesc = {
  low: "Kein akutes Sicherheitsrisiko. Zeitnah prüfen lassen, besonders vor der AU/TÜV.",
  medium: "Sollte in den nächsten Tagen bis Wochen untersucht werden. Weiterfahrt meist möglich.",
  high: "Zeitnah handeln. Bei blinkender Motorkontrollleuchte sofort Geschwindigkeit reduzieren und Werkstatt aufsuchen.",
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

const codes = JSON.parse(fs.readFileSync(path.join(SRC, "codes.json"), "utf-8"));
const bmwCodes = JSON.parse(fs.readFileSync(path.join(SRC, "bmw-codes.json"), "utf-8"));
const css = fs.readFileSync(path.join(SRC, "style.css"), "utf-8");

console.log(`Building ${codes.length} OBD-II + ${bmwCodes.length} BMW pages...`);

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
      <a href="${href("/#bmw-section")}">BMW</a>
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
      <p><strong>Haftungsausschluss:</strong> Diese Website dient ausschließlich der allgemeinen Information. Sie stellt keine Reparatur-, Rechts- oder Kaufberatung dar. Für Diagnose und Reparatur wenden Sie sich an eine qualifizierte Kfz-Werkstatt. Alle Angaben ohne Gewähr.</p>
      <p style="margin-top:0.75rem">
        <a href="${href("/datenschutz/")}">Datenschutz</a> ·
        <a href="${href("/impressum/")}">Impressum</a>
      </p>
      <p style="margin-top:0.75rem">&copy; ${year} OBD Fehlercode Finder</p>
    </div>
  </div>
</footer>`.trim();
}

const faqToggleJs = `
<script>
  // FAQ toggle (simple, no dependencies)
  document.querySelectorAll(".faq-question").forEach(function(el){
    el.addEventListener("click", function(){
      this.parentElement.classList.toggle("open");
    });
  });
</script>`.trim();

function faqLdJson(faqs) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });
}

function listHtml(arr) {
  return arr.map((s) => `<li>${esc(s)}</li>`).join("");
}

function faqHtml(faqs) {
  return faqs
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

// === INDEX ===
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

  const topCodes = topIds
    .map((id) => codes.find((c) => c.code === id))
    .filter(Boolean);

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

  // Search data (client-side)
  const searchData = [];
  codes.forEach((c) => searchData.push({ c: c.code, t: c.title, u: href("/code/" + c.code + "/") }));
  bmwCodes.forEach((c) =>
    searchData.push({ c: c.code, t: "[BMW] " + c.title, u: href("/bmw/" + c.code + "/") })
  );

  const title = "OBD Fehlercode Finder – OBD-II & BMW Fehlercodes";
  const description = `OBD-II und BMW Fehlercodes schnell finden und verstehen. Über ${
    codes.length + bmwCodes.length
  } Codes mit Bedeutung, Symptomen und Ursachen.`;

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
      <h1>OBD-II &amp; BMW Fehlercode nachschlagen</h1>
      <p>Code eingeben (z.&nbsp;B. <strong>P0420</strong> oder <strong>2EF5</strong>) oder Kategorien durchsuchen.</p>

      <div class="search-box">
        ${searchIconSvg}
        <input type="text" id="search" placeholder="Fehlercode eingeben…" autocomplete="off" aria-label="Suchen">
        <div class="search-results" id="results"></div>
      </div>

      <p class="note" style="margin-top:0.8rem">
        Hinweis: <strong>P0xxx</strong> Codes sind standardisiert (OBD-II). <strong>P1xxx</strong> / herstellerspezifische Codes können je nach Hersteller/Modell variieren.
      </p>
    </div>

    <div class="ad-slot"><!-- Ad placeholder --></div>

    <div class="categories">${catBtns}</div>

    <h2 class="section-title">Häufig gesuchte OBD-II Codes</h2>
    ${topList}
    ${catSec}

    <div id="bmw-section" class="section-divider">
      <h2 style="font-size:1.4rem;margin-bottom:0.5rem">BMW Fehlercodes</h2>
      <p style="color:var(--text-muted);margin-bottom:1rem">Herstellerspezifische BMW-Codes – nach Steuergerät sortiert.</p>
      <div class="categories">${bBtns}</div>
      ${bSec}
    </div>
  </div>
</main>

${footer()}

<script>
(function(){
  var data = ${JSON.stringify(searchData)};

  function escHtml(s){
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  var input = document.getElementById("search");
  var box = document.getElementById("results");

  input.addEventListener("input", function(){
    var q = this.value.trim().toUpperCase();
    if(q.length < 1){
      box.className = "search-results";
      box.innerHTML = "";
      return;
    }
    var matches = data.filter(function(d){
      return d.c.toUpperCase().indexOf(q) > -1 || d.t.toUpperCase().indexOf(q) > -1;
    }).slice(0, 15);

    box.innerHTML = matches.length === 0
      ? '<div class="no-results">Kein Code gefunden.</div>'
      : matches.map(function(x){
          return '<a href="' + x.u + '"><strong>' + escHtml(x.c) + '</strong>' + escHtml(x.t) + '</a>';
        }).join("");

    box.className = "search-results open";
  });

  document.addEventListener("click", function(e){
    if(!e.target.closest(".search-box")) box.className = "search-results";
  });

  input.addEventListener("focus", function(){
    if(box.innerHTML) box.className = "search-results open";
  });

  // Optional: support ?q= query (nice for sharing)
  var params = new URLSearchParams(window.location.search);
  var qParam = params.get("q");
  if(qParam){
    input.value = qParam;
    input.dispatchEvent(new Event("input"));
  }
})();
</script>
</body>
</html>`;

  ensureDir(DIST);
  fs.writeFileSync(path.join(DIST, "index.html"), html, "utf-8");
  console.log("  index.html");
}

// === OBD PAGE ===
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
    <div class="breadcrumb">
      <a href="${href("/")}">Startseite</a> ›
      <a href="${href("/#cat-" + c.category)}">${esc(categoryLabel[c.category] || c.category)}</a> ›
      ${esc(c.code)}
    </div>

    <div class="code-header">
      <h1>${esc(title)}</h1>
      <p class="short-meaning">${esc(c.shortMeaning)}</p>
      <div class="urgency-badge ${c.urgency}">
        <span class="urgency-dot ${c.urgency}"></span>
        Dringlichkeit: ${urgencyLabel[c.urgency]}
      </div>
      ${hint}
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
      <p style="margin-top:0.75rem;font-size:0.85rem;color:var(--text-muted)"><em>Hinweis: Diese Prüfungen ersetzen keine professionelle Diagnose.</em></p>
    </div>

    <div class="content-section">
      <h2>Wann in die Werkstatt?</h2>
      <p>${esc(c.whenToShop)}</p>
    </div>

    <div class="content-section">
      <h2>Häufige Fragen zu ${esc(c.code)}</h2>
      <ul class="faq-list">${faqHtml(c.faqs)}</ul>
    </div>

    ${related}
  </div>
</main>

${footer()}
${faqToggleJs}
</body>
</html>`;

  fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8");
}

// === BMW PAGE ===
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
    <div class="breadcrumb">
      <a href="${href("/")}">Startseite</a> ›
      <a href="${href("/#bmw-" + c.system)}">BMW ${esc(c.system)}</a> ›
      ${esc(c.code)}
    </div>

    <div class="code-header">
      <h1>BMW Fehlercode ${esc(c.code)} – ${esc(c.title)}</h1>
      <p class="short-meaning"><strong>Steuergerät:</strong> ${esc(systemNice)}</p>
      <p class="short-meaning">${esc(c.shortMeaning)}</p>
      <div class="urgency-badge ${c.urgency}">
        <span class="urgency-dot ${c.urgency}"></span>
        Dringlichkeit: ${urgencyLabel[c.urgency]}
      </div>
      <p class="note" style="margin-top:0.75rem">
        Hinweis: BMW-interne Codes können je nach Baureihe/Softwarestand leicht abweichen. Für sichere Diagnose: ISTA/Freeze-Frame/Livewerte prüfen.
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

    <div class="content-section">
      <h2>Häufige Fragen zu ${esc(c.code)}</h2>
      <ul class="faq-list">${faqHtml(c.faqs)}</ul>
    </div>

    ${related}
  </div>
</main>

${footer()}
${faqToggleJs}
</body>
</html>`;

  fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8");
}

// === LEGAL PAGES ===
function buildLegalPage({ slug, pageTitle, description, bodyHtml }) {
  const dir = path.join(DIST, slug);
  ensureDir(dir);

  const html = `<!DOCTYPE html>
<html lang="de">
${headCommon({
  title: pageTitle,
  description,
  canonical: abs(`/${slug}/`),
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
  buildLegalPage({
    slug: "impressum",
    pageTitle: "Impressum",
    description: "Anbieterkennzeichnung gemäß geltendem Recht.",
    bodyHtml: `
      <h2>Angaben zum Diensteanbieter</h2>
      <p><strong>Name/Unternehmen:</strong> [DEIN NAME ODER FIRMA]<br>
      <strong>Adresse:</strong> [STRAßE, PLZ, ORT, LAND]</p>

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

  buildLegalPage({
    slug: "datenschutz",
    pageTitle: "Datenschutzerklärung",
    description: "Informationen zur Verarbeitung personenbezogener Daten.",
    bodyHtml: `
      <h2>1. Verantwortlicher</h2>
      <p><strong>[DEIN NAME / FIRMA]</strong><br>
      [ADRESSE]<br>
      E-Mail: [EMAIL]</p>

      <h2>2. Allgemeine Hinweise</h2>
      <p>Diese Website dient der Information zu OBD-/BMW-Fehlercodes. Es werden keine Nutzerkonten angeboten und im MVP keine personenbezogenen Daten aktiv gespeichert.</p>

      <h2>3. Server-Logfiles</h2>
      <p>Beim Aufruf der Website können durch den Hosting-Provider technisch bedingt Daten (z. B. IP-Adresse, Zeitpunkt, aufgerufene Seite, User-Agent) in Server-Logfiles verarbeitet werden. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherem Betrieb).</p>

      <h2>4. Werbung / Google AdSense (optional)</h2>
      <p>Wenn du Google AdSense einbindest, können Cookies und ähnliche Technologien eingesetzt werden, um Anzeigen zu personalisieren oder nicht zu personalisieren. Ergänze hier die konkreten Angaben deines Setups (z. B. ob Consent-Banner verwendet wird, personalisierte Anzeigen, etc.).</p>

      <h2>5. Kontaktaufnahme</h2>
      <p>Wenn du per E-Mail Kontakt aufnimmst, werden die übermittelten Daten zur Bearbeitung der Anfrage verarbeitet (Art. 6 Abs. 1 lit. b oder f DSGVO).</p>

      <h2>6. Deine Rechte</h2>
      <p>Du hast Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch sowie ein Beschwerderecht bei einer Aufsichtsbehörde.</p>

      <h2>7. Aktualität</h2>
      <p>Diese Datenschutzerklärung wird bei Bedarf angepasst, z. B. bei Einbindung neuer Dienste.</p>
    `,
  });
}

// === STATIC ASSETS ===
function writeAssets() {
  ensureDir(DIST);
  fs.writeFileSync(path.join(DIST, "style.css"), css, "utf-8");
  fs.writeFileSync(path.join(DIST, "favicon.svg"), faviconSvg, "utf-8");
  console.log("  style.css");
  console.log("  favicon.svg");
}

// === SITEMAP & ROBOTS ===
function buildSitemap() {
  const d = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `<url><loc>${abs("/")}</loc><lastmod>${d}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n`;
  xml += `<url><loc>${abs("/datenschutz/")}</loc><lastmod>${d}</lastmod><changefreq>yearly</changefreq><priority>0.2</priority></url>\n`;
  xml += `<url><loc>${abs("/impressum/")}</loc><lastmod>${d}</lastmod><changefreq>yearly</changefreq><priority>0.2</priority></url>\n`;

  codes.forEach((c) => {
    xml += `<url><loc>${abs("/code/" + c.code + "/")}</loc><lastmod>${d}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`;
  });

  bmwCodes.forEach((c) => {
    xml += `<url><loc>${abs("/bmw/" + c.code + "/")}</loc><lastmod>${d}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n`;
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

// === RUN ===
if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });

writeAssets();
buildIndex();
codes.forEach(buildOBD);
console.log(`  ${codes.length} OBD-II pages`);
bmwCodes.forEach(buildBMW);
console.log(`  ${bmwCodes.length} BMW pages`);
buildLegalPages();
buildSitemap();
buildRobots();

console.log(`\nDone! ${codes.length + bmwCodes.length + 3} pages + assets in ./dist/`);
