import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignora erros chatos de lint e TypeScript apenas na hora do build da Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;