// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { GamePlayer } from "@/components/game-player";

afterEach(() => {
  cleanup();
});

describe("merge shot 2048 game", () => {
  it("registers a playable merge shooter with start controls and previews", () => {
    render(<GamePlayer componentKey="merge-shot-2048" />);

    expect(screen.getByRole("heading", { name: "Merge Shot 2048" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start Shot" })).toBeInTheDocument();
    expect(screen.getByText(/Current 2 · Next 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Arrow keys or A\/D to aim/i)).toBeInTheDocument();
  });

  it("moves the cannon with desktop keyboard controls", () => {
    render(<GamePlayer componentKey="merge-shot-2048" />);

    fireEvent.click(screen.getByRole("button", { name: "Start Shot" }));
    expect(screen.getByText(/Lane 3/)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByText(/Lane 4/)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "a" });
    expect(screen.getByText(/Lane 3/)).toBeInTheDocument();
  });

  it("shoots a tile with Space and gives board feedback", () => {
    render(<GamePlayer componentKey="merge-shot-2048" />);

    fireEvent.click(screen.getByRole("button", { name: "Start Shot" }));
    fireEvent.keyDown(window, { key: " " });

    const board = screen.getByLabelText("Merge Shot 2048 board");
    expect(within(board).getAllByText("2").length).toBeGreaterThan(0);
    expect(screen.getByText(/Nice shot/i)).toBeInTheDocument();
  });

  it("places touch controls directly after the board for mobile play", () => {
    render(<GamePlayer componentKey="merge-shot-2048" />);

    const fireButton = screen.getByRole("button", { name: "Fire" });
    const board = screen.getByLabelText("Merge Shot 2048 board");
    const statusText = screen.getByText("Score 0 · Lane 3 · Best 2 · Combo ready");

    expect(
      Boolean(statusText.compareDocumentPosition(board) & Node.DOCUMENT_POSITION_FOLLOWING),
    ).toBe(true);
    expect(
      Boolean(board.compareDocumentPosition(fireButton) & Node.DOCUMENT_POSITION_FOLLOWING),
    ).toBe(true);
  });
});
