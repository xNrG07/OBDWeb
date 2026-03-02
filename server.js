// server.js – Minimal static server for local preview / StackBlitz
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const DIST = path.join(__dirname, "dist");

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
};

http.createServer((req, res) => {
  let url = req.url.split("?")[0];
  if (url.endsWith("/")) url += "index.html";

  const file = path.join(DIST, url);

  fs.readFile(file, (err, data) => {
    if (err) {
      // Try adding /index.html for clean URLs
      const alt = path.join(DIST, url, "index.html");
      fs.readFile(alt, (err2, data2) => {
        if (err2) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("404 Not Found");
        } else {
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(data2);
        }
      });
      return;
    }
    const ext = path.extname(file);
    const mime = MIME[ext] || "application/octet-stream";
    const charset = mime.startsWith("text/") || mime.includes("json") || mime.includes("xml") ? "; charset=utf-8" : "";
    res.writeHead(200, { "Content-Type": mime + charset });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`Preview: http://localhost:${PORT}`);
});
