// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { existsSync, statSync } from "node:fs";
import path from "node:path";

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import GamePage from "@/app/games/[slug]/page";
import { MemoryMosaicGame } from "@/components/games/memory-mosaic-game";
import { MergeShot2048Game } from "@/components/games/merge-shot-2048-game";
import { NeonSnakeGame } from "@/components/games/neon-snake-game";
import { NumberRushGame } from "@/components/games/number-rush-game";
import { PatrolEscapeGame } from "@/components/games/patrol-escape-game";
import { PatternPulseGame } from "@/components/games/pattern-pulse-game";
import { TargetBlitzGame } from "@/components/games/target-blitz-game";
import { TileMerge2048Game } from "@/components/games/tile-merge-2048-game";
import { guides } from "@/data/guides";
import { gameScreenshotSets } from "@/data/game-screenshots";

describe("real gameplay screenshot system", () => {
  afterEach(() => {
    cleanup();
    window.history.replaceState({}, "", "/");
  });

  it("replays stable real-game states for browser capture", async () => {
    window.history.replaceState({}, "", "/games/patrol-escape?screenshot=recovery");
    render(<PatrolEscapeGame />);
    await waitFor(() => expect(screen.getByText(/Level 101 of 120/)).toBeInTheDocument());
    expect(screen.getByText("2", { selector: "strong" })).toBeInTheDocument();
    cleanup();

    window.history.replaceState({}, "", "/games/2048?screenshot=lost");
    render(<TileMerge2048Game />);
    await waitFor(() => expect(screen.getByRole("heading", { name: "No moves left" })).toBeInTheDocument());
    cleanup();

    window.history.replaceState({}, "", "/games/snake?screenshot=success");
    render(<NeonSnakeGame />);
    await waitFor(() => expect(screen.getByText("Score 70 · Balanced")).toBeInTheDocument());
    cleanup();

    window.history.replaceState({}, "", "/games/merge-shot-2048?screenshot=success");
    render(<MergeShot2048Game />);
    await waitFor(() => expect(screen.getByText(/2048 reached/i)).toBeInTheDocument());
    cleanup();

    window.history.replaceState({}, "", "/games/number-rush?screenshot=progress");
    render(<NumberRushGame />);
    await waitFor(() => expect(screen.getByText(/Next 5 · Mistakes 1 · Cleared 0/)).toBeInTheDocument());
    cleanup();

    window.history.replaceState({}, "", "/games/target-blitz?screenshot=lost");
    render(<TargetBlitzGame />);
    await waitFor(() => expect(screen.getByText("4 hits")).toBeInTheDocument());
    cleanup();

    window.history.replaceState({}, "", "/games/memory-mosaic?screenshot=success");
    render(<MemoryMosaicGame />);
    await waitFor(() => expect(screen.getByText(/Board clear in 9 moves/)).toBeInTheDocument());
    cleanup();

    window.history.replaceState({}, "", "/games/pattern-pulse?screenshot=lost");
    render(<PatternPulseGame />);
    await waitFor(() => expect(screen.getByText(/Wrong pad/)).toBeInTheDocument());
  });

  it("publishes meaningful optimized evidence galleries on core game pages", async () => {
    const expectations = [
      { slug: "patrol-escape", heading: "Patrol Escape gameplay evidence", minimum: 8 },
      { slug: "merge-shot-2048", heading: "Merge Shot 2048 gameplay evidence", minimum: 4 },
      { slug: "number-rush", heading: "Number Rush gameplay evidence", minimum: 4 },
      { slug: "target-blitz", heading: "Target Blitz gameplay evidence", minimum: 4 },
      { slug: "memory-mosaic", heading: "Memory Mosaic gameplay evidence", minimum: 4 },
      { slug: "pattern-pulse", heading: "Pattern Pulse gameplay evidence", minimum: 4 },
      { slug: "2048", heading: "2048 gameplay evidence", minimum: 6 },
      { slug: "snake", heading: "Snake gameplay evidence", minimum: 6 },
    ];

    for (const expectation of expectations) {
      const view = render(await GamePage({ params: Promise.resolve({ slug: expectation.slug }) }));
      expect(screen.getByRole("heading", { name: expectation.heading })).toBeInTheDocument();
      const images = view.container.querySelectorAll(`img[src*="/images/gameplay/${expectation.slug}/"]`);
      expect(images.length).toBeGreaterThanOrEqual(expectation.minimum);
      for (const image of images) {
        expect(image.getAttribute("src")).toMatch(/\.webp$/);
        expect(image.getAttribute("alt")?.length).toBeGreaterThan(30);
      }
      expect(view.container.textContent).toContain("Captured from the playable game");
      expect(view.container.textContent).toContain("Desktop");
      expect(view.container.textContent).toContain("Mobile");
      cleanup();
    }
  });

  it("uses the eight real Patrol Escape captures in the how-to guide", () => {
    const guide = guides.find((candidate) => candidate.slug === "how-to-play-patrol-escape");
    expect(guide?.images).toHaveLength(8);
    for (const image of guide?.images ?? []) {
      expect(image.src).toMatch(/^\/images\/gameplay\/patrol-escape\/.+\.webp$/);
      expect(image.alt.length).toBeGreaterThan(30);
      expect(image.caption.length).toBeGreaterThan(45);
    }
  });

  it("keeps every real capture optimized, complete, and mobile-safe", () => {
    const minimumCounts = {
      "patrol-escape": 8,
      "merge-shot-2048": 4,
      "number-rush": 4,
      "target-blitz": 4,
      "memory-mosaic": 4,
      "pattern-pulse": 4,
      "2048": 6,
      snake: 6,
    } as const;

    for (const [slug, screenshots] of Object.entries(gameScreenshotSets)) {
      expect(screenshots.length).toBeGreaterThanOrEqual(minimumCounts[slug as keyof typeof minimumCounts]);
      expect(new Set(screenshots.map((image) => image.device))).toEqual(new Set(["Desktop", "Mobile"]));
      const capturedStates = new Set(screenshots.map((image) => image.state));
      for (const requiredState of ["start", "progress", "success", "failure"] as const) {
        expect(capturedStates.has(requiredState)).toBe(true);
      }

      for (const screenshot of screenshots) {
        const filePath = path.join(process.cwd(), "public", screenshot.src);
        expect(existsSync(filePath)).toBe(true);
        expect(screenshot.src).toMatch(/\.webp$/);
        expect(statSync(filePath).size).toBeLessThan(160_000);
        if (screenshot.device === "Mobile") expect(statSync(filePath).size).toBeLessThan(100_000);
      }
    }
  });

  it("links every A-tier game page to a guide and a relevant center page", async () => {
    const expectations = [
      ["patrol-escape", "Traffic Puzzle Games"],
      ["merge-shot-2048", "Brain Games"],
      ["number-rush", "Brain Games"],
      ["target-blitz", "Arcade Games"],
      ["memory-mosaic", "Brain Games"],
      ["pattern-pulse", "Brain Games"],
      ["2048", "Brain Games"],
      ["snake", "Arcade Games"],
    ] as const;

    for (const [slug, centerLabel] of expectations) {
      render(await GamePage({ params: Promise.resolve({ slug }) }));
      expect(screen.getByRole("link", { name: new RegExp(centerLabel, "i") })).toBeInTheDocument();
      expect(screen.getAllByRole("link", { name: /Read the .* guide/i }).length).toBeGreaterThanOrEqual(1);
      cleanup();
    }
  });
});
