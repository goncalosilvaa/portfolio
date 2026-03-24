import { getAnalyticsSummary } from '../../server/shared/storage.mjs';
import { requireAdmin, sendJson } from '../_lib/http.js';

export default async function handler(request, response) {
  const admin = await requireAdmin(request, response);

  if (!admin) {
    return;
  }

  if (request.method !== 'GET') {
    sendJson(response, 405, { message: 'Method not allowed.' });
    return;
  }

  sendJson(response, 200, await getAnalyticsSummary());
}
