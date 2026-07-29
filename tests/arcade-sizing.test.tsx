// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { NeonSnakeGame } from "@/components/games/neon-snake-game";
import { BreakoutBlitzGame } from "@/components/games/breakout-blitz-game";

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
    expect(screen.getByRole("button", { name: "Reset round" })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(container.querySelector('[data-breakout-paddle="true"]')).toHaveStyle({
      left: "33%",
    });

    fireEvent.keyDown(window, { key: "d" });
    expect(container.querySelector('[data-breakout-paddle="true"]')).toHaveStyle({
      left: "41%",
    });
  });
});
