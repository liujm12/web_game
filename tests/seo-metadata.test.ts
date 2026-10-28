import { describe, expect, it } from "vitest";

import { metadata as aboutMetadata } from "@/app/about/page";
import { metadata as contactMetadata } from "@/app/contact/page";
import { metadata as dmcaMetadata } from "@/app/dmca/page";
import { generateMetadata as generateCategoryMetadata } from "@/app/categories/[slug]/page";
import {
  buildGamePageMetadata,
  generateMetadata as generateGameMetadata,
} from "@/app/games/[slug]/page";
import { metadata as gamesMetadata } from "@/app/games/page";
import { metadata as guidesMetadata } from "@/app/guides/page";
import { generateMetadata as generateGuideMetadata } from "@/app/guides/[slug]/page";
import { metadata as rootMetadata } from "@/app/layout";
import { metadata as homeMetadata } from "@/app/page";
import { metadata as myGamesMetadata } from "@/app/my-games/page";
import { metadata as privacyMetadata } from "@/app/privacy/page";
import sitemap from "@/app/sitemap";
import { metadata as termsMetadata } from "@/app/terms/page";
import { guides } from "@/data/guides";
import { buildSocialMetadata } from "@/lib/social-metadata";
import { getSiteContent } from "@/lib/site-content";

describe("social sharing metadata", () => {
  it("builds complete Open Graph and Twitter cards without an invented X account", () => {
    const metadata = buildSocialMetadata({
      title: "Patrol Escape - Free Traffic Puzzle Game | TurboArcade",
      description: "Slide cars aside and clear a route for the patrol car.",
      path: "/games/patrol-escape",
      image: "/games/patrol-escape/opengraph-image",
      imageAlt: "Patrol Escape traffic puzzle social card",
    });

    expect(metadata.alternates?.canonical).toBe("/games/patrol-escape");
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      locale: "en_US",
      siteName: "TurboArcade",
      url: "/games/patrol-escape",
      title: "Patrol Escape - Free Traffic Puzzle Game | TurboArcade",
      description: "Slide cars aside and clear a route for the patrol car.",
      images: [
        {
          url: "/games/patrol-escape/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Patrol Escape traffic puzzle social card",
        },
      ],
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Patrol Escape - Free Traffic Puzzle Game | TurboArcade",
      description: "Slide cars aside and clear a route for the patrol car.",
      images: [
        {
          url: "/games/patrol-escape/opengraph-image",
          alt: "Patrol Escape traffic puzzle social card",
        },
      ],
    });
    expect(metadata.twitter).not.toHaveProperty("site");
  });

  it("marks editorial guides as articles", () => {
    const metadata = buildSocialMetadata({
      title: "2048 Corner Strategy | TurboArcade Guides",
      description: "Keep your largest tile anchored and preserve open cells.",
      path: "/guides/2048-corner-strategy",
      type: "article",
    });

    expect(metadata.openGraph).toMatchObject({
      type: "article",
      url: "/guides/2048-corner-strategy",
    });
  });
});

