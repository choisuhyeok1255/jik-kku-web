import type { MetadataRoute } from "next";

import {
  HOME_PAGE_DESCRIPTION,
  SITE_LOGO_192_PATH,
  SITE_LOGO_PATH,
} from "@/src/shared/lib/seo-home";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "직꾸",
    short_name: "직꾸",
    description: HOME_PAGE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#181818",
    theme_color: "#181818",
    // 선언한 sizes와 실제 파일 크기가 어긋나면 브라우저·Lighthouse가 경고하므로 크기별 파일을 따로 지정한다
    icons: [
      {
        src: SITE_LOGO_192_PATH,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: SITE_LOGO_PATH,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
