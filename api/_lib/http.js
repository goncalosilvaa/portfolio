import { authenticateWithToken } from '../../server/shared/storage.mjs';

export function sendJson(response, statusCode, payload) {
  response.status(statusCode).json(payload);
}

export async function readBody(request) {
  if (request.body && typeof request.body === 'object') {
    return request.body;
  }

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

export async function requireAdmin(request, response) {
  const authorizationHeader = request.headers.authorization || '';
  const token = authorizationHeader.startsWith('Bearer ') ? authorizationHeader.slice(7) : '';
  const admin = await authenticateWithToken(token);

  if (!admin) {
    sendJson(response, 401, { message: 'Authentication required.' });
    return null;
  }

  return admin;
}
