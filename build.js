#!/usr/bin/env node
// build.js – Generates static site from src/codes.json
// Usage: npm run build

const fs = require("fs");
const path = require("path");

const DIST = path.join(__dirname, "dist");
const SRC = path.join(__dirname, "src");
const SITE_URL = "https://obd-fehlercode-finder.de"; // Change to your domain

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function esc(s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

const urgencyLabel = { low:"Niedrig", medium:"Mittel", high:"Hoch" };
const urgencyDesc = {
  low:"Kein akutes Sicherheitsrisiko. Zeitnah prüfen lassen, besonders vor der AU/TÜV.",
  medium:"Sollte in den nächsten Tagen bis Wochen untersucht werden. Weiterfahrt meist möglich.",
  high:"Zeitnah handeln. Bei blinkender Motorkontrollleuchte sofort Geschwindigkeit reduzieren und Werkstatt aufsuchen."
};
const catLabel = {
  catalyst:"Katalysator", fuel:"Kraftstoffsystem", misfire:"Zündaussetzer",
  evap:"EVAP-System", sensor:"Sensoren", egr:"Abgasrückführung",
  throttle:"Drosselklappe / Leerlauf", transmission:"Getriebe"
};

const codes = JSON.parse(fs.readFileSync(path.join(SRC,"codes.json"),"utf-8"));
const css = fs.readFileSync(path.join(SRC,"style.css"),"utf-8");
console.log(`Building ${codes.length} code pages...`);

const searchSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;

function header(home) {
  return `<header><div class="container"><a href="${home}" class="logo">OBD <span>Fehlercode Finder</span></a><nav><a href="${home}">Startseite</a></nav></div></header>`;
}

const footer = `<footer><div class="disclaimer"><p><strong>Haftungsausschluss:</strong> Diese Website dient ausschließlich der allgemeinen Information. Sie stellt keine Reparatur-, Rechts- oder Kaufberatung dar. Für Diagnose und Reparatur wenden Sie sich an eine qualifizierte Kfz-Werkstatt. Alle Angaben ohne Gewähr.</p><p style="margin-top:0.5rem">&copy; ${new Date().getFullYear()} OBD Fehlercode Finder</p></div></footer>`;

// ══════════════════════════════════════════════════════════════════
// INDEX PAGE
// ══════════════════════════════════════════════════════════════════
function buildIndex() {
  const topIds = ["P0420","P0171","P0300","P0455","P0128","P0401","P0442","P0172","P0101","P0505","P0301","P0302","P0440","P0135","P0174","P0430","P0700","P0340","P0335","P0121"];
  const topCodes = topIds.map(id => codes.find(c => c.code === id)).filter(Boolean);

  // Group by category
  const cats = {};
  for (const c of codes) {
    if (!cats[c.category]) cats[c.category] = [];
    cats[c.category].push(c);
  }

  let catButtons = "";
  for (const key of Object.keys(catLabel)) {
    if (!cats[key]) continue;
    catButtons += `<a href="#cat-${key}" class="cat-tag">${esc(catLabel[key])}</a> `;
  }

  let catSections = "";
  for (const key of Object.keys(catLabel)) {
    if (!cats[key]) continue;
    catSections += `<h2 class="section-title" id="cat-${key}">${esc(catLabel[key])}</h2>\n<ul class="code-list">\n`;
    for (const c of cats[key]) {
      catSections += `<li><a href="/code/${c.code}/"><span class="code-badge">${c.code}</span><span class="code-title">${esc(c.title)}</span><span class="urgency-dot ${c.urgency}" title="${urgencyLabel[c.urgency]}"></span></a></li>\n`;
    }
    catSections += `</ul>\n`;
  }

  let topList = `<ul class="code-list">\n`;
  for (const c of topCodes) {
    topList += `<li><a href="/code/${c.code}/"><span class="code-badge">${c.code}</span><span class="code-title">${esc(c.title)}</span><span class="urgency-dot ${c.urgency}" title="${urgencyLabel[c.urgency]}"></span></a></li>\n`;
  }
  topList += `</ul>`;

  // Minimal JSON for client-side search
  const searchData = codes.map(c => ({ c: c.code, t: c.title }));

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>OBD Fehlercode Finder – OBD-II Fehlercodes einfach erklärt</title>
<meta name="description" content="OBD-II Fehlercodes schnell finden und verstehen. Bedeutung, Symptome, Ursachen und erste Checks für über ${codes.length} Codes.">
<link rel="canonical" href="${SITE_URL}/">
<style>${css}</style>
</head>
<body>
${header("/")}
<main>
<div class="container">

<div class="search-section">
  <h1>OBD-II Fehlercode nachschlagen</h1>
  <p>Gib einen Code ein (z.&nbsp;B. P0420) oder durchsuche die Kategorien.</p>
  <div class="search-box">
    ${searchSvg}
    <input type="text" id="search" placeholder="Fehlercode eingeben, z.B. P0420 …" autocomplete="off" aria-label="Fehlercode suchen">
    <div class="search-results" id="results"></div>
  </div>
</div>

<!-- AdSense placeholder: ad below search -->
<div class="ad-slot"><!-- Ad placeholder – AdSense code here --></div>

<div class="categories">${catButtons}</div>

<h2 class="section-title">Häufig gesuchte Codes</h2>
${topList}

${catSections}

</div>
</main>
${footer}

<script>
// Client-side search
(function(){
  var data=${JSON.stringify(searchData)};
  var input=document.getElementById("search");
  var box=document.getElementById("results");

  input.addEventListener("input",function(){
    var q=this.value.trim().toUpperCase();
    if(q.length<1){box.className="search-results";box.innerHTML="";return;}
    var matches=data.filter(function(d){return d.c.indexOf(q)>-1||d.t.toUpperCase().indexOf(q)>-1;}).slice(0,12);
    if(matches.length===0){
      box.innerHTML='<div class="no-results">Kein Code gefunden.</div>';
    } else {
      box.innerHTML=matches.map(function(m){return '<a href="/code/'+m.c+'/"><strong>'+m.c+'</strong>'+m.t+'</a>';}).join("");
    }
    box.className="search-results open";
  });

  document.addEventListener("click",function(e){
    if(!e.target.closest(".search-box"))box.className="search-results";
  });

  input.addEventListener("focus",function(){if(box.innerHTML)box.className="search-results open";});
})();
</script>
</body>
</html>`;

  ensureDir(DIST);
  fs.writeFileSync(path.join(DIST, "index.html"), html, "utf-8");
  console.log("  index.html");
}

// ══════════════════════════════════════════════════════════════════
// CODE DETAIL PAGES
// ══════════════════════════════════════════════════════════════════
function buildCodePage(code) {
  const c = code;
  const dir = path.join(DIST, "code", c.code);
  ensureDir(dir);

  // FAQ JSON-LD
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": c.faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  const symptoms = c.symptoms.map(s => `<li>${esc(s)}</li>`).join("\n");
  const causes = c.causes.map(s => `<li>${esc(s)}</li>`).join("\n");
  const checks = c.firstChecks.map(s => `<li>${esc(s)}</li>`).join("\n");

  let faqHtml = "";
  for (const f of c.faqs) {
    faqHtml += `<li class="faq-item"><div class="faq-question">${esc(f.q)}</div><div class="faq-answer">${esc(f.a)}</div></li>\n`;
  }

  let relatedHtml = "";
  if (c.related && c.related.length) {
    relatedHtml = `<div class="content-section"><h2>Verwandte Fehlercodes</h2><div class="related-codes">${c.related.map(r => `<a href="/code/${r}/">${r}</a>`).join("")}</div></div>`;
  }

  const title = `OBD Code ${c.code} – Bedeutung, Symptome, Ursachen`;
  const desc = `${c.code}: ${c.shortMeaning} Erfahre Symptome, Ursachen, Dringlichkeit und erste Checks.`;

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE_URL}/code/${c.code}/">
<style>${css}</style>
<script type="application/ld+json">${JSON.stringify(faqLd)}</script>
</head>
<body>
${header("/")}
<main>
<div class="container">

<div class="breadcrumb"><a href="/">Startseite</a> &rsaquo; <a href="/#cat-${c.category}">${esc(catLabel[c.category] || c.category)}</a> &rsaquo; ${c.code}</div>

<div class="code-header">
  <h1>${esc(title)}</h1>
  <p class="short-meaning">${esc(c.shortMeaning)}</p>
  <div class="urgency-badge ${c.urgency}"><span class="urgency-dot ${c.urgency}"></span> Dringlichkeit: ${urgencyLabel[c.urgency]}</div>
</div>

<div class="content-section">
  <h2>Bedeutung</h2>
  <p>${esc(c.meaningLong)}</p>
</div>

<div class="content-section">
  <h2>Symptome</h2>
  <ul>${symptoms}</ul>
</div>

<div class="content-section">
  <h2>Mögliche Ursachen</h2>
  <ul>${causes}</ul>
</div>

<div class="content-section">
  <h2>Wie dringend ist ${c.code}?</h2>
  <p><strong>${urgencyLabel[c.urgency]}:</strong> ${urgencyDesc[c.urgency]}</p>
</div>

<!-- AdSense placeholder: ad after urgency section -->
<div class="ad-slot"><!-- Ad placeholder – AdSense code here --></div>

<div class="content-section">
  <h2>Erste Checks (sichere Basics)</h2>
  <ul>${checks}</ul>
  <p style="margin-top:0.75rem;font-size:0.85rem;color:var(--text-muted)"><em>Hinweis: Diese Prüfungen ersetzen keine professionelle Diagnose. Arbeiten am Fahrzeug auf eigene Gefahr.</em></p>
</div>

<div class="content-section">
  <h2>Wann in die Werkstatt?</h2>
  <p>${esc(c.whenToShop)}</p>
</div>

<div class="content-section">
  <h2>Häufige Fragen zu ${c.code}</h2>
  <ul class="faq-list">${faqHtml}</ul>
</div>

${relatedHtml}

</div>
</main>
${footer}

<script>
// FAQ accordion
document.querySelectorAll(".faq-question").forEach(function(el){
  el.addEventListener("click",function(){
    this.parentElement.classList.toggle("open");
  });
});
</script>
</body>
</html>`;

  fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8");
}

// ══════════════════════════════════════════════════════════════════
// SITEMAP & ROBOTS
// ══════════════════════════════════════════════════════════════════
function buildSitemap() {
  const today = new Date().toISOString().split("T")[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `<url><loc>${SITE_URL}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n`;
  for (const c of codes) {
    xml += `<url><loc>${SITE_URL}/code/${c.code}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`;
  }
  xml += `</urlset>`;
  fs.writeFileSync(path.join(DIST, "sitemap.xml"), xml, "utf-8");
  console.log("  sitemap.xml");
}

function buildRobots() {
  const txt = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  fs.writeFileSync(path.join(DIST, "robots.txt"), txt, "utf-8");
  console.log("  robots.txt");
}

// ══════════════════════════════════════════════════════════════════
// RUN BUILD
// ══════════════════════════════════════════════════════════════════
// Clean dist
if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });

buildIndex();

for (const c of codes) {
  buildCodePage(c);
}
console.log(`  ${codes.length} code pages`);

buildSitemap();
buildRobots();

console.log(`\nDone! Output in ./dist/ (${codes.length + 1} HTML pages, sitemap, robots.txt)`);
