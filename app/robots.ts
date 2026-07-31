import type { MetadataRoute } from "next";

import { SITE_URL } from "@/src/shared/lib/site-url";

/** 관리자·인증·API 경로는 어떤 크롤러에도 열지 않는다. */
const DISALLOWED_PATHS = ["/admin/", "/auth/", "/api/"];

/**
 * AI 답변 엔진의 크롤러 — 콘텐츠가 AI 답변에 인용되도록 명시적으로 허용한다.
 * (와일드카드로도 허용되지만, 명시해 두면 나중에 특정 봇만 막을 때 기준이 된다.)
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: AI_CRAWLERS,
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
    ],
    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
