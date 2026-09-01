import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed static export to support API routes
  // output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
