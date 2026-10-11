import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    // Warn early if a chunk grows past 150 kB (uncompressed).
    chunkSizeWarningLimit: 150,
    // Keep React in its own long-cacheable chunk; screens are split via React.lazy in src/routes/index.jsx.
    rollupOptions: { output: { manualChunks: { react: ['react', 'react-dom'] } } },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.jsx'],
  },
});
