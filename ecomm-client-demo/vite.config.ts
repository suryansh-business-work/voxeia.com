import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 2004,
    proxy: {
      '/api': {
        target: 'http://localhost:2002',
        changeOrigin: true,
      },
    },
  },
});
