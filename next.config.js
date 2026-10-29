import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    inlineCss: true,
  },
  // /blog reads content/ at request time (category filter), so ship it with the function
  outputFileTracingIncludes: {
    "/*": ["./content/blog/**/*"],
  },
  turbopack: {
    resolveAlias: {
      "../build/polyfills/polyfill-module": "./src/lib/modern-polyfill.ts",
      "next/dist/build/polyfills/polyfill-module":
        "./src/lib/modern-polyfill.ts",
    },
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        pathname: "/storage/v1/**",
        hostname: "*.supabase.co",
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
