import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5175,
    strictPort: true,
    open: true,
    proxy: {
      // Proxy all API calls to the local backend during dev.
      // This allows the Android emulator to load the app from
      // http://10.0.2.2:5173 and call /api/... on the same origin,
      // with Vite forwarding to http://localhost:3001.
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
