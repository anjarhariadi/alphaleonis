/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        pathname: "/storage/v1/**",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.notion.so",
      },
      {
        protocol: "https",
        hostname: "*.notionusercontent.com",
      },
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  // output: "standalone",
  async rewrites() {
    return [{ source: "/llm.txt", destination: "/llms.txt" }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Link",
            value: `</llms.txt>; rel="describedby"; type="text/plain"`,
          },
        ],
      },
    ];
  },
};

export default config;
