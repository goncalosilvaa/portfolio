const VISITOR_KEY = 'portfolio-visitor-id';
const VISIT_SESSION_KEY = 'portfolio-visit-tracked';
const PROJECT_VIEW_PREFIX = 'portfolio-project-view:';

function createVisitorId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getVisitorId() {
  const existingId = window.localStorage.getItem(VISITOR_KEY);

  if (existingId) {
    return existingId;
  }

  const nextId = createVisitorId();
  window.localStorage.setItem(VISITOR_KEY, nextId);
  return nextId;
}

function buildPayload(type, extra = {}) {
  return {
    type,
    visitorId: getVisitorId(),
    pathname: `${window.location.pathname}${window.location.hash || ''}`,
    referrer: document.referrer,
    userAgent: window.navigator.userAgent,
    language: window.navigator.language,
    screen: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    ...extra,
  };
}

function sendAnalytics(payload) {
  const body = JSON.stringify(payload);

  if (window.navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    window.navigator.sendBeacon('/api/public/track', blob);
    return;
  }

  fetch('/api/public/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
    keepalive: true,
  }).catch(() => null);
}

export function trackVisitOnce() {
  if (window.sessionStorage.getItem(VISIT_SESSION_KEY)) {
    return;
  }

  window.sessionStorage.setItem(VISIT_SESSION_KEY, '1');
  sendAnalytics(buildPayload('visit'));
}

export function trackCvDownload() {
  sendAnalytics(buildPayload('cv_download'));
}

export function trackProjectView(projectId) {
  if (!projectId) {
    return;
  }

  const key = `${PROJECT_VIEW_PREFIX}${projectId}`;

  if (window.sessionStorage.getItem(key)) {
    return;
  }

  window.sessionStorage.setItem(key, '1');
  sendAnalytics(buildPayload('project_view', { projectId }));
}

export function trackProjectClick(projectId) {
  if (!projectId) {
    return;
  }

  sendAnalytics(buildPayload('project_click', { projectId }));
}
