import type { MetadataRoute } from "next";

import { getSiteContent } from "@/lib/site-content";
import { guides } from "@/data/guides";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getSiteContent();
  const baseUrl = "https://playturboarcade.com";

  return [
    "",
    "/about",
    "/privacy",
    "/terms",
    "/contact",
    "/dmca",
    "/guides",
    ...content.categories.map((category) => `/categories/${category.slug}`),
    ...content.games
      .filter((game) => game.status === "live")
      .map((game) => `/games/${game.slug}`),
    ...guides.map((guide) => `/guides/${guide.slug}`),
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(content.site.launchedAt),
  }));
}
