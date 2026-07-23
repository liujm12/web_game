import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  getFeaturedGames,
  getSiteContent,
  getTrendingGames,
  updateGameRecord,
} from "@/lib/site-content";

const seedContent = {
  site: {
    brandName: "TurboArcade",
    tagline: "Jump in. Play fast. Come back for one more round.",
    description: "Fast browser games built for quick breaks.",
    adsenseClient: "",
    supportEmail: "hello@turboarcade.test",
    launchedAt: "2026-07-04",
  },
  categories: [
    { slug: "arcade", name: "Arcade" },
    { slug: "brain", name: "Brain" },
  ],
  games: [
    {
      slug: "meteor-sprint",
      title: "Meteor Sprint",
      category: "arcade",
      featured: true,
      trendingScore: 98,
      status: "live",
    },
    {
      slug: "memory-mosaic",
      title: "Memory Mosaic",
      category: "brain",
      featured: false,
      trendingScore: 74,
      status: "live",
    },
  ],
};

describe("site content store", () => {
  let filePath = "";

  beforeEach(async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "turboarcade-"));
    filePath = join(tempDir, "site-content.json");
    await writeFile(filePath, JSON.stringify(seedContent, null, 2), "utf8");
  });

  afterEach(async () => {
    if (!filePath) return;
    await writeFile(filePath, "", "utf8");
  });

  it("returns featured games in data order", async () => {
    const content = await getSiteContent(filePath);

    expect(getFeaturedGames(content)).toEqual([
      expect.objectContaining({ slug: "meteor-sprint" }),
    ]);
  });

  it("returns trending games sorted by score", async () => {
    const content = await getSiteContent(filePath);

    expect(getTrendingGames(content).map((game) => game.slug)).toEqual([
      "meteor-sprint",
      "memory-mosaic",
    ]);
  });

  it("updates a single game record and persists it", async () => {
    await updateGameRecord(
      filePath,
      "memory-mosaic",
      {
        featured: true,
        status: "live",
        trendingScore: 92,
      },
    );

    const raw = await readFile(filePath, "utf8");
    const saved = JSON.parse(raw);

    expect(saved.games).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: "memory-mosaic",
          featured: true,
          status: "live",
          trendingScore: 92,
        }),
      ]),
    );
  });
});
