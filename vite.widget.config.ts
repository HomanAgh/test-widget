import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Inject CSS into JS to avoid separate CSS files
    cssInjectedByJsPlugin(),
  ],
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process': JSON.stringify({
      env: { NODE_ENV: 'production' },
      browser: true
    })
  },
  build: {
    outDir: 'public',
    emptyOutDir: false, // Don't delete other files in public folder
    lib: {
      entry: resolve(__dirname, 'script/widget-bundle.tsx'),
      name: 'EPWidgets',
      fileName: () => 'widget-bundle.js', // Use fixed filename instead of format-based
      formats: ['iife'],
    },
    rollupOptions: {
      // Externalize deps that shouldn't be bundled
      external: [],
      output: {
        // Global variables to use in the UMD build for externalized deps
        globals: {},
        // Force inline CSS with JS
        assetFileNames: () => {
          // Don't generate separate CSS files
          return '[name].[hash].[ext]';
        },
      },
    },
    // Minimize the bundle
    minify: 'terser',
    sourcemap: false,
  },
  // Use React 18
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
  // Include tailwind styles
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
}); 