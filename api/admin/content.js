import { getAdminContent, saveAdminContent } from '../../server/shared/storage.mjs';
import { readBody, requireAdmin, sendJson } from '../_lib/http.js';

export default async function handler(request, response) {
  const admin = await requireAdmin(request, response);

  if (!admin) {
    return;
  }

  if (request.method === 'GET') {
    sendJson(response, 200, await getAdminContent());
    return;
  }

  if (request.method === 'PUT') {
    const body = await readBody(request);
    sendJson(response, 200, await saveAdminContent(body));
    return;
  }

  sendJson(response, 405, { message: 'Method not allowed.' });
}
