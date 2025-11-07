// Runtime API base URL helper.
// Picks the correct backend host depending on environment:
// - When running in the Android emulator (web assets loaded from file://) it returns 10.0.2.2
// - When running locally in the browser it returns localhost:3001
// - Otherwise it falls back to the current origin
// Runtime API base selection
// - If running from dev server (http/https), return '' so calls use relative '/api' and Vite proxy forwards to the backend.
// - If running from Android assets (file://), use emulator's host alias 10.0.2.2:3001.
export const API_BASE: string = (() => {
  if (typeof window === 'undefined') return '';
  try {
    const protocol = window.location.protocol;
    if (protocol === 'file:') {
      return 'http://10.0.2.2:3001';
    }
    // Dev server (browser or emulator via CAPACITOR_DEV_SERVER_URL): use relative '/api'
    return '';
  } catch (e) {
    return '';
  }
})();
