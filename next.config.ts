import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "200mb",
    },
    serverComponentsExternalPackages: ["fluent-ffmpeg", "ffmpeg-static"],
  },
};

export default nextConfig;
