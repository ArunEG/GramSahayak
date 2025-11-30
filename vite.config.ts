import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public', // Ensures files in 'public' are copied to build root
  build: {
    outDir: 'build', // For Vercel/Create React App compatibility
  },
  define: {
    'process.env': process.env
  }
});