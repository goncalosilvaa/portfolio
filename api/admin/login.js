import { authenticateWithCredentials } from '../../server/shared/storage.mjs';
import { readBody, sendJson } from '../_lib/http.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    sendJson(response, 405, { message: 'Method not allowed.' });
    return;
  }

  const body = await readBody(request);
  const payload = await authenticateWithCredentials(body);

  if (!payload) {
    sendJson(response, 401, { message: 'Invalid credentials.' });
    return;
  }

  sendJson(response, 200, payload);
}
