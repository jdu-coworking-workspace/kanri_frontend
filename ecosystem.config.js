/** PM2. Ishga tushirishdan oldin: npm ci && npm run build
 *  Buyruq: pm2 start ecosystem.config.js && pm2 save
 *  3000 faqat Nginx ko'radi (127.0.0.1).
 */
module.exports = {
  apps: [
    {
      name: "kanri-frontend",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3000",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      // t3.small (2 GB). Juda past qiymat SSR paytida restart loop beradi.
      max_memory_restart: "768M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
