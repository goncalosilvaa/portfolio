import { initializeStorage } from '../server/shared/storage.mjs';
import { sendJson } from './_lib/http.js';

export default async function handler(_request, response) {
  const storage = await initializeStorage();

  sendJson(response, 200, {
    ok: true,
    mode: 'vercel',
    storage,
  });
}
