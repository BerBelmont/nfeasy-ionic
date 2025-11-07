import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.seugrupo.nfeasy',
  appName: 'nfeasy-ionic',
  webDir: 'dist',
  server: (() => {
    // IMPORTANT: Do NOT set `server.url` to the API server.
    // If `server.url` is set, the Android WebView will load that URL instead
    // of the bundled app in `android/app/src/main/assets/public` (causes a blank page).
    //
    // Use `CAPACITOR_DEV_SERVER_URL` only when you intentionally want live-reload
    // from a web dev server (for example: `http://10.0.2.2:3000`). Otherwise leave
    // `url` unset so the app loads the local `index.html` from the assets folder.
    const s: any = { cleartext: true };
    // For the demo/evaluation, load from the Vite dev server running on a fixed port
    // accessible from the Android emulator via 10.0.2.2.
    s.url = process.env.CAPACITOR_DEV_SERVER_URL || 'http://10.0.2.2:5175';
    return s;
  })(),
};

export default config;
