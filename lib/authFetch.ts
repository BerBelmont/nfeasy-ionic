export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('nf_token');
}

export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('nf_token', token);
  }
}

export function clearToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('nf_token');
    localStorage.removeItem('nf_role');
  }
}

export function getRole(): string {
  if (typeof window === 'undefined') return 'admin';
  return localStorage.getItem('nf_role') || 'admin';
}

export function setRole(role: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('nf_role', role);
  }
}

import { API_BASE } from './config';

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  // If a relative API path is passed (e.g. '/api/login'), prefix with the runtime base
  const finalUrl = url.startsWith('/api') ? `${API_BASE}${url}` : url;

  const token = getToken();
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token || ''}`,
  };

  const res = await fetch(finalUrl, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  return res;
}
