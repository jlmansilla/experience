// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-05-19',
  devtools: { enabled: true },
  
  // Custom global CSS for premium aesthetics
  css: [
    '~/assets/css/main.css'
  ],

  // Nuxt Modules
  modules: [
    '@pinia/nuxt'
  ],

  // App Level Headers & SEO Configurations
  app: {
    head: {
      title: 'Nuxt 3 & Vue 3 Composition API: Interactive Tutorial Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Learn how to integrate a rich Vue 3 Composition API frontend with a Nuxt 3 server engine backend using this highly interactive tutorial, featuring hands-on playgrounds, state managers, and visual HTTP flowcharts.' }
      ],
      link: [
        // Premium typography: Inter and Outfit from Google Fonts
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap' }
      ]
    }
  },

  devServer: {
    host: '127.0.0.1',
    port: 3000
  },

  // Vite configuration to prevent watcher locks/EPERM issues on Windows
  vite: {
    server: {
      watch: {
        usePolling: true,
        ignored: ['**/*.backup', '**/*.bak-test', '**/debug-ssr.mjs', '**/.output/**']
      }
    }
  },

  // Nitro server inlining configuration to avoid dynamic CommonJS runtime ESM resolution errors in Node
  nitro: {
    externals: {
      inline: ['vue', 'pinia', '@pinia/nuxt']
    }
  }
})
