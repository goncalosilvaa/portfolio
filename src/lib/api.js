const API_ROOT = '/api';
const ADMIN_TOKEN_KEY = 'portfolio-admin-token';

const adminSession = {
  getToken() {
    return window.localStorage.getItem(ADMIN_TOKEN_KEY);
  },
  setToken(token) {
    window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
  },
  clearToken() {
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  },
};

async function apiRequest(path, options = {}) {
  const { method = 'GET', body, auth = false } = options;
  const headers = {};

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = adminSession.getToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_ROOT}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    if (response.status === 401) {
      adminSession.clearToken();
    }

    throw new Error(payload?.message || 'Unable to complete the request.');
  }

  return payload;
}

export function getPublicContent() {
  return apiRequest('/public/content');
}

export async function loginAdmin(credentials) {
  const payload = await apiRequest('/admin/login', {
    method: 'POST',
    body: credentials,
  });

  adminSession.setToken(payload.token);
  return payload;
}

export function getAdminContent() {
  return apiRequest('/admin/content', { auth: true });
}

export function saveAdminContent(content) {
  return apiRequest('/admin/content', {
    method: 'PUT',
    body: content,
    auth: true,
  });
}

export function getAdminAnalytics() {
  return apiRequest('/admin/analytics', { auth: true });
}

export async function updateAdminCredentials(values) {
  const payload = await apiRequest('/admin/credentials', {
    method: 'PUT',
    body: values,
    auth: true,
  });

  if (payload?.token) {
    adminSession.setToken(payload.token);
  }

  return payload;
}

export function logoutAdmin() {
  adminSession.clearToken();
}

export { adminSession };
