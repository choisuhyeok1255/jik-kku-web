import type { MetadataRoute } from "next";

import { HOME_PAGE_DESCRIPTION } from "@/src/shared/lib/seo-home";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "직꾸",
    short_name: "직꾸",
    description: HOME_PAGE_DESCRIPTION,
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
