import { describe, expect, it } from "vitest";

import {
  createEmptyPlayerProfile,
  getDailyChallenge,
  parsePlayerProfile,
  recordBestScore,
  recordGameVisit,
  toggleFavorite,
} from "@/lib/player-profile";

describe("player profile", () => {
  it("toggles favorites without duplicates", () => {
    const first = toggleFavorite(createEmptyPlayerProfile(), "snake");
    const second = toggleFavorite(first, "snake");

    expect(first.favorites).toEqual(["snake"]);
    expect(second.favorites).toEqual([]);
  });

  it("keeps the most recently played game first", () => {
    const first = recordGameVisit(createEmptyPlayerProfile(), "2048", 100);
    const second = recordGameVisit(first, "snake", 200);
    const third = recordGameVisit(second, "2048", 300);

    expect(third.recent).toEqual([
      { slug: "2048", playedAt: 300 },
      { slug: "snake", playedAt: 200 },
    ]);
  });

  it("only replaces a best score with a stronger result", () => {
    const first = recordBestScore(
      createEmptyPlayerProfile(),
      "target-blitz",
      14,
      "14 hits",
      100,
    );
    const weaker = recordBestScore(first, "target-blitz", 10, "10 hits", 200);
    const stronger = recordBestScore(weaker, "target-blitz", 18, "18 hits", 300);

    expect(weaker.bestScores["target-blitz"]).toMatchObject({ score: 14 });
    expect(stronger.bestScores["target-blitz"]).toEqual({
      score: 18,
      label: "18 hits",
      updatedAt: 300,
    });
  });

  it("returns a stable daily challenge for the same date", () => {
    const slugs = ["2048", "snake", "target-blitz", "number-rush"];

    expect(getDailyChallenge(slugs, "2026-10-21")).toBe(
      getDailyChallenge(slugs, "2026-10-21"),
    );
    expect(slugs).toContain(getDailyChallenge(slugs, "2026-10-21"));
  });

  it("ignores malformed stored scores instead of breaking the player library", () => {
    const profile = parsePlayerProfile(
      JSON.stringify({
        favorites: ["snake", 42],
        recent: [{ slug: "2048", playedAt: 100 }, { slug: null }],
        bestScores: {
          snake: { score: 40, label: "40 points", updatedAt: 200 },
          broken: { score: "high" },
        },
      }),
    );

    expect(profile.favorites).toEqual(["snake"]);
    expect(profile.recent).toEqual([{ slug: "2048", playedAt: 100 }]);
    expect(profile.bestScores).toEqual({
      snake: { score: 40, label: "40 points", updatedAt: 200 },
    });
  });
});
