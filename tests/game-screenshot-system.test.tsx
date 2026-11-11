// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { existsSync, statSync } from "node:fs";
import path from "node:path";

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import GamePage from "@/app/games/[slug]/page";
import { NeonSnakeGame } from "@/components/games/neon-snake-game";
import { PatrolEscapeGame } from "@/components/games/patrol-escape-game";
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
  });

  it("publishes meaningful optimized evidence galleries on core game pages", async () => {
    const expectations = [
      { slug: "patrol-escape", heading: "Patrol Escape gameplay evidence", minimum: 8 },
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
    const minimumCounts = { "patrol-escape": 8, "2048": 6, snake: 6 } as const;

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
});
