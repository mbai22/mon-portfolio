import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In dev, the admin API (public/api/*.php) runs on PHP's built-in server:
//   npm run dev:api   (php -S localhost:8787 -t public)
// Without it the site still works with its built-in content.
const PHP_DEV = 'http://localhost:8787'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: PHP_DEV, changeOrigin: true },
      // Same rewrite as public/.htaccess on Hostinger
      '^/uploads/.*': {
        target: PHP_DEV,
        changeOrigin: true,
        rewrite: (path) => `/api/image.php?f=${encodeURIComponent(path.replace(/^\/uploads\//, ''))}`,
      },
    },
  },
})
