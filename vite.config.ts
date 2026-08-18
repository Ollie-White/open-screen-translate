import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: 'dist', rollupOptions: { input: { main: resolve(import.meta.dirname, 'index.html'), overlay: resolve(import.meta.dirname, 'overlay.html') } } },
  test: { environment: 'node', include: ['src/**/*.test.ts'] }
});
