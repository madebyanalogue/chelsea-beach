// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/sanity',
    '@nuxt/content',
    '@nuxt/image'
  ],
  sanity: {
    projectId: 'xanklzya',
    dataset: 'production',
    useCdn: true
  },
  runtimeConfig: {
    public: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || ''
    }
  },

  components: {
    dirs: [
      '~/components'
    ]
  },
  css: [
    '~/assets/styles/reset.css',
    '~/assets/styles/utilities.css',
    '~/assets/styles/typography.css',
    '~/assets/styles/main.css',
  ],
  experimental: {
    componentIslands: true
  },
  routeRules: {
    '/**': { ssr: true }
  },

  build: {
    transpile: ['gsap']
  }
})