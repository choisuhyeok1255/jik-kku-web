import type { Metadata } from "next";

import { IntroductionPage } from "@/src/pages/introduction";
import { SEO_HOME_FAQ_ITEMS, faqPageJsonLd } from "@/src/shared/lib/seo-faq";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Page() {
  const faqJsonLd = faqPageJsonLd(SEO_HOME_FAQ_ITEMS);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <IntroductionPage />
    </>
  );
}
