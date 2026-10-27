import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { JsonLd } from "@/components/json-ld";
import { guides } from "@/data/guides";
import { getSiteContent } from "@/lib/site-content";
import {
  buildGameCollectionStructuredData,
  buildGameStructuredData,
  buildGuideCollectionStructuredData,
  buildGuideStructuredData,
  buildSiteStructuredData,
  serializeJsonLd,
} from "@/lib/structured-data";

describe("structured data", () => {
  it("escapes script-breaking characters while preserving valid JSON", () => {
    const serialized = serializeJsonLd({ value: "</script><script>alert(1)</script>" });

    expect(serialized).not.toContain("<");
    expect(JSON.parse(serialized)).toEqual({
      value: "</script><script>alert(1)</script>",
    });
  });

  it("renders sanitized JSON-LD through a native script element", () => {
    const html = renderToStaticMarkup(
      JsonLd({ data: { name: "TurboArcade </script>" } }),
    );

    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain("\\u003c/script>");
    expect(html).not.toContain("TurboArcade </script>");
  });

  it("describes TurboArcade as an organization and website", () => {
    expect(buildSiteStructuredData()).toEqual({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://playturboarcade.com/#organization",
          name: "TurboArcade",
          url: "https://playturboarcade.com/",
        },
        {
          "@type": "WebSite",
          "@id": "https://playturboarcade.com/#website",
          name: "TurboArcade",
          url: "https://playturboarcade.com/",
          description:
            "Fast, mobile-friendly browser games for quick breaks, simple rules, and repeat play.",
          publisher: {
            "@id": "https://playturboarcade.com/#organization",
          },
          inLanguage: "en-US",
        },
      ],
    });
  });

  it("describes a live game, its breadcrumbs, and only its visible FAQ", async () => {
    const content = await getSiteContent();
    const game = content.games.find((entry) => entry.slug === "patrol-escape")!;
    const data = buildGameStructuredData(game, game.faq ?? []);

    expect(data["@graph"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "@type": "VideoGame",
          name: "Patrol Escape",
          url: "https://playturboarcade.com/games/patrol-escape",
          image:
            "https://playturboarcade.com/games/patrol-escape/opengraph-image",
          isAccessibleForFree: true,
          gamePlatform: ["Web browser", "Desktop", "Mobile"],
        }),
        expect.objectContaining({
          "@type": "BreadcrumbList",
          itemListElement: [
            expect.objectContaining({ position: 1, name: "Home" }),
            expect.objectContaining({ position: 2, name: "All Games" }),
            expect.objectContaining({ position: 3, name: "Patrol Escape" }),
          ],
        }),
        expect.objectContaining({
          "@type": "FAQPage",
          mainEntity: (game.faq ?? []).map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }),
      ]),
    );
  });

  it("lists only live games in collection structured data", async () => {
    const content = await getSiteContent();
    const games = [
      content.games.find((entry) => entry.slug === "signal-sweep")!,
      {
        ...content.games.find((entry) => entry.slug === "patrol-escape")!,
        status: "draft" as const,
      },
    ];
    const data = buildGameCollectionStructuredData({
      title: "Brain Games | TurboArcade",
      description: "Short memory and pattern games.",
      path: "/categories/brain",
      games,
    });
    const itemList = data["@graph"].find(
      (entry) => entry["@type"] === "ItemList",
    );

    expect(itemList?.numberOfItems).toBe(1);
    expect(itemList?.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Signal Sweep",
        url: "https://playturboarcade.com/games/signal-sweep",
      },
    ]);
  });

  it("describes guide articles and the guide collection", () => {
    const guide = guides[0];
    const article = buildGuideStructuredData(guide);
    const collection = buildGuideCollectionStructuredData(guides);

    expect(article["@graph"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "@type": "Article",
          headline: guide.title,
          description: guide.summary,
          dateModified: "2026-10-21",
          mainEntityOfPage:
            "https://playturboarcade.com/guides/2048-corner-strategy",
        }),
        expect.objectContaining({ "@type": "BreadcrumbList" }),
      ]),
    );
    expect(collection["@graph"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "@type": "CollectionPage",
          url: "https://playturboarcade.com/guides",
        }),
        expect.objectContaining({
          "@type": "ItemList",
          numberOfItems: guides.length,
        }),
      ]),
    );
  });
});
