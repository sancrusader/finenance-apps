import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '192.168.18.20', // Mengizinkan akses dari semua IP di jaringan
        port: 5173, // Port default Vite (bisa diganti)
        watch: {
          usePolling: true,
        }
      }
});
