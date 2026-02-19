import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "승요",
    short_name: "승요",
    description: "승리요정 프로젝트",
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
