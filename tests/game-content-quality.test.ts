import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import { guides } from "@/data/guides";
import { getGameBySlug, getSiteContent } from "@/lib/site-content";

describe("game content quality gates", () => {
  const coreGameSlugs = [
    "patrol-escape",
    "merge-shot-2048",
    "number-rush",
    "target-blitz",
    "memory-mosaic",
    "pattern-pulse",
    "2048",
    "snake",
  ] as const;

  const priorityGameSlugs = [
    "patrol-escape",
    "merge-shot-2048",
    "number-rush",
    "target-blitz",
    "memory-mosaic",
    "pattern-pulse",
    "checkers-lite",
    "sudoku-sprint",
    "minesweeper",
    "color-sort",
    "word-hunt",
    "2048",
    "snake",
    "breakout-blitz",
  ];

  const secondaryGameSlugs = [
    "meteor-sprint",
    "four-in-a-row",
    "breakout-blitz",
    "comet-loop",
    "block-drop",
    "minesweeper",
    "sudoku-sprint",
    "word-hunt",
    "hangman",
    "color-sort",
    "flappy-dash",
    "checkers-lite",
  ] as const;

  const weakGameSlugs = ["orbit-hopper", "neon-drift", "signal-sweep"] as const;

  const gameSpecificSignals: Record<string, string[]> = {
    "meteor-sprint": ["three-lane", "meteor"],
    "memory-mosaic": ["pairs", "memory"],
    "pattern-pulse": ["sequence", "pads"],
    "target-blitz": ["target", "20-second"],
    "number-rush": ["1 through 9", "mistake"],
    "2048": ["4x4", "merge"],
    "merge-shot-2048": ["lane", "launch"],
    snake: ["12x12", "fruit"],
    "four-in-a-row": ["15x15", "five"],
    "breakout-blitz": ["paddle", "bricks"],
    "comet-loop": ["gate", "timing"],
    "block-drop": ["falling-block", "rows"],
    minesweeper: ["safe first reveal", "mines"],
    "sudoku-sprint": ["9x9", "3x3"],
    "word-hunt": ["8x8", "six"],
    hangman: ["clue", "wrong guesses"],
    "color-sort": ["tubes", "pours"],
    "flappy-dash": ["gap", "flap"],
    "checkers-lite": ["mandatory captures", "multi-jumps"],
    "patrol-escape": ["120", "solver-verified"],
  };

  it("keeps overlapping games in draft status", async () => {
    const content = await getSiteContent();

    for (const slug of weakGameSlugs) {
      const game = getGameBySlug(content, slug);

      expect(game?.editorialTier, `${slug} tier`).toBe("C");
      expect(game?.status, `${slug} status`).toBe("draft");
      expect(game?.featured, `${slug} featured`).toBe(false);
    }
  });

  it("publishes only explicitly reviewed A- and B-tier games", async () => {
    const content = await getSiteContent();

    for (const slug of coreGameSlugs) {
      const game = getGameBySlug(content, slug);

      expect(game?.editorialTier, `${slug} tier`).toBe("A");
      expect(game?.status, `${slug} status`).toBe("live");
      expect(game?.featured, `${slug} featured`).toBe(true);
    }

    for (const slug of secondaryGameSlugs) {
      const game = getGameBySlug(content, slug);

      expect(game?.editorialTier, `${slug} tier`).toBe("B");
      expect(game?.status, `${slug} status`).toBe("live");
      expect(game?.featured, `${slug} featured`).toBe(false);
    }

    const publicTiers = content.games
      .filter((game) => game.status === "live")
      .map((game) => game.editorialTier);
    expect(new Set(publicTiers)).toEqual(new Set(["A", "B"]));
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

  it("publishes complete editorial records for every A-tier game page", async () => {
    const content = await getSiteContent();

    for (const slug of coreGameSlugs) {
      const game = getGameBySlug(content, slug);

      expect(game?.description.length, `${slug} introduction`).toBeGreaterThan(180);
      expect(game?.instructions.length, `${slug} instructions`).toBeGreaterThanOrEqual(3);
      expect(game?.strategyTips?.length, `${slug} strategy`).toBeGreaterThanOrEqual(4);
      expect(game?.commonMistakes?.length, `${slug} mistakes`).toBeGreaterThanOrEqual(4);
      expect(game?.faq?.length, `${slug} FAQ`).toBeGreaterThanOrEqual(3);
      expect(game?.playNotes?.length, `${slug} playtest notes`).toBeGreaterThanOrEqual(3);
      expect(game?.testedOn?.length, `${slug} tested devices`).toBeGreaterThanOrEqual(3);
      expect(game?.testedOn?.join(" "), `${slug} desktop test`).toMatch(/desktop/i);
      expect(game?.testedOn?.join(" "), `${slug} mobile test`).toMatch(/mobile/i);
      expect(game?.lastChecked, `${slug} review date`).toBe("November 11, 2026");
      expect(game?.relatedHub?.href, `${slug} center href`).toMatch(/^\/(categories|traffic-puzzle-games)/);
      expect(game?.relatedHub?.label, `${slug} center label`).toBeTruthy();

      const relatedGuides = guides.filter((guide) => guide.relatedGameSlugs.includes(slug));
      expect(relatedGuides.length, `${slug} related guides`).toBeGreaterThanOrEqual(1);
    }
  });

  it("keeps tested claims aligned with the current game builds", async () => {
    const content = await getSiteContent();
    const patrol = getGameBySlug(content, "patrol-escape");
    const wordHunt = getGameBySlug(content, "word-hunt");

    expect(patrol?.playNotes?.join(" ")).toContain("120");
    expect(patrol?.playNotes?.join(" ")).not.toContain("twelve layouts");
    expect(wordHunt?.controls?.join(" ")).toContain("first and last letter");
  });

  it("gives every live game mechanic-specific player guidance", async () => {
    const content = await getSiteContent();
    const liveGames = content.games.filter((game) => game.status === "live");

    expect(liveGames.map((game) => game.slug).sort()).toEqual(
      Object.keys(gameSpecificSignals).sort(),
    );

    for (const game of liveGames) {
      const description = game.description.toLowerCase();

      expect(description, `${game.slug} title`).toContain(game.title.toLowerCase());
      for (const signal of gameSpecificSignals[game.slug]) {
        expect(description, `${game.slug} description`).toContain(signal);
      }

      expect(game.bestFor?.length, `${game.slug} best for`).toBeGreaterThanOrEqual(2);
      expect(game.strategyTips?.length, `${game.slug} strategy tips`).toBeGreaterThanOrEqual(3);
      expect(game.commonMistakes?.length, `${game.slug} mistakes`).toBeGreaterThanOrEqual(3);
      expect(game.faq?.length, `${game.slug} FAQ`).toBeGreaterThanOrEqual(2);
      expect(game.playNotes?.length, `${game.slug} build notes`).toBeGreaterThanOrEqual(2);

      const controls = game.controls?.join(" ") ?? "";
      expect(controls, `${game.slug} desktop controls`).toContain("Desktop:");
      expect(controls, `${game.slug} mobile controls`).toContain("Mobile:");

      for (const item of game.faq ?? []) {
        expect(item.question, `${game.slug} FAQ question`).not.toMatch(/^How do I play /i);
        expect(item.question, `${game.slug} FAQ question`).not.toMatch(/Does it work on (phones|mobile)/i);
      }
    }
  });

  it("does not reuse descriptions, tips, mistakes, or FAQ questions between live games", async () => {
    const content = await getSiteContent();
    const liveGames = content.games.filter((game) => game.status === "live");
    const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");
    const groups = {
      descriptions: liveGames.map((game) => game.description),
      tips: liveGames.flatMap((game) => game.strategyTips ?? []),
      mistakes: liveGames.flatMap((game) => game.commonMistakes ?? []),
      questions: liveGames.flatMap((game) => game.faq?.map((item) => item.question) ?? []),
    };

    for (const [label, values] of Object.entries(groups)) {
      const normalized = values.map(normalize);
      expect(new Set(normalized).size, label).toBe(normalized.length);
    }
  });

  it("keeps control and end-state copy aligned with the playable builds", async () => {
    const content = await getSiteContent();
    const meteor = getGameBySlug(content, "meteor-sprint");
    const tile2048 = getGameBySlug(content, "2048");
    const mergeShot = getGameBySlug(content, "merge-shot-2048");
    const breakout = getGameBySlug(content, "breakout-blitz");
    const flappy = getGameBySlug(content, "flappy-dash");

    expect([meteor?.description, ...(meteor?.playNotes ?? [])].join(" ")).not.toMatch(
      /speed increases|fall rate increases/i,
    );
    expect(meteor?.instructions?.join(" ")).not.toMatch(/streak/i);
    expect(meteor?.controls?.find((item) => item.startsWith("Mobile:"))).not.toMatch(/hold|release/i);
    expect(tile2048?.controls?.join(" ")).not.toMatch(/arrow keys/i);
    expect(tile2048?.playNotes?.join(" ")).not.toMatch(/key presses/i);
    expect([...(mergeShot?.playNotes ?? []), ...(mergeShot?.faq?.map((item) => item.answer) ?? [])].join(" ")).toMatch(
      /top row/i,
    );
    expect([...(mergeShot?.playNotes ?? []), ...(mergeShot?.faq?.map((item) => item.answer) ?? [])].join(" ")).toMatch(
      /compacts once after/i,
    );
    expect(breakout?.controls?.join(" ")).toMatch(/below the field/i);
    expect(breakout?.controls?.find((item) => item.startsWith("Mobile:"))).not.toMatch(/hold|holding/i);
    expect([...(flappy?.instructions ?? []), ...(flappy?.controls ?? [])].join(" ")).not.toMatch(
      /tap the field to (start|restart)|tap anywhere.*start/i,
    );
  });

  it("keeps rules and advice consistent with each game's current mechanics", async () => {
    const content = await getSiteContent();
    const wordHunt = getGameBySlug(content, "word-hunt");
    const hangman = getGameBySlug(content, "hangman");
    const minesweeper = getGameBySlug(content, "minesweeper");
    const sudoku = getGameBySlug(content, "sudoku-sprint");
    const checkers = getGameBySlug(content, "checkers-lite");
    const target = getGameBySlug(content, "target-blitz");
    const colorSort = getGameBySlug(content, "color-sort");
    const flappy = getGameBySlug(content, "flappy-dash");

    expect([
      ...(wordHunt?.instructions ?? []),
      ...(wordHunt?.strategyTips ?? []),
      ...(wordHunt?.commonMistakes ?? []),
    ].join(" ")).not.toMatch(/submit|clear before|clear the current/i);
    expect(wordHunt?.controls?.find((item) => item.startsWith("Mobile:"))).not.toMatch(/drag/i);
    expect(wordHunt?.bestFor?.join(" ")).not.toMatch(/slower break|feels interactive/i);
    expect(hangman?.instructions?.join(" ")).toMatch(/Easy.*8.*Normal.*6.*Hard.*5/i);
    expect(minesweeper?.faq?.map((item) => item.answer).join(" ")).toMatch(/8x8.*9x9.*10x10/i);
    expect(sudoku?.strategyTips?.join(" ")).not.toMatch(/row has three numbers, fill the missing value/i);
    expect(checkers?.faq?.map((item) => item.answer).join(" ")).not.toMatch(/red and black/i);
    expect(checkers?.faq?.map((item) => item.answer).join(" ")).toMatch(/orange and cyan/i);
    expect(checkers?.bestFor?.join(" ")).toMatch(/computer difficulty|local two-player/i);
    expect(target?.instructions?.join(" ")).not.toMatch(/streak/i);
    expect([...(colorSort?.playNotes ?? []), ...(colorSort?.commonMistakes ?? [])].join(" ")).not.toMatch(
      /two empty tubes remain|filling both empty tubes/i,
    );
    expect(flappy?.instructions?.join(" ")).not.toMatch(/green barriers/i);
    expect(flappy?.playNotes?.join(" ")).toMatch(/ceiling/i);

    const bestFor = content.games
      .filter((game) => game.status === "live")
      .flatMap((game) => game.bestFor ?? [])
      .join(" ");
    expect(bestFor).not.toMatch(/calmer brain break|low-pressure breaks|not a number puzzle/i);
  });

  it("does not repeat JSON properties inside a game record", async () => {
    const raw = await readFile("data/site-content.json", "utf8");
    const content = await getSiteContent();
    const uniqueGameProperties = [
      "description",
      "instructions",
      "controls",
      "bestFor",
      "strategyTips",
      "commonMistakes",
      "faq",
      "playNotes",
      "testedOn",
      "lastChecked",
      "relatedHub",
      "editorialTier",
    ];

    for (const [index, game] of content.games.entries()) {
      const start = raw.indexOf(`"slug": "${game.slug}"`);
      const nextSlug = content.games[index + 1]?.slug;
      const end = nextSlug ? raw.indexOf(`"slug": "${nextSlug}"`) : raw.length;
      const record = raw.slice(start, end);

      expect(start, `${game.slug} record start`).toBeGreaterThanOrEqual(0);
      expect(end, `${game.slug} record end`).toBeGreaterThan(start);
      for (const property of uniqueGameProperties) {
        const matches = record.match(new RegExp(`^\\s*"${property}"\\s*:`, "gm")) ?? [];
        expect(matches.length, `${game.slug}.${property}`).toBeLessThanOrEqual(1);
      }
    }
  });
});
