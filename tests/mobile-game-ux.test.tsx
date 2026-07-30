// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BreakoutBlitzGame } from "@/components/games/breakout-blitz-game";
import { MergeShot2048Game } from "@/components/games/merge-shot-2048-game";
import { MeteorSprintGame } from "@/components/games/meteor-sprint-game";
import { NeonSnakeGame } from "@/components/games/neon-snake-game";
import { NumberRushGame } from "@/components/games/number-rush-game";
import { TargetBlitzGame } from "@/components/games/target-blitz-game";
import { TileMerge2048Game } from "@/components/games/tile-merge-2048-game";
import { GameCard } from "@/components/game-card";
import { SiteHeader } from "@/components/site-header";
import type { GameRecord } from "@/lib/site-content";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function appearsBefore(first: Element, second: Element) {
  return Boolean(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING);
}

describe("mobile game UX polish", () => {
  it("uses a compact non-sticky header on game pages", () => {
    render(<SiteHeader brandName="TurboArcade" compactGameHeader />);

    expect(screen.getByRole("banner")).not.toHaveClass("sticky");
    expect(screen.getByRole("banner")).toHaveClass("md:sticky");
    expect(screen.queryByLabelText("Mobile quick links")).not.toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "All Games" })[0]).toHaveAttribute(
      "href",
      "/games",
    );
  });

  it("keeps game card play buttons on one line", () => {
    const game: GameRecord = {
      slug: "comet-loop",
      title: "Comet Loop",
      category: "Arcade",
      categorySlug: "arcade",
      summary: "Tap at the right time.",
      description: "Tap at the right time.",
      heroGradient: "from-cyan-300 to-emerald-300",
      tags: ["Timing"],
      difficulty: "Easy",
      estimatedSession: "45 seconds",
      playersLabel: "Single player",
      trendingScore: "78",
      componentKey: "comet-loop",
      featured: false,
      seoTitle: "Comet Loop",
      seoDescription: "Play Comet Loop.",
      howToPlay: ["Tap"],
      contentSections: [],
    };

    render(<GameCard game={game} />);

    expect(screen.getByRole("link", { name: "Play" })).toHaveClass("whitespace-nowrap");
  });

  it("puts meteor lane controls after the field and restart actions inside the field", () => {
    const { container } = render(<MeteorSprintGame />);
    const field = container.querySelector('[data-meteor-field="true"]')!;

    expect(within(field).getByRole("button", { name: "Start run" })).toBeInTheDocument();
    expect(appearsBefore(field, screen.getByRole("button", { name: "Move left" }))).toBe(true);

    fireEvent.click(within(field).getByRole("button", { name: "Start run" }));
    expect(within(field).queryByRole("button", { name: "Start run" })).not.toBeInTheDocument();
  });

  it("puts breakout paddle controls after the field and launch actions inside the field", () => {
    const { container } = render(<BreakoutBlitzGame />);
    const field = container.querySelector('[data-breakout-field="true"]')!;

    expect(within(field).getByRole("button", { name: "Launch ball" })).toBeInTheDocument();
    expect(appearsBefore(field, screen.getByRole("button", { name: "Paddle left" }))).toBe(true);
  });

  it("lets snake wait for the first direction before it moves", () => {
    vi.useFakeTimers();
    const { container } = render(<NeonSnakeGame />);
    const board = container.querySelector('[data-snake-board="true"]')!;

    fireEvent.click(within(board).getByRole("button", { name: "Start snake" }));
    expect(within(board).getByText("Choose a direction to start.")).toBeInTheDocument();

    vi.advanceTimersByTime(700);
    expect(within(board).getByText("Choose a direction to start.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Right" }));
    expect(within(board).queryByText("Choose a direction to start.")).not.toBeInTheDocument();
  });

  it("keeps 2048 start controls inside the board", () => {
    const { container } = render(<TileMerge2048Game />);
    const board = container.querySelector('[data-tile-2048-board="true"]')!;

    expect(within(board).getByRole("button", { name: "Start 2048" })).toBeInTheDocument();
    expect(appearsBefore(board, screen.getByRole("button", { name: "Left" }))).toBe(true);
  });

  it("keeps merge shot start controls inside the board and fire controls below", () => {
    render(<MergeShot2048Game />);
    const board = screen.getByLabelText("Merge Shot 2048 board");

    expect(within(board).getByRole("button", { name: "Start Shot" })).toBeInTheDocument();
    expect(appearsBefore(board, screen.getByRole("button", { name: "Fire" }))).toBe(true);
  });

  it("shows compact number rush status without large stat cards", () => {
    const { container } = render(<NumberRushGame />);
    const board = container.querySelector('[data-number-rush-board="true"]')!;

    expect(screen.getByText("Next 1 · Mistakes 0 · Cleared 0")).toBeInTheDocument();
    expect(within(board).getByRole("button", { name: "Start round" })).toBeInTheDocument();
    expect(screen.queryByText("Mistakes: 0")).not.toBeInTheDocument();
    expect(screen.queryByText("Rounds cleared: 0")).not.toBeInTheDocument();
  });

  it("keeps number rush initial render deterministic for hydration", () => {
    const randomSpy = vi.spyOn(Math, "random");

    render(<NumberRushGame />);

    expect(randomSpy).not.toHaveBeenCalled();
    randomSpy.mockRestore();
  });

  it("shows compact target blitz score and best status", () => {
    const { container } = render(<TargetBlitzGame />);
    const field = container.querySelector('[data-target-blitz-field="true"]')!;

    expect(screen.getByText("Time 20s · Score 0 · Best 0")).toBeInTheDocument();
    expect(within(field).getByRole("button", { name: "Start challenge" })).toBeInTheDocument();
    expect(screen.queryByText("Score: 0")).not.toBeInTheDocument();
    expect(screen.queryByText("Best: 0")).not.toBeInTheDocument();
  });
});
