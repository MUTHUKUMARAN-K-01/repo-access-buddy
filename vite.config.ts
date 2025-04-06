
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && {
      name: 'lovable-tagger',
      apply: 'serve',
      // Simple placeholder that doesn't require importing the ESM package
      configureServer() {
        console.log('Lovable tagger initialized');
      }
    }
  ].filter(Boolean),
  server: {
    host: "::",
    port: 8080
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  build: {
    outDir: 'client/dist',
  }
}));
