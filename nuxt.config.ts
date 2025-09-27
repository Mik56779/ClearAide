// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/fonts", "@nuxt/icon", "@nuxt/image", "@nuxtjs/supabase"],
  css: ["~/assets/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  supabase: {
    redirectOptions: {
      login: "/auth/login",
      callback: "/auth/callback",
      exclude: ["/auth/login", "/auth/callback", "/auth/register", "/"],
    },
  },
});
