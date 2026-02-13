import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/sign/**",
      },
    ],
  },

  // ✅ Turbopack(개발/Next16 기본)용 SVGR 설정
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // ✅ Webpack(빌드에서 쓰일 수 있음)용 SVGR 설정
  webpack: (config) => {
    // Next 기본 svg 처리(rule)와 충돌 방지: 기존 asset rule에서 svg 제외
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule?.test?.test?.(".svg")
    );
    if (fileLoaderRule) fileLoaderRule.exclude = /\.svg$/i;

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
