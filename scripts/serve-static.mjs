import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3000;
const HOST = '0.0.0.0';
const OUT_DIR = path.resolve(process.cwd(), 'out');

// Load .env.local if exists
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      process.env[key] = val;
    }
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

const server = http.createServer((req, res) => {
  // Parse URL pathname
  let reqPath = decodeURIComponent(req.url.split('?')[0]);

  // Strip leading slash
  if (reqPath.startsWith('/')) {
    reqPath = reqPath.slice(1);
  }

  // Handle API Endpoint: POST /api/auth/google
  if (req.method === 'POST' && (reqPath === 'api/auth/google' || reqPath === 'api/auth/google/')) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        const { credential } = JSON.parse(body || '{}');
        if (!credential) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing token' }));
          return;
        }

        const { OAuth2Client } = await import('google-auth-library');
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const client = new OAuth2Client(clientId);

        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: clientId || undefined,
        });

        const payload = ticket.getPayload();
        if (!payload) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid token' }));
          return;
        }

        const userProfile = {
          googleId: payload.sub,
          email: payload.email || '',
          name: payload.name || payload.given_name || 'Pengguna Google',
          picture: payload.picture || '',
          emailVerified: payload.email_verified || false,
        };

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(JSON.stringify({ status: 'success', user: userProfile }));
      } catch (err) {
        res.writeHead(500, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(JSON.stringify({ error: err?.message || 'Authentication failed' }));
      }
    });
    return;
  }

  let filePath = path.join(OUT_DIR, reqPath);

  // If directory or empty, check for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath)) {
    // Try appending .html or /index.html
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    } else {
      // Fallback 404
      const notFoundPath = path.join(OUT_DIR, '404.html');
      if (fs.existsSync(notFoundPath)) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(notFoundPath).pipe(res);
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Access-Control-Allow-Origin': '*',
  });

  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`Iqra Static Server is running at:`);
  console.log(`- Local:   http://localhost:${PORT}`);
  console.log(`- Network: http://192.168.100.3:${PORT}`);
  console.log(`Serving folder: ${OUT_DIR}`);
});
