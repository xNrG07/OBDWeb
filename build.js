#!/usr/bin/env node
const fs=require("fs"),path=require("path");
const DIST=path.join(__dirname,"dist"),SRC=path.join(__dirname,"src");
const SITE_URL="https://obd-fehlercode-finder.de";
function ensureDir(d){fs.mkdirSync(d,{recursive:true});}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}

const uL={low:"Niedrig",medium:"Mittel",high:"Hoch"};
const uD={low:"Kein akutes Sicherheitsrisiko. Zeitnah prüfen lassen, besonders vor der AU/TÜV.",medium:"Sollte in den nächsten Tagen bis Wochen untersucht werden. Weiterfahrt meist möglich.",high:"Zeitnah handeln. Bei blinkender Motorkontrollleuchte sofort Geschwindigkeit reduzieren und Werkstatt aufsuchen."};
const catL={catalyst:"Katalysator",fuel:"Kraftstoffsystem",misfire:"Zündaussetzer",evap:"EVAP-System",sensor:"Sensoren",egr:"Abgasrückführung",throttle:"Drosselklappe / Leerlauf",transmission:"Getriebe"};
const bmwSL={DME:"DME – Motor (Benzin)",DDE:"DDE – Motor (Diesel)",EGS:"EGS – Getriebe",ACSM:"ACSM – Airbag/Sicherheit",DSC:"DSC – Stabilitätskontrolle",FRM:"FRM – Beleuchtung",CAS:"CAS – Zugang/Start",KOMBI:"KOMBI – Instrumente"};

const codes=JSON.parse(fs.readFileSync(path.join(SRC,"codes.json"),"utf-8"));
const bmwCodes=JSON.parse(fs.readFileSync(path.join(SRC,"bmw-codes.json"),"utf-8"));
const css=fs.readFileSync(path.join(SRC,"style.css"),"utf-8");
console.log("Building "+codes.length+" OBD-II + "+bmwCodes.length+" BMW pages...");

const sI='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
function hdr(h){return '<header><div class="container"><a href="'+h+'" class="logo">OBD <span>Fehlercode Finder</span></a><nav><a href="'+h+'">Start</a><a href="'+h+'#bmw-section">BMW</a></nav></div></header>';}
const ftr='<footer><div class="disclaimer"><p><strong>Haftungsausschluss:</strong> Diese Website dient ausschließlich der allgemeinen Information. Sie stellt keine Reparatur-, Rechts- oder Kaufberatung dar. Für Diagnose und Reparatur wenden Sie sich an eine qualifizierte Kfz-Werkstatt. Alle Angaben ohne Gewähr.</p><p style="margin-top:0.5rem">&copy; '+new Date().getFullYear()+' OBD Fehlercode Finder</p></div></footer>';
const faqJS='<script>document.querySelectorAll(".faq-question").forEach(function(el){el.addEventListener("click",function(){this.parentElement.classList.toggle("open");});});<\/script>';

function faqLdJson(faqs){return JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":faqs.map(function(f){return {"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}})});}
function listHtml(arr){return arr.map(function(s){return "<li>"+esc(s)+"</li>";}).join("");}
function faqHtml(faqs){return faqs.map(function(f){return '<li class="faq-item"><div class="faq-question">'+esc(f.q)+'</div><div class="faq-answer">'+esc(f.a)+'</div></li>';}).join("");}

