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

// API base override support and connectivity fallback (10.0.2.2 -> 127.0.0.1 when using `adb reverse`)
const OVERRIDE_KEY = 'nf_api_base_override';

export function getApiBase(): string {
  if (typeof window === 'undefined') return API_BASE;
  const override = localStorage.getItem(OVERRIDE_KEY);
  return override || API_BASE;
}

export function setApiBaseOverride(base: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(OVERRIDE_KEY, base);
  }
}

function isLikelyAndroidWebView(): boolean {
  try {
    const ua = navigator.userAgent || '';
    return /Android/i.test(ua);
  } catch {
    return false;
  }
}

function altAndroidBaseForReverse(): string {
  // When `adb reverse tcp:3001 tcp:3001` is active, the device can reach host via 127.0.0.1
  return 'http://127.0.0.1:3001';
}

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token || ''}`,
  } as Record<string, string>;

  // Compose URL with current base (override wins)
  const base = getApiBase();
  const toUrl = (u: string, b: string) => (u.startsWith('/api') ? `${b}${u}` : u);
  const primaryUrl = toUrl(url, base);

  try {
    const res = await fetch(primaryUrl, { ...options, headers });
    if (res.status === 401) {
      clearToken();
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
    return res;
  } catch (err) {
    // Network failure: try Android fallback if appropriate
    const used10_0_2_2 = base.includes('10.0.2.2:3001');
    if (isLikelyAndroidWebView() && used10_0_2_2) {
      const altBase = altAndroidBaseForReverse();
      const altUrl = toUrl(url, altBase);
      try {
        const altRes = await fetch(altUrl, { ...options, headers });
        // Persist override if alt works (status available even if 401, but keep behavior consistent)
        setApiBaseOverride(altBase);
        if (altRes.status === 401) {
          clearToken();
          if (typeof window !== 'undefined') window.location.href = '/login';
        }
        return altRes;
      } catch (err2) {
        // fall through: rethrow original error
        throw err2;
      }
    }
    throw err;
  }
}
