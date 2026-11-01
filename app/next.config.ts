import type { NextConfig } from "next";

const NEXT_API_URL = process.env.NEXT_API_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  output: "standalone",
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      // Preserva a barra final (/api/match/, /api/modality/): sem ela o FastAPI responde 307
      // para a URL do backend e o navegador falha por CORS.
      { source: "/api/:path*/", destination: `${NEXT_API_URL}/api/:path*/` },
      { source: "/api/:path*", destination: `${NEXT_API_URL}/api/:path*` },
    ];
  },
};

export default nextConfig;
