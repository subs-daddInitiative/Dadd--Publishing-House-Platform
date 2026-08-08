import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
const backendUrlParsed = new URL(backendUrl);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: backendUrlParsed.protocol.replace(":", "") as "http" | "https",
        hostname: backendUrlParsed.hostname,
        port: backendUrlParsed.port || undefined,
        pathname: "/uploads/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
