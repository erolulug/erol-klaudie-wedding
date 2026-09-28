import type { NextConfig } from "next";

// GitHub Pages serves the site from /<repo-name>/, so production builds need that prefix
const basePath = process.env.NODE_ENV === 'production' ? '/erol-klaudie-wedding' : '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
