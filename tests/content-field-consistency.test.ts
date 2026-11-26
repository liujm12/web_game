import { describe, expect, it } from "vitest";

import { guides } from "@/data/guides";
import { getPublicGames, getSiteContent } from "@/lib/site-content";

describe("public content field consistency", () => {
  it("keeps every public game connected to a real category with complete session metadata", async () => {
    const content = await getSiteContent();
    const publicGames = getPublicGames(content);
    const categorySlugs = new Set(content.categories.map((category) => category.slug));
    const seenSlugs = new Set<string>();

    for (const game of publicGames) {
      expect(seenSlugs.has(game.slug), `${game.slug} should be unique`).toBe(false);
      seenSlugs.add(game.slug);
      expect(categorySlugs.has(game.category), `${game.slug} should use a public category`).toBe(true);
      expect(game.difficulty.trim().length, `${game.slug} should have a difficulty`).toBeGreaterThan(0);
      expect(game.estimatedSession.trim().length, `${game.slug} should have a session length`).toBeGreaterThan(0);
      expect(game.lastChecked?.trim().length, `${game.slug} should have a real check date`).toBeGreaterThan(0);
      expect(game.controls?.some((control) => control.startsWith("Mobile:")), `${game.slug} needs mobile controls`).toBe(true);
      expect(game.controls?.some((control) => control.startsWith("Desktop:")), `${game.slug} needs desktop controls`).toBe(true);
    }
  });

  it("uses difficulty ranges only for games whose levels span multiple named bands", async () => {
    const content = await getSiteContent();
    const rangedGames = getPublicGames(content).filter((game) => game.difficultyRange);

    expect(rangedGames.map((game) => game.slug)).toEqual(["patrol-escape"]);
    expect(rangedGames[0]?.difficultyRange).toBe("Easy–Master");
  });

  it("keeps every guide linked to public games and supplies current verification fields", async () => {
    const content = await getSiteContent();
    const publicSlugs = new Set(getPublicGames(content).map((game) => game.slug));

    for (const guide of guides) {
      expect(guide.relatedGameSlugs.length, `${guide.slug} should link to a game`).toBeGreaterThan(0);
      for (const slug of guide.relatedGameSlugs) {
        expect(publicSlugs.has(slug), `${guide.slug} should not link to draft game ${slug}`).toBe(true);
      }
      expect(guide.updatedAt.trim().length, `${guide.slug} should show an update date`).toBeGreaterThan(0);
      expect(guide.verifiedAt.trim().length, `${guide.slug} should show a gameplay check date`).toBeGreaterThan(0);
    }
  });
});
