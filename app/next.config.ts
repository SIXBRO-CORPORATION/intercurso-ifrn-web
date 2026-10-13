import type { NextConfig } from "next";

const NEXT_API_URL = process.env.NEXT_API_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${NEXT_API_URL}/api/:path*` }];
  },
};

export default nextConfig;