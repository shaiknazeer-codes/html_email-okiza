/**
 * Lightweight local preview server for Okiza Email Templates
 * Zero external dependencies - runs with native Node.js http and fetch.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { handleSendEmail } = require('../api/send-email');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  // Enable standard CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse URL pathname
  let reqPath = req.url.split('?')[0];

  // API Route: Send Real Email
  if (reqPath === '/api/send-email' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const json = JSON.parse(body || '{}');
        const result = await handleSendEmail(json, process.env.RESEND_API_KEY);
        res.writeHead(result.status, { 'Content-Type': 'application/json; charset=UTF-8' });
        res.end(JSON.stringify(result.body));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=UTF-8' });
        res.end(JSON.stringify({ success: false, error: 'Malformed JSON payload: ' + err.message }));
      }
    });
    return;
  }

  // Default route points to preview.html
  if (reqPath === '/' || reqPath === '/preview' || reqPath === '/index.html') {
    reqPath = '/preview/preview.html';
  }

  // Resolve safe file path within ROOT_DIR
  const safePath = path.normalize(path.join(ROOT_DIR, reqPath));
  if (!safePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 Not Found: ${reqPath}`);
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    });

    const stream = fs.createReadStream(safePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  Okiza Email Templates Server running!`);
  console.log(`  Local URL: http://localhost:${PORT}`);
  console.log(`  Direct Preview: http://localhost:${PORT}/preview/preview.html`);
  console.log(`  Real Email API: http://localhost:${PORT}/api/send-email`);
  console.log(`======================================================\n`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
