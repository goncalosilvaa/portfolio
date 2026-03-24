import { updateAdminCredentials } from '../../server/shared/storage.mjs';
import { readBody, requireAdmin, sendJson } from '../_lib/http.js';

export default async function handler(request, response) {
  const admin = await requireAdmin(request, response);

  if (!admin) {
    return;
  }

  if (request.method !== 'PUT') {
    sendJson(response, 405, { message: 'Method not allowed.' });
    return;
  }

  const body = await readBody(request);
  sendJson(response, 200, await updateAdminCredentials(body));
}
