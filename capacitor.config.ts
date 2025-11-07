import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.seugrupo.nfeasy',
  appName: 'nfeasy-ionic',
  webDir: 'dist',
  server: {
    // During Android emulator development the webview loads from file://,
    // so we must point API requests to the host machine. Use 10.0.2.2:3001
    // which maps the Android emulator to the host's localhost.
    // You can override by setting CAPACITOR_DEV_SERVER_URL in your environment.
    url: process.env.CAPACITOR_DEV_SERVER_URL || 'http://10.0.2.2:3001',
    cleartext: true,
  }
};

export default config;
