/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowLocalIP: true, // Allows Next.js to fetch from localhost:8000
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'web-production-3c6bc.up.railway.app',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // DigitalOcean Spaces (admin uploads live under /TET/)
      {
        protocol: 'https',
        hostname: 'ngowebsites.sfo3.cdn.digitaloceanspaces.com',
        pathname: '/TET/**',
      },
      {
        protocol: 'https',
        hostname: 'ngowebsites.sfo3.digitaloceanspaces.com',
        pathname: '/TET/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // Admin origins allowed to embed the site in the live preview iframe.
            // localhost and 127.0.0.1 are different origins to the browser, so both are listed.
            value:
              "frame-ancestors 'self' https://web-production-3c6bc.up.railway.app http://localhost:* http://127.0.0.1:*;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;