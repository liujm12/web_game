// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { PlayerDashboard } from "@/components/player-dashboard";
import type { GameRecord } from "@/lib/site-content";

const games = [
  {
    slug: "2048",
    title: "2048",
    category: "brain",
    summary: "Merge matching tiles.",
    description: "A tile puzzle.",
    instructions: ["Move tiles"],
    tags: ["Puzzle"],
    featured: true,
    trendingScore: 10,
    difficulty: "Easy",
    playersLabel: "Single player",
    status: "live",
    estimatedSession: "3 minutes",
    componentKey: "tile-merge-2048",
    heroGradient: "from-amber-400 to-orange-500",
    seoTitle: "2048",
    seoDescription: "Play 2048.",
  },
  {
    slug: "snake",
    title: "Snake",
    category: "arcade",
    summary: "Grow the snake.",
    description: "A reflex game.",
    instructions: ["Turn"],
    tags: ["Arcade"],
    featured: true,
    trendingScore: 9,
    difficulty: "Easy",
    playersLabel: "Single player",
    status: "live",
    estimatedSession: "2 minutes",
    componentKey: "neon-snake",
    heroGradient: "from-lime-400 to-emerald-600",
    seoTitle: "Snake",
    seoDescription: "Play Snake.",
  },
] satisfies GameRecord[];

describe("PlayerDashboard", () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    const values = new Map<string, string>();

    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        clear: () => values.clear(),
        getItem: (key: string) => values.get(key) ?? null,
        removeItem: (key: string) => values.delete(key),
        setItem: (key: string, value: string) => values.set(key, value),
      },
    });
  });

  it("shows a daily challenge and an empty-state library", async () => {
    render(<PlayerDashboard games={games} />);

    expect(await screen.findByText("Daily challenge")).toBeInTheDocument();
    expect(screen.getByText("Your games, on this device")).toBeInTheDocument();
    expect(screen.getByText("Play a game to build your recent list.")).toBeInTheDocument();
  });

  it("shows saved favorites, recent games, and personal bests", async () => {
    window.localStorage.setItem(
      "turboarcade-player-v1",
      JSON.stringify({
        favorites: ["snake"],
        recent: [{ slug: "2048", playedAt: Date.now() }],
        bestScores: {
          snake: { score: 40, label: "40 points", updatedAt: Date.now() },
        },
      }),
    );

    render(<PlayerDashboard games={games} />);

    await waitFor(() => {
      expect(screen.getByText("Saved games")).toBeInTheDocument();
    });
    expect(screen.getByText("Recently played")).toBeInTheDocument();
    expect(screen.getByText("Personal bests")).toBeInTheDocument();
    expect(screen.getByText("40 points")).toBeInTheDocument();
  });
});
