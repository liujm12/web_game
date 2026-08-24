// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { GameCard } from "@/components/game-card";
import type { GameRecord } from "@/lib/site-content";

afterEach(cleanup);

const game = {
  slug: "2048",
  title: "2048",
  category: "brain",
  summary: "Slide the board, merge matching tiles, and build your way up to 2048.",
  description: "A quick merge puzzle.",
  instructions: ["Move tiles", "Merge numbers"],
  tags: ["2048", "Merge", "Puzzle"],
  featured: true,
  trendingScore: 96,
  difficulty: "Easy",
  playersLabel: "Single player",
  status: "live",
  estimatedSession: "3 minutes",
  componentKey: "tile-merge-2048",
  heroGradient: "from-amber-300 via-orange-400 to-rose-500",
  seoTitle: "2048",
  seoDescription: "Play 2048 online.",
} satisfies GameRecord;

describe("GameCard visual specificity", () => {
  it("shows a game-specific preview and player-facing popularity label", () => {
    const { container } = render(<GameCard game={game} />);

    expect(container.querySelector('[data-game-preview="2048"]')).toBeTruthy();
    expect(screen.getByText("Popularity 96")).toBeInTheDocument();
    expect(screen.queryByText("Hot score 96")).not.toBeInTheDocument();
  });

  it("uses game-specific calls to action instead of repeated template copy", () => {
    render(<GameCard game={game} />);

    expect(screen.getByRole("link", { name: "Chase 2048" })).toBeInTheDocument();
    expect(screen.queryByText("Tap to play")).not.toBeInTheDocument();
    expect(screen.queryByText(/Best if you want/i)).not.toBeInTheDocument();
  });
});
