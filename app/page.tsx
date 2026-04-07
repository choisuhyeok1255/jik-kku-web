import type { Metadata } from "next";
import { IntroductionPage } from "@/src/pages/introduction";

export const metadata: Metadata = {
  title: "직꾸",
  description: "직관 다이어리 꾸미기",
  alternates: { canonical: "/" },
  openGraph: {
    title: "직꾸",
    description: "직관 다이어리 꾸미기",
    url: "/",
    siteName: "직꾸",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: "직꾸",
    description: "직관 다이어리 꾸미기",
  },
};

export default function Page() {
  return <IntroductionPage />;
}
