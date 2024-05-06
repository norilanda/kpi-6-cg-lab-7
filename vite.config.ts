import { resolve } from 'path'
import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [glsl()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cgLab51: resolve(__dirname, 'src/cg-lab5-1/index.html'),
        cgLab52: resolve(__dirname, 'src/cg-lab5-2/index.html'),
        cgLab531: resolve(__dirname, 'src/cg-lab5-3/index.html'),
        cgLab532: resolve(__dirname, 'src/cg-lab5-4/index.html'),
        cgLab72: resolve(__dirname, 'src/cg-lab7-2/index.html'),
        cgLab73: resolve(__dirname, 'src/cg-lab7-3/index.html'),
      }
    }
  }
});
