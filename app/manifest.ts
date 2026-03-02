import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "직꾸",
    short_name: "직꾸",
    description: "직관 다이어리 꾸미기 - 야구 직관 기록과 나눔",
    start_url: "/",
    display: "standalone",
    background_color: "#181818",
    theme_color: "#5724F0",
    icons: [
      {
        src: "/helmet-fill.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/helmet-fill.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
