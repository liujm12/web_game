import type { MetadataRoute } from "next";

import { getSiteContent } from "@/lib/site-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getSiteContent();
  const baseUrl = "http://localhost:3000";

  return [
    "",
    "/about",
    "/privacy",
    "/terms",
    "/contact",
    "/dmca",
    ...content.categories.map((category) => `/categories/${category.slug}`),
    ...content.games.map((game) => `/games/${game.slug}`),
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(content.site.launchedAt),
  }));
}
