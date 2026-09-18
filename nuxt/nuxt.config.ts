const icon = "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2032%2032'%20width='32'%20height='32'%3E%3Crect%20width='32'%20height='32'%20fill='%23060a12'/%3E%3Cpath%20transform='rotate(45%2016%2016)'%20d='M16%208%2022%2021%2016%2018%2010%2021Z'%20fill='%2334d399'%20stroke='%2334d399'%20stroke-width='2.5'%20stroke-linejoin='round'%20stroke-linecap='round'/%3E%3C/svg%3E";

export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  devtools: { enabled: false },
  css: ['~/assets/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      title: 'Nuxt · Rocketeers',
      meta: [
        { name: 'theme-color', content: '#f4f7fb', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#060a12', media: '(prefers-color-scheme: dark)' },
        { name: 'robots', content: 'noindex,nofollow' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: icon }],
    },
  },
});
