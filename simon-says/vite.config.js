import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  publicDir: 'public',
  build: {
    minify: false,
    sourcemap: true,
    target: 'esnext',
    compact: false,
    scss: {
      api: 'modern-compiler',
    },
  },
});