describe("SEO metadata", () => {
  it.each([
    ["home", homeMetadata, "/"],
    ["about", aboutMetadata, "/about"],
    ["contact", contactMetadata, "/contact"],
    ["games", gamesMetadata, "/games"],
    ["guides", guidesMetadata, "/guides"],
    ["privacy", privacyMetadata, "/privacy"],
    ["terms", termsMetadata, "/terms"],
    ["dmca", dmcaMetadata, "/dmca"],
    ["my games", myGamesMetadata, "/my-games"],
  ])("keeps complete social fields aligned on the %s page", (_name, metadata, path) => {
    expect(metadata.alternates?.canonical).toBe(path);
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      locale: "en_US",
      siteName: "TurboArcade",
      url: path,
      title: metadata.title,
      description: metadata.description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: expect.any(String),
        },
      ],
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: [
        {
          url: "/opengraph-image",
          alt: expect.any(String),
        },
      ],
    });
    expect(metadata.twitter).not.toHaveProperty("site");
  });

  it("publishes a complete site-level social fallback", () => {
    expect(rootMetadata.openGraph).toMatchObject({
      type: "website",
      locale: "en_US",
      siteName: "TurboArcade",
      title: "TurboArcade | Free Browser Games",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
        },
      ],
    });
    expect(rootMetadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "TurboArcade | Free Browser Games",
    });
    expect(rootMetadata.twitter).not.toHaveProperty("site");
  });

  it("publishes homepage social metadata with a self-referencing URL", () => {
    expect(homeMetadata.openGraph).toMatchObject({
      url: "/",
      title: "TurboArcade | Free Browser Games",
      siteName: "TurboArcade",
    });
    expect(homeMetadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "TurboArcade | Free Browser Games",
    });
  });

  it("keeps the device-specific My Games page noindex with its own share URL", () => {
    expect(myGamesMetadata.robots).toMatchObject({
      index: false,
      follow: true,
    });
    expect(myGamesMetadata.openGraph).toMatchObject({
      url: "/my-games",
      title: "My Games | TurboArcade",
    });
    expect(myGamesMetadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "My Games | TurboArcade",
    });
  });

  it("publishes self-referencing canonicals for core static pages", () => {
    expect(homeMetadata.alternates?.canonical).toBe("/");
    expect(aboutMetadata.alternates?.canonical).toBe("/about");
    expect(contactMetadata.alternates?.canonical).toBe("/contact");
    expect(gamesMetadata.alternates?.canonical).toBe("/games");
    expect(guidesMetadata.alternates?.canonical).toBe("/guides");
    expect(privacyMetadata.alternates?.canonical).toBe("/privacy");
    expect(termsMetadata.alternates?.canonical).toBe("/terms");
    expect(dmcaMetadata.alternates?.canonical).toBe("/dmca");
  });

  it("gives About and Contact distinct search metadata", () => {
    expect(aboutMetadata.title).toBe("About TurboArcade | Free Browser Games");
    expect(contactMetadata.title).toBe("Contact TurboArcade");
    expect(aboutMetadata.description).not.toBe(contactMetadata.description);
  });

  it("publishes self-referencing canonicals for dynamic game and category pages", async () => {
    const gameMetadata = await generateGameMetadata({
      params: Promise.resolve({ slug: "signal-sweep" }),
    });
    const categoryMetadata = await generateCategoryMetadata({
      params: Promise.resolve({ slug: "brain" }),
    });

    expect(gameMetadata.alternates?.canonical).toBe("/games/signal-sweep");
    expect(categoryMetadata.alternates?.canonical).toBe("/categories/brain");
  });

  it("publishes distinct social metadata for games and categories", async () => {
    const gameMetadata = await generateGameMetadata({
      params: Promise.resolve({ slug: "signal-sweep" }),
    });
    const categoryMetadata = await generateCategoryMetadata({
      params: Promise.resolve({ slug: "brain" }),
    });

    expect(gameMetadata.openGraph).toMatchObject({
      type: "website",
      url: "/games/signal-sweep",
      siteName: "TurboArcade",
      images: [
        {
          url: "/games/signal-sweep/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Signal Sweep free browser game social card",
        },
      ],
    });
    expect(gameMetadata.twitter).toMatchObject({
      card: "summary_large_image",
      images: [
        {
          url: "/games/signal-sweep/opengraph-image",
          alt: "Signal Sweep free browser game social card",
        },
      ],
    });
    expect(categoryMetadata.openGraph).toMatchObject({
      type: "website",
      url: "/categories/brain",
      title: "Brain Games | TurboArcade",
    });
  });

  it("does not publish social metadata for draft games", async () => {
    const content = await getSiteContent();
    const liveGame = content.games.find((game) => game.slug === "signal-sweep");

    expect(liveGame).toBeDefined();
    expect(
      buildGamePageMetadata({
        ...liveGame!,
        status: "draft",
      }),
    ).toEqual({
      title: "Game not found | TurboArcade",
    });
  });

  it("publishes article cards for guide pages", async () => {
    const guideMetadata = await generateGuideMetadata({
      params: Promise.resolve({ slug: "2048-corner-strategy" }),
    });

    expect(guideMetadata.openGraph).toMatchObject({
      type: "article",
      url: "/guides/2048-corner-strategy",
      title: "2048 Corner Strategy | TurboArcade Guides",
      siteName: "TurboArcade",
    });
    expect(guideMetadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "2048 Corner Strategy | TurboArcade Guides",
    });
  });
});

describe("sitemap", () => {
  it("uses the site update for catalog pages and editorial dates for guides", async () => {
    const entries = await sitemap();
    const expectedLastModified = new Date("2026-10-22").toISOString();
    const guideUrls = new Set(
      guides.map(
        (guide) => `https://playturboarcade.com/guides/${guide.slug}`,
      ),
    );
    const catalogEntries = entries.filter(
      (entry) => !guideUrls.has(entry.url),
    );

    expect(entries.length).toBeGreaterThan(20);
    expect(
      catalogEntries.every(
        (entry) =>
          entry.lastModified &&
          new Date(entry.lastModified).toISOString() === expectedLastModified,
      ),
    ).toBe(true);
    expect(
      entries.some(
        (entry) =>
          guideUrls.has(entry.url) &&
          entry.lastModified &&
          new Date(entry.lastModified).toISOString() !== expectedLastModified,
      ),
    ).toBe(true);
    expect(
      entries.some(
        (entry) =>
          entry.lastModified &&
          new Date(entry.lastModified).toISOString() ===
            new Date("2026-07-04").toISOString(),
      ),
    ).toBe(false);
  });
});
