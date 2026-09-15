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
    remotePatterns: [
      // Production: avatarlar S3 dan keladi.
      {
        protocol: 'https',
        hostname: '**.s3.ap-northeast-1.amazonaws.com',
      },
      // Lokal ishlab chiqish: S3_MODE=local bo'lganda backend/media/.
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/media/:path*',
        destination: 'http://127.0.0.1:8000/media/:path*',
      },
    ];
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