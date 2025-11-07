// Runtime API base URL helper.
// Picks the correct backend host depending on environment:
// - When running in the Android emulator (web assets loaded from file://) it returns 10.0.2.2
// - When running locally in the browser it returns localhost:3001
// - Otherwise it falls back to the current origin
export const API_BASE: string = (() => {
  if (typeof window === 'undefined') return 'http://localhost:3001';
  try {
    const protocol = window.location.protocol;
    const host = window.location.hostname;

    // When Capacitor serves assets from file:// (Android), use emulator host for host machine
    if (protocol === 'file:') return 'http://10.0.2.2:3001';

    // Browser dev: localhost
    if (host === 'localhost' || host === '127.0.0.1') return 'http://localhost:3001';

    // Default to current origin
    return `${protocol}//${host}`;
  } catch (e) {
    return 'http://localhost:3001';
  }
})();
