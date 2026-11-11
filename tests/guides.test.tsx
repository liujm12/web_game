// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { guides } from "@/data/guides";
import { patrolEscapeLevels } from "@/data/patrol-escape-levels";
import GamePage from "@/app/games/[slug]/page";
import { applyVehicleMove, createPatrolEscapeState, isPatrolEscapeSolved } from "@/lib/patrol-escape";

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
    expect(screen.getByRole("link", { name: /How to Play Patrol Escape/ })).toHaveAttribute("href", "/guides/how-to-play-patrol-escape");
    expect(screen.getByRole("link", { name: "Beginner Strategy" })).toHaveAttribute("href", "/guides/patrol-escape-beginner-strategy");
    expect(screen.getByRole("link", { name: "Expert Guide" })).toHaveAttribute("href", "/guides/expert-traffic-puzzle-guide");
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
    expect(screen.getByRole("link", { name: "Traffic Puzzle Games" })).toHaveAttribute("href", "/traffic-puzzle-games");
    expect(screen.getByRole("link", { name: "Read Patrol Escape Beginner Strategy" })).toHaveAttribute("href", "/guides/patrol-escape-beginner-strategy");
    expect(screen.getByText(/Written and reviewed by TurboArcade Editorial Team/)).toBeInTheDocument();
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
    expect(screen.getByRole("link", { name: "Traffic Puzzle Games" })).toHaveAttribute("href", "/traffic-puzzle-games");
    expect(screen.getByRole("link", { name: "Read How to Play Patrol Escape" })).toHaveAttribute("href", "/guides/how-to-play-patrol-escape");
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
    expect(screen.getByRole("link", { name: "Read Patrol Escape Beginner Strategy" })).toHaveAttribute("href", "/guides/patrol-escape-beginner-strategy");
    expect(screen.getByRole("link", { name: "Traffic Puzzle Games" })).toHaveAttribute("href", "/traffic-puzzle-games");
    cleanup();
  });
});
