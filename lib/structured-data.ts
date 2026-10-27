import type { GameGuide } from "@/data/guides";
import type { GameRecord } from "@/lib/site-content";
import { SITE_NAME, SITE_URL } from "@/lib/social-metadata";

export type JsonLdNode = Record<string, unknown>;
export type JsonLdDocument = {
  "@context": "https://schema.org";
  "@graph": JsonLdNode[];
};

const organizationId = `${SITE_URL}/#organization`;
const websiteId = `${SITE_URL}/#website`;

export function absoluteSiteUrl(path: string) {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function organizationReference() {
  return { "@id": organizationId };
}

function breadcrumbList(
  entries: Array<{ name: string; path: string }>,
): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: absoluteSiteUrl(entry.path),
    })),
  };
}

export function buildSiteStructuredData(): JsonLdDocument {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: SITE_NAME,
        url: absoluteSiteUrl("/"),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: SITE_NAME,
        url: absoluteSiteUrl("/"),
        description:
          "Fast, mobile-friendly browser games for quick breaks, simple rules, and repeat play.",
        publisher: organizationReference(),
        inLanguage: "en-US",
      },
    ],
  };
}

export function buildGameStructuredData(
  game: GameRecord,
  faq: NonNullable<GameRecord["faq"]>,
): JsonLdDocument {
  const path = `/games/${game.slug}`;
  const graph: JsonLdNode[] = [
    {
      "@type": "VideoGame",
      "@id": `${absoluteSiteUrl(path)}#game`,
      name: game.title,
      description: game.description,
      url: absoluteSiteUrl(path),
      image: absoluteSiteUrl(`${path}/opengraph-image`),
      genre: [game.category, ...game.tags],
      gamePlatform: ["Web browser", "Desktop", "Mobile"],
      operatingSystem: "Any",
      applicationCategory: "Game",
      isAccessibleForFree: true,
      inLanguage: "en-US",
      publisher: organizationReference(),
    },
    breadcrumbList([
      { name: "Home", path: "/" },
      { name: "All Games", path: "/games" },
      { name: game.title, path },
    ]),
  ];

  if (faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

type GameCollectionOptions = {
  title: string;
  description: string;
  path: string;
  games: GameRecord[];
};

export function buildGameCollectionStructuredData({
  title,
  description,
  path,
  games,
}: GameCollectionOptions): JsonLdDocument {
  const liveGames = games.filter((game) => game.status === "live");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${absoluteSiteUrl(path)}#collection`,
        name: title,
        description,
        url: absoluteSiteUrl(path),
        isPartOf: { "@id": websiteId },
        inLanguage: "en-US",
      },
      {
        "@type": "ItemList",
        numberOfItems: liveGames.length,
        itemListElement: liveGames.map((game, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: game.title,
          url: absoluteSiteUrl(`/games/${game.slug}`),
        })),
      },
    ],
  };
}

export function buildGuideStructuredData(guide: GameGuide): JsonLdDocument {
  const path = `/guides/${guide.slug}`;
  const dateModified = new Date(`${guide.updatedAt} 12:00:00 UTC`)
    .toISOString()
    .slice(0, 10);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${absoluteSiteUrl(path)}#article`,
        headline: guide.title,
        description: guide.summary,
        dateModified,
        mainEntityOfPage: absoluteSiteUrl(path),
        author: organizationReference(),
        publisher: organizationReference(),
        inLanguage: "en-US",
      },
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "Guides", path: "/guides" },
        { name: guide.title, path },
      ]),
    ],
  };
}

export function buildGuideCollectionStructuredData(
  guides: GameGuide[],
): JsonLdDocument {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${absoluteSiteUrl("/guides")}#collection`,
        name: "Browser Game Guides | TurboArcade",
        description:
          "Original TurboArcade strategy guides for quick browser games.",
        url: absoluteSiteUrl("/guides"),
        isPartOf: { "@id": websiteId },
        inLanguage: "en-US",
      },
      {
        "@type": "ItemList",
        numberOfItems: guides.length,
        itemListElement: guides.map((guide, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: guide.title,
          url: absoluteSiteUrl(`/guides/${guide.slug}`),
        })),
      },
    ],
  };
}
