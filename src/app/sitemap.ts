import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";
import { getAllDebunkingArticles } from "@/lib/content/debunking";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://checkorbit.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all medication-country pairs that have regulations
  const regulations = await prisma.regulation.findMany({
    select: {
      compound: {
        select: {
          medications: {
            select: {
              medication: {
                select: { slug: true },
              },
            },
          },
        },
      },
      country: {
        select: { code: true },
      },
      lastVerifiedAt: true,
    },
  });

  // Build unique medication-country pairs with most recent lastVerifiedAt
  const pairMap = new Map<string, Date>();

  for (const reg of regulations) {
    const countryCode = reg.country.code.toLowerCase();
    for (const mc of reg.compound.medications) {
      const key = `${mc.medication.slug}/${countryCode}`;
      const existing = pairMap.get(key);
      if (!existing || reg.lastVerifiedAt > existing) {
        pairMap.set(key, reg.lastVerifiedAt);
      }
    }
  }

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // Compliance result pages
  const compliancePages: MetadataRoute.Sitemap = Array.from(pairMap).map(
    ([path, lastModified]) => ({
      url: `${BASE_URL}/check/${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  // Debunking articles
  const debunkingPages: MetadataRoute.Sitemap = getAllDebunkingArticles().map(
    (article) => ({
      url: `${BASE_URL}/debunking/${article.slug}`,
      lastModified: new Date(
        article.frontmatter.updatedAt ?? article.frontmatter.publishedAt
      ),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  return [...staticPages, ...compliancePages, ...debunkingPages];
}
