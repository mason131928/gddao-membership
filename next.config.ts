import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/membership",
  // assetPrefix: "/membership",
  // 移除 trailingSlash，可能影響API路由
  // trailingSlash: true,

  images: {
    remotePatterns: [
      // 正式環境
      {
        protocol: "https",
        hostname: "api.gddao.com",
        pathname: "/web/uploads/**",
      },
      {
        protocol: "https",
        hostname: "gddao.com",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "gddao.com",
        pathname: "/web/uploads/**",
      },
      // 本地開發環境
      {
        protocol: "http",
        hostname: "0.0.0.0",
        port: "8000",
        pathname: "/web/uploads/**",
      },
      {
        protocol: "http",
        hostname: "192.168.1.114",
        port: "8000",
        pathname: "/web/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/web/uploads/**",
      },
    ],
  },
};

export default nextConfig;