// === INDEX ===
function buildIndex(){
  var topIds=["P0420","P0171","P0300","P0455","P0128","P0401","P0442","P0172","P0101","P0505","P0301","P0302","P0440","P0135","P0174","P0430","P0700","P0340","P0335","P0121"];
  var topCodes=topIds.map(function(id){return codes.find(function(c){return c.code===id});}).filter(Boolean);
  var cats={};codes.forEach(function(c){if(!cats[c.category])cats[c.category]=[];cats[c.category].push(c);});
  var catBtns="";Object.keys(catL).forEach(function(k){if(cats[k])catBtns+='<a href="#cat-'+k+'" class="cat-tag">'+esc(catL[k])+'</a> ';});
  var catSec="";Object.keys(catL).forEach(function(k){if(!cats[k])return;catSec+='<h2 class="section-title" id="cat-'+k+'">'+esc(catL[k])+'</h2><ul class="code-list">';cats[k].forEach(function(c){catSec+='<li><a href="/code/'+c.code+'/"><span class="code-badge">'+c.code+'</span><span class="code-title">'+esc(c.title)+'</span><span class="urgency-dot '+c.urgency+'"></span></a></li>';});catSec+='</ul>';});
  var topL='<ul class="code-list">';topCodes.forEach(function(c){topL+='<li><a href="/code/'+c.code+'/"><span class="code-badge">'+c.code+'</span><span class="code-title">'+esc(c.title)+'</span><span class="urgency-dot '+c.urgency+'"></span></a></li>';});topL+='</ul>';
  var bSys={};bmwCodes.forEach(function(c){if(!bSys[c.system])bSys[c.system]=[];bSys[c.system].push(c);});
  var bBtns="";Object.keys(bmwSL).forEach(function(k){if(bSys[k])bBtns+='<a href="#bmw-'+k+'" class="cat-tag">'+esc(bmwSL[k])+'</a> ';});
  var bSec="";Object.keys(bmwSL).forEach(function(k){if(!bSys[k])return;bSec+='<h3 class="section-title" id="bmw-'+k+'">'+esc(bmwSL[k])+'</h3><ul class="code-list">';bSys[k].forEach(function(c){bSec+='<li><a href="/bmw/'+c.code+'/"><span class="code-badge">'+c.code+'</span><span class="code-title">'+esc(c.title)+'</span><span class="urgency-dot '+c.urgency+'"></span></a></li>';});bSec+='</ul>';});
  var sD=[];codes.forEach(function(c){sD.push({c:c.code,t:c.title,u:"/code/"+c.code+"/"});});bmwCodes.forEach(function(c){sD.push({c:c.code,t:"[BMW] "+c.title,u:"/bmw/"+c.code+"/"});});

  var h='<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>OBD Fehlercode Finder – OBD-II &amp; BMW Fehlercodes</title><meta name="description" content="OBD-II und BMW Fehlercodes schnell finden und verstehen. Über '+(codes.length+bmwCodes.length)+' Codes mit Bedeutung, Symptomen und Ursachen."><link rel="canonical" href="'+SITE_URL+'/"><style>'+css+'</style></head><body>'+hdr("/")+'<main><div class="container"><div class="search-section"><h1>OBD-II &amp; BMW Fehlercode nachschlagen</h1><p>Code eingeben (z.&nbsp;B. P0420 oder 2EF5) oder Kategorien durchsuchen.</p><div class="search-box">'+sI+'<input type="text" id="search" placeholder="Fehlercode eingeben…" autocomplete="off" aria-label="Suchen"><div class="search-results" id="results"></div></div></div><div class="ad-slot"><!-- Ad placeholder --></div><div class="categories">'+catBtns+'</div><h2 class="section-title">Häufig gesuchte OBD-II Codes</h2>'+topL+catSec+'<div id="bmw-section" style="margin-top:3rem;padding-top:1.5rem;border-top:2px solid var(--border)"><h2 style="font-size:1.4rem;margin-bottom:0.5rem">BMW Fehlercodes</h2><p style="color:var(--text-muted);margin-bottom:1rem">Herstellerspezifische BMW-Codes – nach Steuergerät sortiert.</p><div class="categories">'+bBtns+'</div>'+bSec+'</div></div></main>'+ftr+'<script>(function(){var data='+JSON.stringify(sD)+';var i=document.getElementById("search"),b=document.getElementById("results");i.addEventListener("input",function(){var q=this.value.trim().toUpperCase();if(q.length<1){b.className="search-results";b.innerHTML="";return;}var m=data.filter(function(d){return d.c.toUpperCase().indexOf(q)>-1||d.t.toUpperCase().indexOf(q)>-1}).slice(0,15);b.innerHTML=m.length===0?"<div class=\\"no-results\\">Kein Code gefunden.</div>":m.map(function(x){return "<a href=\\""+x.u+"\\"><strong>"+x.c+"</strong>"+x.t+"</a>"}).join("");b.className="search-results open"});document.addEventListener("click",function(e){if(!e.target.closest(".search-box"))b.className="search-results"});i.addEventListener("focus",function(){if(b.innerHTML)b.className="search-results open"})})()<\/script></body></html>';
  ensureDir(DIST);fs.writeFileSync(path.join(DIST,"index.html"),h,"utf-8");console.log("  index.html");
}

