require('dotenv').config({ silent: true })

module.exports = {
  /**
   * Using Phusion Passenger with Nginx on Plesk - That will gzip
   */
  performance: {
    gzip: false
  },
  /**
   * Headers of the page
   */
  head: {
    titleTemplate: '%s - Starter Website',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  },
  /**
   * Customize the progress-bar color (in this case, set which element should be shown as loading and unset at end)
   */
  loading: '~/components/PageLoader.vue',
  /*
  ** Global CSS
  */
  css: ['~/assets/sass/main.sass'],
  /*
  ** Add axios globally
  */
  build: {
    // analyze: true,
    // extractCSS: true,
    vendor: ['lodash', 'axios'],
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    postcss: []
  },
  /**
   * Cache settings
   */
  cache: true,
  /**
   * Plugins
   */
  plugins: [
    { src: '~/plugins/ApiPage', ssr: true },
    { src: '~/plugins/VueCookie', ssr: false },
    { src: '~/plugins/AuthInterceptor', ssr: false },
    { src: '~/plugins/Quill.js', ssr: false }
  ],
  /**
   * Router config including middleware
   */
  router: {
    middleware: ['session'],
    extendRoutes (routes) {
      routes.push({
        name: 'custom',
        path: '*',
        component: '~/pages/_page/index.vue'
      })
    }
  },
  modules: [
    '@nuxtjs/component-cache',
    [
      '@nuxtjs/pwa',
      {
        icon: {
          iconSrc: 'static/icons/bw-logo-1024x1024.png',
          sizes: [1024, 512, 144]
        },
        manifest: true,
        meta: false,
        workbox: false,
        optimize: {
          cssnano: {
            zindex: false
          }
        }
      }
    ],
    [
      '@nuxtjs/axios',
      {
        credentials: true,
        baseURL: process.env.API_BASE_URL,
        debug: false
      }
    ],
    [
      '@nuxtjs/google-analytics',
      {
        ua: 'UA-5355474-47'
      }
    ]
  ],
  /**
   * Manifest for mobile app
   */
  manifest: {
    name: 'BW Starter Website',
    short_name: 'BWStarter',
    description: 'A starter de-coupled front-end/back-end website with common functionality including an admin login',
    lang: 'en',
    background_color: '#FFFFFF',
    theme_color: '#4770fb'
  }
}
