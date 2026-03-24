import http from 'node:http';
import path from 'node:path';
import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import {
  authenticateWithCredentials,
  authenticateWithToken,
  getAdminContent,
  getAnalyticsSummary,
  getPublicContent,
  initializeStorage,
  recordAnalyticsEvent,
  saveAdminContent,
  updateAdminCredentials,
} from './shared/storage.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const isDev = process.argv.includes('--dev') || process.env.NODE_ENV === 'development';
const port = Number(process.env.PORT || 3001);

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function jsonResponse(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(payload));
}

function textResponse(response, statusCode, payload, contentType = 'text/plain; charset=utf-8') {
  response.writeHead(statusCode, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
  });
  response.end(payload);
}

async function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let rawBody = '';

    request.on('data', (chunk) => {
      rawBody += chunk;

      if (rawBody.length > 1_000_000) {
        reject(new Error('Payload too large.'));
        request.destroy();
      }
    });

    request.on('end', () => {
      if (!rawBody) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(rawBody));
      } catch {
        reject(new Error('Invalid JSON payload.'));
      }
    });

    request.on('error', reject);
  });
}

function getBearerToken(request) {
  const authorizationHeader = request.headers.authorization || '';
  return authorizationHeader.startsWith('Bearer ') ? authorizationHeader.slice(7) : '';
}

async function requireAdmin(request, response) {
  const token = getBearerToken(request);
  const admin = await authenticateWithToken(token);

  if (!admin) {
    jsonResponse(response, 401, { message: 'Authentication required.' });
    return null;
  }

  return admin;
}

async function sendStaticFile(response, filePath) {
  const fileExtension = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[fileExtension] || 'application/octet-stream';

  response.writeHead(200, {
    'Content-Type': contentType,
  });

  return new Promise((resolve, reject) => {
    const stream = createReadStream(filePath);
    stream.on('error', reject);
    stream.on('end', resolve);
    stream.pipe(response);
  });
}

async function serveApp(response, pathname) {
  if (isDev) {
    jsonResponse(response, 404, {
      message: 'Static files are served by Vite in development. Start the frontend with npm run dev.',
    });
    return;
  }

  const safePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const requestedFile = path.resolve(distDir, safePath);

  if (!requestedFile.startsWith(distDir)) {
    textResponse(response, 403, 'Forbidden');
    return;
  }

  if (existsSync(requestedFile)) {
    const fileStats = await stat(requestedFile);

    if (fileStats.isFile()) {
      await sendStaticFile(response, requestedFile);
      return;
    }
  }

  await sendStaticFile(response, path.join(distDir, 'index.html'));
}

await initializeStorage();

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  const pathname = requestUrl.pathname;

  try {
    if (request.method === 'OPTIONS') {
      response.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      });
      response.end();
      return;
    }

    if (pathname === '/api/health') {
      const storage = await initializeStorage();
      jsonResponse(response, 200, {
        ok: true,
        mode: isDev ? 'development' : 'production',
        storage,
      });
      return;
    }

    if (request.method === 'GET' && pathname === '/api/public/content') {
      jsonResponse(response, 200, await getPublicContent());
      return;
    }

    if (request.method === 'POST' && pathname === '/api/public/track') {
      const body = await readRequestBody(request);
      jsonResponse(response, 201, await recordAnalyticsEvent(body, request.headers));
      return;
    }

    if (request.method === 'POST' && pathname === '/api/admin/login') {
      const body = await readRequestBody(request);
      const payload = await authenticateWithCredentials(body);

      if (!payload) {
        jsonResponse(response, 401, { message: 'Invalid credentials.' });
        return;
      }

      jsonResponse(response, 200, payload);
      return;
    }

    if (pathname.startsWith('/api/admin/')) {
      const admin = await requireAdmin(request, response);

      if (!admin) {
        return;
      }

      if (request.method === 'GET' && pathname === '/api/admin/content') {
        jsonResponse(response, 200, await getAdminContent());
        return;
      }

      if (request.method === 'PUT' && pathname === '/api/admin/content') {
        const body = await readRequestBody(request);
        jsonResponse(response, 200, await saveAdminContent(body));
        return;
      }

      if (request.method === 'GET' && pathname === '/api/admin/analytics') {
        jsonResponse(response, 200, await getAnalyticsSummary());
        return;
      }

      if (request.method === 'PUT' && pathname === '/api/admin/credentials') {
        const body = await readRequestBody(request);
        jsonResponse(response, 200, await updateAdminCredentials(body));
        return;
      }

      jsonResponse(response, 404, { message: 'Admin endpoint not found.' });
      return;
    }

    await serveApp(response, pathname);
  } catch (error) {
    jsonResponse(response, 500, {
      message: error instanceof Error ? error.message : 'Unexpected server error.',
    });
  }
});

server.listen(port, () => {
  const modeLabel = isDev ? 'development API' : 'production server';
  console.log(`Portfolio ${modeLabel} running at http://localhost:${port}`);
});
