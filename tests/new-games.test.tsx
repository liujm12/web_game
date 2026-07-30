// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GamePlayer } from "@/components/game-player";

describe("new game entries", () => {
  it("renders a playable Target Blitz game", () => {
    render(<GamePlayer componentKey="target-blitz" />);

    fireEvent.click(screen.getByRole("button", { name: "Start challenge" }));

    expect(screen.getByText(/Time 20s · Score 0 · Best 0/)).toBeInTheDocument();
    expect(screen.queryByText("Tap the glowing target as fast as you can.")).not.toBeInTheDocument();
  });

  it("renders a playable Number Rush game", () => {
    render(<GamePlayer componentKey="number-rush" />);

    fireEvent.click(screen.getByRole("button", { name: "Start round" }));

    expect(screen.getByText(/Next 1 · Mistakes 0 · Cleared 0/)).toBeInTheDocument();
    expect(screen.queryByText("Tap numbers from low to high as quickly as you can.")).not.toBeInTheDocument();
  });
});
