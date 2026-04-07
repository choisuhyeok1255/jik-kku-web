import type { Metadata } from "next";

import { CalendarPage } from "@/src/pages/calendar";

export const metadata: Metadata = {
  title: "경기 일정 | 직꾸",
  description: "KBO 야구 경기 일정을 구단별로 확인할 수 있습니다.",
  alternates: { canonical: "/calendar" },
  openGraph: {
    title: "경기 일정 | 직꾸",
    description: "KBO 야구 경기 일정을 구단별로 확인할 수 있습니다.",
    url: "/calendar",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: "경기 일정 | 직꾸",
    description: "KBO 야구 경기 일정을 구단별로 확인할 수 있습니다.",
  },
};

export { CalendarPage as default };
