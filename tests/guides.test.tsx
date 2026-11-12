// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { existsSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { guides } from "@/data/guides";
import { patrolEscapeLevels } from "@/data/patrol-escape-levels";
import GamePage from "@/app/games/[slug]/page";
import { applyVehicleMove, createPatrolEscapeState, isPatrolEscapeSolved } from "@/lib/patrol-escape";

afterEach(() => cleanup());

describe("guides", () => {
  it("ships a first batch of substantial, game-specific guides", () => {
    expect(guides.length).toBeGreaterThanOrEqual(4);

    for (const guide of guides) {
      expect(guide.sections.length).toBeGreaterThanOrEqual(3);
      expect(guide.sections.flatMap((section) => section.paragraphs).join(" ").length).toBeGreaterThan(700);
      expect(guide.relatedGameSlugs.length).toBeGreaterThan(0);
    }
  });

  it("renders the guides index with original strategy topics", async () => {
    const pageModule = await import("@/app/guides/page");
    const Page = pageModule.default;

    render(await Page());

    expect(screen.getByRole("heading", { name: "Play smarter, one game at a time" })).toBeInTheDocument();
    expect(screen.getByText("2048 Corner Strategy")).toBeInTheDocument();
    expect(screen.getByText("Snake: Build Space Before Length")).toBeInTheDocument();
  });

  it("publishes the traffic puzzle hub and a screenshot-supported Patrol Escape guide", async () => {
    const patrolGuide = guides.find((guide) => guide.slug === "how-to-play-patrol-escape");
    expect(patrolGuide?.images).toHaveLength(8);
    expect(patrolGuide?.sections.length).toBeGreaterThanOrEqual(5);
    for (const image of patrolGuide?.images ?? []) {
      expect(existsSync(path.join(process.cwd(), "public", image.src))).toBe(true);
      expect(image.alt.length).toBeGreaterThan(20);
      expect(image.caption.length).toBeGreaterThan(30);
    }

    const hubModule = await import("@/app/traffic-puzzle-games/page");
    const hub = render(await hubModule.default());
    expect(screen.getByRole("heading", { name: "Traffic Puzzle Games: Clear the Grid One Move at a Time" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Play Patrol Escape" })).toHaveAttribute("href", "/games/patrol-escape");
    expect(screen.getByRole("link", { name: "Learn the traffic puzzle rules" })).toHaveAttribute("href", "/guides/how-to-play-patrol-escape");
    expect(screen.getByRole("link", { name: "Patrol Escape beginner strategy" })).toHaveAttribute("href", "/guides/patrol-escape-beginner-strategy");
    expect(screen.getByRole("link", { name: "Expert traffic puzzle guide" })).toHaveAttribute("href", "/guides/expert-traffic-puzzle-guide");
    const hubJsonLd = hub.container.querySelector('script[type="application/ld+json"]');
    expect(hubJsonLd).toBeInTheDocument();
    expect(hubJsonLd?.textContent).toContain("CollectionPage");
    expect(hubJsonLd?.textContent).toContain("ItemList");
    expect(hubJsonLd?.textContent).toContain("BreadcrumbList");
    cleanup();

    const guideModule = await import("@/app/guides/[slug]/page");
    render(await guideModule.default({ params: Promise.resolve({ slug: "how-to-play-patrol-escape" }) }));
    expect(screen.getByRole("heading", { name: "How to Play Patrol Escape" })).toBeInTheDocument();
    expect(screen.getAllByRole("img").length).toBeGreaterThanOrEqual(5);
    expect(screen.getByRole("link", { name: "Play Patrol Escape" })).toHaveAttribute("href", "/games/patrol-escape");
    expect(screen.getByRole("link", { name: "Explore Traffic Puzzle Games" })).toHaveAttribute("href", "/traffic-puzzle-games");
    expect(screen.getByRole("link", { name: "Patrol Escape beginner strategy" })).toHaveAttribute("href", "/guides/patrol-escape-beginner-strategy");
    expect(screen.getByText(/Published by TurboArcade Editorial Team/)).toBeInTheDocument();
    expect(screen.getByText(/Gameplay checked November 12, 2026/)).toBeInTheDocument();
    cleanup();

    render(await GamePage({ params: Promise.resolve({ slug: "patrol-escape" }) }));
    expect(screen.getByRole("link", { name: "Explore Traffic Puzzle Games" })).toHaveAttribute("href", "/traffic-puzzle-games");
  });

  it("uses three real, solver-verifiable Patrol Escape levels in the beginner strategy", async () => {
    const strategy = guides.find((guide) => guide.slug === "patrol-escape-beginner-strategy");
    expect(strategy?.caseStudies?.map((caseStudy) => [caseStudy.levelId, caseStudy.difficulty])).toEqual([
      [18, "Easy"],
      [31, "Medium"],
      [94, "Expert"],
    ]);

    for (const caseStudy of strategy?.caseStudies ?? []) {
      const level = patrolEscapeLevels.find((candidate) => candidate.id === caseStudy.levelId);
      expect(level?.difficulty).toBe(caseStudy.difficulty);
      let state = createPatrolEscapeState(level!);
      for (const move of caseStudy.solution) state = applyVehicleMove(state, move.vehicleId, move.delta);
      expect(isPatrolEscapeSolved(state)).toBe(true);
      expect(state.moves).toBe(level?.par);
    }

    const guideModule = await import("@/app/guides/[slug]/page");
    render(await guideModule.default({ params: Promise.resolve({ slug: "patrol-escape-beginner-strategy" }) }));
    expect(screen.getByRole("heading", { name: "Patrol Escape Beginner Strategy" })).toBeInTheDocument();
    expect(screen.getAllByRole("img", { name: /Initial layout for Patrol Escape level/ })).toHaveLength(3);
    expect(screen.getByText("Easy case study · Level 18")).toBeInTheDocument();
    expect(screen.getByText("Medium case study · Level 31")).toBeInTheDocument();
    expect(screen.getByText("Expert case study · Level 94")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Play Patrol Escape" })).toHaveAttribute("href", "/games/patrol-escape");
    expect(screen.getByRole("link", { name: "Explore Traffic Puzzle Games" })).toHaveAttribute("href", "/traffic-puzzle-games");
    expect(screen.getByRole("link", { name: "Expert traffic puzzle guide" })).toHaveAttribute("href", "/guides/expert-traffic-puzzle-guide");
    cleanup();
  });

  it("publishes an editorially analyzed Expert guide with three 20-plus-step Master routes", async () => {
    const expertGuide = guides.find((guide) => guide.slug === "expert-traffic-puzzle-guide");
    expect(expertGuide?.caseStudies?.map((caseStudy) => [caseStudy.levelId, caseStudy.difficulty])).toEqual([
      [101, "Master"],
      [102, "Master"],
      [119, "Master"],
    ]);

    for (const caseStudy of expertGuide?.caseStudies ?? []) {
      const level = patrolEscapeLevels.find((candidate) => candidate.id === caseStudy.levelId);
      expect(level?.difficulty).toBe("Master");
      expect(level?.par).toBeGreaterThanOrEqual(20);
      expect(caseStudy.complexitySource?.length).toBeGreaterThan(100);
      let state = createPatrolEscapeState(level!);
      for (const move of caseStudy.solution) state = applyVehicleMove(state, move.vehicleId, move.delta);
      expect(isPatrolEscapeSolved(state)).toBe(true);
      expect(state.moves).toBe(level?.par);
    }

    const guideModule = await import("@/app/guides/[slug]/page");
    const rendered = render(await guideModule.default({ params: Promise.resolve({ slug: "expert-traffic-puzzle-guide" }) }));
    expect(screen.getByRole("heading", { name: "Expert Traffic Puzzle Guide" })).toBeInTheDocument();
    expect(screen.getAllByRole("img", { name: /Initial layout for Patrol Escape level/ })).toHaveLength(3);
    expect(screen.getAllByRole("heading", { name: "Where the 20+ steps come from" })).toHaveLength(3);
    expect(screen.getByText("Master case study · Level 101")).toBeInTheDocument();
    expect(screen.getByText("Master case study · Level 102")).toBeInTheDocument();
    expect(screen.getByText("Master case study · Level 119")).toBeInTheDocument();
    expect(rendered.container.textContent).not.toContain("Hint: move");
    expect(screen.getByRole("link", { name: "Play Patrol Escape" })).toHaveAttribute("href", "/games/patrol-escape");
    expect(screen.getByRole("link", { name: "Learn the traffic puzzle rules" })).toHaveAttribute("href", "/guides/how-to-play-patrol-escape");
    expect(screen.getByRole("link", { name: "Explore Traffic Puzzle Games" })).toHaveAttribute("href", "/traffic-puzzle-games");
    cleanup();
  });

  it("teaches the 2048 corner strategy with real, actionable board positions", async () => {
    const strategy = guides.find((guide) => guide.slug === "2048-corner-strategy");
    const guideText = strategy?.sections
      .flatMap((section) => [section.heading, ...section.paragraphs, ...(section.tips ?? [])])
      .join(" ") ?? "";

    expect(strategy?.updatedAt).toBe("November 12, 2026");
    expect(strategy?.images).toHaveLength(4);
    expect(strategy?.sections.map((section) => section.heading)).toEqual([
      "Position 1: Lock the largest tile into one corner",
      "Position 2: Recognize a broken corner chain",
      "Position 3: Return the largest tile before the corner fills",
      "Position 4: Protect empty cells before chasing points",
    ]);
    expect(guideText).toMatch(/bottom-left/i);
    expect(guideText).toMatch(/move left/i);
    expect(guideText).toMatch(/empty cells/i);
    expect(guideText).toMatch(/do not/i);

    for (const image of strategy?.images ?? []) {
      expect(image.src).toMatch(/^\/images\/gameplay\/2048\/desktop-(corner-anchor|broken-order|corner-recovery|open-space)\.webp$/);
      expect(image.alt.length).toBeGreaterThan(45);
      expect(image.caption.length).toBeGreaterThan(90);
      expect(existsSync(path.join(process.cwd(), "public", image.src))).toBe(true);
    }

    const guideModule = await import("@/app/guides/[slug]/page");
    render(await guideModule.default({ params: Promise.resolve({ slug: "2048-corner-strategy" }) }));
    expect(screen.getByRole("region", { name: "2048 Corner Strategy examples" })).toBeInTheDocument();
    expect(screen.getAllByRole("img", { name: /TurboArcade 2048 strategy position/i })).toHaveLength(4);
    expect(screen.getByRole("link", { name: "Play 2048" })).toHaveAttribute("href", "/games/2048");
    expect(screen.getByText(/Published by TurboArcade Editorial Team/)).toBeInTheDocument();
    cleanup();
  });

  it("teaches how to recover a crowded 2048 board without repeating corner strategy", async () => {
    const guide = guides.find((candidate) => candidate.slug === "recover-a-crowded-2048-board");
    const guideText = guide?.sections
      .flatMap((section) => [section.heading, ...section.paragraphs, ...(section.tips ?? [])])
      .join(" ") ?? "";

    expect(guide?.title).toBe("Recover a Crowded 2048 Board");
    expect(guide?.updatedAt).toBe("November 12, 2026");
    expect(guide?.images).toHaveLength(4);
    expect(guide?.sections.map((section) => section.heading)).toEqual([
      "Position 1: Measure whether the board still has breathing room",
      "Position 2: Delay the smaller merge and create two exits",
      "Position 3: Spend a zero-score move to restore number order",
      "Position 4: Know when the board cannot be recovered",
    ]);
    expect(guideText).toMatch(/empty cells/i);
    expect(guideText).toMatch(/delay/i);
    expect(guideText).toMatch(/zero-score/i);
    expect(guideText).toMatch(/horizontal or vertical/i);
    expect(guideText).not.toMatch(/bottom-left|anchor tile/i);

    const expectedImages = [
      "/images/gameplay/2048/desktop-crowded-mobility.webp",
      "/images/gameplay/2048/desktop-crowded-delay-merge.webp",
      "/images/gameplay/2048/desktop-crowded-order-repair.webp",
      "/images/gameplay/2048/desktop-no-moves-left.webp",
    ];
    expect(guide?.images?.map((image) => image.src)).toEqual(expectedImages);
    for (const image of guide?.images ?? []) {
      expect(image.alt.length).toBeGreaterThan(45);
      expect(image.caption.length).toBeGreaterThan(90);
      expect(existsSync(path.join(process.cwd(), "public", image.src))).toBe(true);
    }

    expect(
      guides.find((candidate) => candidate.slug === "2048-corner-strategy")?.relatedGuideSlugs,
    ).toContain("recover-a-crowded-2048-board");

    const guideModule = await import("@/app/guides/[slug]/page");
    render(await guideModule.default({
      params: Promise.resolve({ slug: "recover-a-crowded-2048-board" }),
    }));
    expect(screen.getByRole("region", { name: "Recover a Crowded 2048 Board examples" })).toBeInTheDocument();
    expect(screen.getAllByRole("img", { name: /crowded|no legal slide/i })).toHaveLength(4);
    expect(screen.getByRole("link", { name: "Play 2048" })).toHaveAttribute("href", "/games/2048");
    expect(screen.getByRole("link", { name: "2048 corner strategy" })).toHaveAttribute("href", "/guides/2048-corner-strategy");
    cleanup();
  });
});
