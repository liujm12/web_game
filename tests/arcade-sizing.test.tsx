// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NeonSnakeGame } from "@/components/games/neon-snake-game";
import { BreakoutBlitzGame } from "@/components/games/breakout-blitz-game";

describe("arcade sizing upgrades", () => {
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
});
