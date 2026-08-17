/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'ru', 'uz', 'jp'],
    defaultLocale: 'jp',
  },
  compiler: {
    removeConsole: {
      exclude: ['error'],
    },
  },
  images: {
    // like ['domen.uz']
    domains: [],
  },
  env: {
    // like base url
    API: '',
  },
  turbopack: {
    root: __dirname,
  },
}

module.exports = nextConfig