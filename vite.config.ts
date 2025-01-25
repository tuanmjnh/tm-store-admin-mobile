import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
// import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
// https://github.com/antfu/unplugin-icons
import IconsResolver from 'unplugin-icons/resolver'
// import mockDevServerPlugin from 'vite-plugin-mock-dev-server'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import viteCompression from 'vite-plugin-compression'
import { createHtmlPlugin } from 'vite-plugin-html'
import { enableCDN } from './build/cdn'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'
// The company has a good reputation
const root: string = process.cwd()

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // The company
  const env = loadEnv(mode, root, '')
  return {
    base: env.VITE_APP_ROUTER_BASE || '/',
    plugins: [
      vue(),
      vueJsx(),
      // mockDevServerPlugin(),
      mkcert(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: { enabled: false },
        manifest: {
          name: 'TM-Store',
          short_name: 'TM-Store',
          description: 'TM-Store Mobile',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            {
              src: 'icons/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'icons/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        },
      }),
      // auto import api of lib
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
          '@vueuse/core',
          'vue-i18n'
        ],
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: 'src/typings/auto-imports.d.ts',
        dirs: ['src/composables']
      }),
      // vant Components are automatically introduced on demand
      Components({
        dts: 'src/typings/components.d.ts',
        resolvers: [
          IconsResolver({
            prefix: false,
            customCollections: ['svg']
          }),
          VantResolver()
        ]
      }),

      // auto import iconify's icons
      Icons({
        defaultStyle: 'display:inline-block',
        compiler: 'vue3',
        customCollections: {
          'svg-icons': FileSystemIconLoader('src/assets/svg-icons', (svg) =>
            svg.replace(/^<svg /, '<svg fill="currentColor" width="1.2em" height="1.2em"')
          )
        }
      }),
      // // svg icon
      // createSvgIconsPlugin({
      //   // Specify the icon folder
      //   iconDirs: [path.resolve(root, 'src/icons/svg')],
      //   // Specify symbolId format
      //   symbolId: 'icon-[dir]-[name]'
      // }),
      //Allow adding component name attribute to setup syntax sugar
      vueSetupExtend(),
      //Production environment gzip compressed resources
      viteCompression(),
      //Injecting Template Data
      createHtmlPlugin({
        inject: {
          data: {
            ENABLE_ERUDA: env.VITE_ENABLE_ERUDA || 'false'
          }
        }
      }),
      // CDN acceleration is not enabled by default in the production environment
      enableCDN(env.VITE_CDN_DEPS)
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        // '@tm-utils': fileURLToPath(new URL('../tm-utils/src', import.meta.url))
      }
    },
    server: {
      open: false,
      // https: true,
      host: true,
      port: 8000,
      hmr: false,
      proxy: {
        '/api': {
          // target: 'https://tm-store-api.vercel.app',
          target: 'http://localhost:8080',
          // pathRewrite: { '^/api': '' },
          changeOrigin: true,
          secure: true,
          ws: false
        }
      },
      headers: {
        'Cross-Origin-Embedder-Policy': 'unsafe-none', // added this part
      },
    },
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    }
  }
})
