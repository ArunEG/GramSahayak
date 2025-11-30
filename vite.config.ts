import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'assets', // Ensures files in 'assets' are copied to build root
  build: {
    outDir: 'dist', // Changed back to 'dist' as Vercel expects this by default for Vite
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'recharts', 'react-markdown', '@google/genai'],
        },
      },
    },
  },
  define: {
    'process.env': process.env
  }
});