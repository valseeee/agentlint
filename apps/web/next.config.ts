import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@agentlint/core"],
  devIndicators: false,
};

export default nextConfig;
