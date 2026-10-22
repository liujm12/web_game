import { describe, expect, it } from "vitest";

import { metadata as aboutMetadata } from "@/app/about/page";
import { metadata as contactMetadata } from "@/app/contact/page";
import { metadata as dmcaMetadata } from "@/app/dmca/page";
import { generateMetadata as generateCategoryMetadata } from "@/app/categories/[slug]/page";
import { generateMetadata as generateGameMetadata } from "@/app/games/[slug]/page";
import { metadata as gamesMetadata } from "@/app/games/page";
import { metadata as guidesMetadata } from "@/app/guides/page";
import { metadata as homeMetadata } from "@/app/page";
import { metadata as privacyMetadata } from "@/app/privacy/page";
import sitemap from "@/app/sitemap";
import { metadata as termsMetadata } from "@/app/terms/page";

describe("SEO metadata", () => {
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
});

describe("sitemap", () => {
  it("uses the latest significant content update instead of the launch date", async () => {
    const entries = await sitemap();
    const expectedLastModified = new Date("2026-10-22").toISOString();

    expect(entries.length).toBeGreaterThan(20);
    expect(
      entries.every(
        (entry) =>
          entry.lastModified &&
          new Date(entry.lastModified).toISOString() === expectedLastModified,
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
