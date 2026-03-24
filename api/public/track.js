import { recordAnalyticsEvent } from '../../server/shared/storage.mjs';
import { readBody, sendJson } from '../_lib/http.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    sendJson(response, 405, { message: 'Method not allowed.' });
    return;
  }

  const body = await readBody(request);
  sendJson(response, 201, await recordAnalyticsEvent(body, request.headers));
}
