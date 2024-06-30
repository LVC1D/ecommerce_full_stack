import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '../backend/certs/myapp.local-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '../backend/certs/myapp.local.pem'))
    },
    proxy: {
      '/api': {
        target: 'https://localhost:3400',
        changeOrigin: true,
        secure: false,  // Use `false` because you are dealing with self-signed certificates
        ws: true,       // Proxy WebSocket connections
      },
    },
  },
})
