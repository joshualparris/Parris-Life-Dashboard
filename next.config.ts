import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Turbopack rooted to this project when explicitly used.
  turbopack: {
    root: __dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Reduce dev-time file watching across large sibling project folders
  // that live inside this repo directory but are not part of the Next app.
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/.git/**",
          "**/.next/**",
          "**/node_modules/**",
          "docs/**",
          "experimental/**",
          "Game-Fixer/**",
          "Serenity-Keep-Flying/**",
          "Wilds - Sail West/**",
          "JoshHub/**",
        ],
      };
    }

    return config;
  },
};

export default nextConfig;
