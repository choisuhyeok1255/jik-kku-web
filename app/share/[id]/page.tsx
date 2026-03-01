import type { Metadata } from "next";

import { ShareDetailPage } from "@/src/pages/share";
import { getShareDetail } from "@/src/entities";
import { SITE_URL } from "@/src/shared/lib/site-url";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const shareId = Number(id);
  if (Number.isNaN(shareId)) {
    return {
      title: "나눔 상세 | 승요",
      openGraph: {
        title: "나눔 상세 | 승요",
        url: `/share/${id}`,
        siteName: "승요",
        type: "website",
        locale: "ko_KR",
      },
      twitter: { card: "summary", title: "나눔 상세 | 승요" },
    };
  }

  try {
    const share = await getShareDetail(shareId);
    if (!share) {
      return {
        title: "나눔 상세 | 승요",
        openGraph: {
          title: "나눔 상세 | 승요",
          url: `/share/${id}`,
          siteName: "승요",
          type: "website",
          locale: "ko_KR",
        },
        twitter: { card: "summary", title: "나눔 상세 | 승요" },
      };
    }
    const description =
      share.content?.slice(0, 100)?.replace(/\n/g, " ") ?? "야구 직관 나눔 상세";
    return {
      title: `${share.title} | 승요`,
      description,
      alternates: { canonical: `${SITE_URL}/share/${id}` },
      openGraph: {
        title: `${share.title} | 승요`,
        description,
        url: `/share/${id}`,
        siteName: "승요",
        type: "article",
        locale: "ko_KR",
        publishedTime: share.created_at,
      },
      twitter: {
        card: "summary",
        title: `${share.title} | 승요`,
        description,
      },
    };
  } catch {
    return {
      title: "나눔 상세 | 승요",
      openGraph: {
        title: "나눔 상세 | 승요",
        url: `/share/${id}`,
        siteName: "승요",
        type: "website",
        locale: "ko_KR",
      },
      twitter: { card: "summary", title: "나눔 상세 | 승요" },
    };
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const shareId = Number(id);
  let jsonLd: object | null = null;

  if (!Number.isNaN(shareId)) {
    try {
      const share = await getShareDetail(shareId);
      if (share) {
        jsonLd = {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: share.title,
          description:
            share.content?.slice(0, 160)?.replace(/\n/g, " ") ??
            "야구 직관 나눔 상세",
          datePublished: share.created_at,
          url: `${SITE_URL}/share/${id}`,
        };
      }
    } catch {
      // ignore
    }
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ShareDetailPage />
    </>
  );
}
