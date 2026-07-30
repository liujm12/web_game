// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { NeonSnakeGame } from "@/components/games/neon-snake-game";
import { BreakoutBlitzGame } from "@/components/games/breakout-blitz-game";
import { TileMerge2048Game } from "@/components/games/tile-merge-2048-game";

describe("arcade sizing upgrades", () => {
  afterEach(() => {
    cleanup();
  });

  it("gives snake a larger board than the old tiny 8x8 layout", () => {
    const { container } = render(<NeonSnakeGame />);

    const cells = container.querySelectorAll('[data-snake-cell="true"]');
    expect(cells.length).toBeGreaterThan(100);
  });

  it("renders breakout as a wide arcade field with a visible ball", () => {
    const { container } = render(<BreakoutBlitzGame />);

    expect(screen.getByText("Brick breaker")).toBeInTheDocument();
    expect(container.querySelector('[data-breakout-field="true"]')).toBeTruthy();
    expect(container.querySelector('[data-breakout-ball="true"]')).toBeTruthy();
  });

  it("lets desktop players launch and move the breakout paddle from the keyboard", () => {
    const { container } = render(<BreakoutBlitzGame />);

    fireEvent.keyDown(window, { key: " " });
    expect(screen.queryByRole("button", { name: "Launch ball" })).not.toBeInTheDocument();

    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(container.querySelector('[data-breakout-paddle="true"]')).toHaveStyle({
      left: "33%",
    });

    fireEvent.keyDown(window, { key: "d" });
    expect(container.querySelector('[data-breakout-paddle="true"]')).toHaveStyle({
      left: "41%",
    });
  });

  it("places paddle controls after the breakout field for mobile play", () => {
    const { container } = render(<BreakoutBlitzGame />);

    const paddleLeftButton = screen.getByRole("button", { name: "Paddle left" });
    const playfield = container.querySelector('[data-breakout-field="true"]');

    expect(playfield).toBeTruthy();
    expect(
      Boolean(
        playfield!.compareDocumentPosition(paddleLeftButton) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ),
    ).toBe(true);
  });

  it("keeps snake direction controls directly after the board", () => {
    const { container } = render(<NeonSnakeGame />);

    const board = container.querySelector('[data-snake-board="true"]');
    const upButton = screen.getByRole("button", { name: "Up" });
    const statusText = screen.getByText("Score 0 · Balanced");

    expect(board).toBeTruthy();
    expect(
      Boolean(board!.compareDocumentPosition(upButton) & Node.DOCUMENT_POSITION_FOLLOWING),
    ).toBe(true);
    expect(
      Boolean(upButton.compareDocumentPosition(statusText) & Node.DOCUMENT_POSITION_PRECEDING),
    ).toBe(true);
  });

  it("keeps 2048 direction controls directly after the board", () => {
    const { container } = render(<TileMerge2048Game />);

    const board = container.querySelector('[data-tile-2048-board="true"]');
    const leftButton = screen.getByRole("button", { name: "Left" });
    const statusText = screen.getByText("Score 0 · Best 0");

    expect(board).toBeTruthy();
    expect(
      Boolean(board!.compareDocumentPosition(leftButton) & Node.DOCUMENT_POSITION_FOLLOWING),
    ).toBe(true);
    expect(
      Boolean(leftButton.compareDocumentPosition(statusText) & Node.DOCUMENT_POSITION_PRECEDING),
    ).toBe(true);
  });
});
