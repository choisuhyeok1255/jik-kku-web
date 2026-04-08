import type { Metadata } from "next";
import { IntroductionPage } from "@/src/pages/introduction";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Page() {
  return <IntroductionPage />;
}
