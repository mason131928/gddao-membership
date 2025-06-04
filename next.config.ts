import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/membership",
  assetPrefix: "/membership",
  trailingSlash: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '0.0.0.0',
        port: '8000',
        pathname: '/web/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.114',
        port: '8000',
        pathname: '/web/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/web/uploads/**',
      },
    ],
  },
};

export default nextConfig;