// === OBD PAGE ===
function buildOBD(c){
  var dir=path.join(DIST,"code",c.code);ensureDir(dir);
  var t="OBD Code "+c.code+" – Bedeutung, Symptome, Ursachen";
  var d=c.code+": "+c.shortMeaning+" Symptome, Ursachen, Dringlichkeit und Checks.";
  var rel="";if(c.related&&c.related.length)rel='<div class="content-section"><h2>Verwandte Fehlercodes</h2><div class="related-codes">'+c.related.map(function(r){return '<a href="/code/'+r+'/">'+r+'</a>'}).join("")+'</div></div>';
  var h='<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(t)+'</title><meta name="description" content="'+esc(d)+'"><link rel="canonical" href="'+SITE_URL+'/code/'+c.code+'/"><style>'+css+'</style><script type="application/ld+json">'+faqLdJson(c.faqs)+'<\/script></head><body>'+hdr("/")+'<main><div class="container"><div class="breadcrumb"><a href="/">Startseite</a> › <a href="/#cat-'+c.category+'">'+esc(catL[c.category]||c.category)+'</a> › '+c.code+'</div><div class="code-header"><h1>'+esc(t)+'</h1><p class="short-meaning">'+esc(c.shortMeaning)+'</p><div class="urgency-badge '+c.urgency+'"><span class="urgency-dot '+c.urgency+'"></span> Dringlichkeit: '+uL[c.urgency]+'</div></div><div class="content-section"><h2>Bedeutung</h2><p>'+esc(c.meaningLong)+'</p></div><div class="content-section"><h2>Symptome</h2><ul>'+listHtml(c.symptoms)+'</ul></div><div class="content-section"><h2>Mögliche Ursachen</h2><ul>'+listHtml(c.causes)+'</ul></div><div class="content-section"><h2>Wie dringend ist '+c.code+'?</h2><p><strong>'+uL[c.urgency]+':</strong> '+uD[c.urgency]+'</p></div><div class="ad-slot"><!-- Ad placeholder --></div><div class="content-section"><h2>Erste Checks (sichere Basics)</h2><ul>'+listHtml(c.firstChecks)+'</ul><p style="margin-top:0.75rem;font-size:0.85rem;color:var(--text-muted)"><em>Hinweis: Diese Prüfungen ersetzen keine professionelle Diagnose.</em></p></div><div class="content-section"><h2>Wann in die Werkstatt?</h2><p>'+esc(c.whenToShop)+'</p></div><div class="content-section"><h2>Häufige Fragen zu '+c.code+'</h2><ul class="faq-list">'+faqHtml(c.faqs)+'</ul></div>'+rel+'</div></main>'+ftr+faqJS+'</body></html>';
  fs.writeFileSync(path.join(dir,"index.html"),h,"utf-8");
}

