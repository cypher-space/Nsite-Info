import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  title: "Nsite Info",

  compatibilityDate: "2025-12-01",

  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'shaders/vue'
      ]
    },
    vue: {
      customElement: true
    },
    plugins: [
      tailwindcss()
    ]
  },

  app: {
    head: {
      title: "Nsite Info"
    }
  },

  devtools: { enabled: true },

  css: ['~/assets/tailwind.css'],

  modules: [
    "@pinia/nuxt"
  ]
})
