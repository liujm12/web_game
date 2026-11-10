import { describe, expect, it } from "vitest";

import { getGameBySlug, getSiteContent } from "@/lib/site-content";

describe("game content quality gates", () => {
  const priorityGameSlugs = [
    "patrol-escape",
    "merge-shot-2048",
    "checkers-lite",
    "sudoku-sprint",
    "minesweeper",
    "color-sort",
    "word-hunt",
    "2048",
    "snake",
    "breakout-blitz",
  ];

  it("keeps overlapping games in draft status", async () => {
    const content = await getSiteContent();

    expect(getGameBySlug(content, "orbit-hopper")?.status).toBe("draft");
    expect(getGameBySlug(content, "neon-drift")?.status).toBe("draft");
    expect(getGameBySlug(content, "signal-sweep")?.status).toBe("draft");
  });

  it("describes standard Sudoku boxes as 3x3", async () => {
    const content = await getSiteContent();
    const sudoku = getGameBySlug(content, "sudoku-sprint");
    const pageCopy = [
      sudoku?.description,
      ...(sudoku?.instructions ?? []),
      ...(sudoku?.strategyTips ?? []),
      ...(sudoku?.commonMistakes ?? []),
      ...(sudoku?.faq ?? []).flatMap((item) => [item.question, item.answer]),
    ].join(" ");

    expect(pageCopy).toContain("3x3");
    expect(pageCopy).not.toContain("2x2");
    expect(pageCopy).not.toContain("1, 2, 3, or 4");
    expect(pageCopy).toContain("1 through 9");
  });

  it("gives every priority page unique first-hand play notes", async () => {
    const content = await getSiteContent();
    const notes = priorityGameSlugs.flatMap((slug) => {
      const game = getGameBySlug(content, slug);

      expect(game?.playNotes?.length, `${slug} play notes`).toBeGreaterThanOrEqual(3);
      return game?.playNotes ?? [];
    });

    expect(new Set(notes).size).toBe(notes.length);
  });

  it("keeps tested claims aligned with the current game builds", async () => {
    const content = await getSiteContent();
    const patrol = getGameBySlug(content, "patrol-escape");
    const wordHunt = getGameBySlug(content, "word-hunt");

    expect(patrol?.playNotes?.join(" ")).toContain("120");
    expect(patrol?.playNotes?.join(" ")).not.toContain("twelve layouts");
    expect(wordHunt?.controls?.join(" ")).toContain("first and last letter");
  });
});
