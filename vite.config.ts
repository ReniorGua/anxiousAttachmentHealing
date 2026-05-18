import { defineConfig, loadEnv, type ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'icon-192.png', 'icon-512.png'],
        manifest: {
          name: '疗心舍',
          short_name: '疗心舍',
          description: '焦虑依恋情绪疗愈 App',
          theme_color: '#8FA98F',
          background_color: '#FAFAF8',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            {
              src: '/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
              },
            },
          ],
        },
      }),
    ],
    
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    
    server: {
      port: Number(env.VITE_PORT) || 5173,
      host: true,
      proxy: {
        // Backend AI API proxy (optional - frontend can call backend directly)
        '/api/ai': {
          target: env.VITE_BACKEND_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/ai/, ''),
        },
        // General API proxy
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: false,
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-vue': ['vue', 'vue-router', 'pinia'],
            'vendor-utils': ['axios'],
          },
        },
      },
    },
    
    css: {
      postcss: './postcss.config.js',
    },
  }
})
