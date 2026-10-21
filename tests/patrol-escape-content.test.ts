import { describe, expect, it } from "vitest";

import { getGameBySlug, getSiteContent } from "@/lib/site-content";

describe("Patrol Escape content entry", () => {
  it("publishes the game with complete player-facing and SEO content", async () => {
    const content = await getSiteContent();
    const game = getGameBySlug(content, "patrol-escape");

    expect(game).toMatchObject({
      title: "Patrol Escape",
      category: "brain",
      status: "live",
      componentKey: "patrol-escape",
      playMode: "internal",
    });
    expect(game?.instructions.length).toBeGreaterThanOrEqual(3);
    expect(game?.strategyTips?.length).toBeGreaterThanOrEqual(3);
    expect(game?.commonMistakes?.length).toBeGreaterThanOrEqual(3);
    expect(game?.faq?.length).toBeGreaterThanOrEqual(2);
  });
});
