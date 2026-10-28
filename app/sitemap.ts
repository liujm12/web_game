import type { MetadataRoute } from "next";

import { guides } from "@/data/guides";
import { parseEditorialDate } from "@/lib/editorial";
import { getSiteContent } from "@/lib/site-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getSiteContent();
  const baseUrl = "https://playturboarcade.com";
  const siteLastModified = new Date(
    content.site.contentUpdatedAt ?? content.site.launchedAt,
  );
  const publicRoutes = [
    "",
    "/about",
    "/privacy",
    "/terms",
    "/contact",
    "/dmca",
    "/editorial-policy",
    "/guides",
    ...content.categories.map((category) => `/categories/${category.slug}`),
    ...content.games
      .filter((game) => game.status === "live")
      .map((game) => `/games/${game.slug}`),
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: siteLastModified,
  }));
  const guideRoutes = guides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: parseEditorialDate(guide.updatedAt, siteLastModified),
  }));

  return [...publicRoutes, ...guideRoutes];
}
