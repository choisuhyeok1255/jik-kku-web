import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "직꾸",
    short_name: "직꾸",
    description: "직관 다이어리 꾸미기 - 야구 직관 기록과 나눔",
    start_url: "/",
    display: "standalone",
    background_color: "#181818",
    theme_color: "#181818",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
