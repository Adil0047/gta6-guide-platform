import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

const srcRoot = fileURLToPath(new URL('./src', import.meta.url));
const sharedRoot = fileURLToPath(new URL('../../packages/shared/src', import.meta.url));
const workspaceRoot = fileURLToPath(new URL('../..', import.meta.url));

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': srcRoot,
      '@shared': sharedRoot,
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    fs: {
      allow: [workspaceRoot],
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'react';
          }

          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'query';
          }

          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }

          if (id.includes('node_modules/motion')) {
            return 'motion';
          }

          return undefined;
        },
      },
    },
  },
});
