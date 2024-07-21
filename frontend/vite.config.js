/* eslint-disable no-undef */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
// import fs from 'fs';
// import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, '../backend/certs/myapp.local-key.pem')),
    //   cert: fs.readFileSync(path.resolve(__dirname, '../backend/certs/myapp.local.pem'))
    // },
    proxy: {
      '/api': {
        target: 'https://ecommerce-full-stack-back.onrender.com',
        changeOrigin: true,
        secure: true,  // Use `false` because you are dealing with self-signed certificates
        ws: true,       // Proxy WebSocket connections
      },
    },
  },
  build: {
    outDir: 'dist',
    // rollupOptions: {
    //   external: ['axios'], // Add axios here
    // },
  },
})