// === BMW PAGE ===
function buildBMW(c){
  var dir=path.join(DIST,"bmw",c.code);ensureDir(dir);
  var sn=bmwSL[c.system]||c.system;
  var t="BMW Fehlercode "+c.code+" ("+c.system+") – Bedeutung & Ursachen";
  var d="BMW "+c.code+": "+c.shortMeaning+" Steuergerät: "+c.system+". Symptome, Ursachen und Checks.";
  var rel="";if(c.related&&c.related.length)rel='<div class="content-section"><h2>Verwandte BMW-Codes</h2><div class="related-codes">'+c.related.map(function(r){return '<a href="/bmw/'+r+'/">'+r+'</a>'}).join("")+'</div></div>';
  var h='<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(t)+'</title><meta name="description" content="'+esc(d)+'"><link rel="canonical" href="'+SITE_URL+'/bmw/'+c.code+'/"><style>'+css+'</style><script type="application/ld+json">'+faqLdJson(c.faqs)+'<\/script></head><body>'+hdr("/")+'<main><div class="container"><div class="breadcrumb"><a href="/">Startseite</a> › <a href="/#bmw-'+c.system+'">BMW '+esc(c.system)+'</a> › '+c.code+'</div><div class="code-header"><h1>BMW Fehlercode '+c.code+' – '+esc(c.title)+'</h1><p class="short-meaning"><strong>Steuergerät:</strong> '+esc(sn)+'</p><p class="short-meaning">'+esc(c.shortMeaning)+'</p><div class="urgency-badge '+c.urgency+'"><span class="urgency-dot '+c.urgency+'"></span> Dringlichkeit: '+uL[c.urgency]+'</div></div><div class="content-section"><h2>Bedeutung</h2><p>'+esc(c.meaningLong)+'</p></div><div class="content-section"><h2>Symptome</h2><ul>'+listHtml(c.symptoms)+'</ul></div><div class="content-section"><h2>Mögliche Ursachen</h2><ul>'+listHtml(c.causes)+'</ul></div><div class="content-section"><h2>Wie dringend ist '+c.code+'?</h2><p><strong>'+uL[c.urgency]+':</strong> '+uD[c.urgency]+'</p></div><div class="ad-slot"><!-- Ad placeholder --></div><div class="content-section"><h2>Erste Checks (sichere Basics)</h2><ul>'+listHtml(c.firstChecks)+'</ul><p style="margin-top:0.75rem;font-size:0.85rem;color:var(--text-muted)"><em>BMW-interne Codes können nur mit BMW-Diagnosesoftware (ISTA, Rheingold, Bimmerlink) ausgelesen und gelöscht werden.</em></p></div><div class="content-section"><h2>Wann in die Werkstatt?</h2><p>'+esc(c.whenToShop)+'</p></div><div class="content-section"><h2>Häufige Fragen zu '+c.code+'</h2><ul class="faq-list">'+faqHtml(c.faqs)+'</ul></div>'+rel+'</div></main>'+ftr+faqJS+'</body></html>';
  fs.writeFileSync(path.join(dir,"index.html"),h,"utf-8");
}

// === SITEMAP & ROBOTS ===
function buildSitemap(){
  var d=new Date().toISOString().split("T")[0];
  var x='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  x+='<url><loc>'+SITE_URL+'/</loc><lastmod>'+d+'</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n';
  codes.forEach(function(c){x+='<url><loc>'+SITE_URL+'/code/'+c.code+'/</loc><lastmod>'+d+'</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n';});
  bmwCodes.forEach(function(c){x+='<url><loc>'+SITE_URL+'/bmw/'+c.code+'/</loc><lastmod>'+d+'</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n';});
  x+='</urlset>';
  fs.writeFileSync(path.join(DIST,"sitemap.xml"),x,"utf-8");console.log("  sitemap.xml");
}

// === RUN ===
if(fs.existsSync(DIST))fs.rmSync(DIST,{recursive:true});
buildIndex();
codes.forEach(buildOBD);console.log("  "+codes.length+" OBD-II pages");
bmwCodes.forEach(buildBMW);console.log("  "+bmwCodes.length+" BMW pages");
buildSitemap();
fs.writeFileSync(path.join(DIST,"robots.txt"),"User-agent: *\nAllow: /\n\nSitemap: "+SITE_URL+"/sitemap.xml\n","utf-8");
console.log("  robots.txt\n\nDone! "+(codes.length+bmwCodes.length+1)+" HTML pages in ./dist/");
