import type { MetadataRoute } from "next";

import { getShares } from "@/src/entities";
import { SITE_URL } from "@/src/shared/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/share`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/ranking`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/my-page`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/my-page/app-download`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const shares = await getShares();
  const sharePages: MetadataRoute.Sitemap = shares.map((share) => ({
    url: `${SITE_URL}/share/${share.id}`,
    lastModified: new Date(share.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...sharePages];
}
