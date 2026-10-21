// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { GamePlayer } from "@/components/game-player";

describe("Patrol Escape game", () => {
  afterEach(() => cleanup());

  it("renders the original sliding-car puzzle through the game registry", () => {
    render(<GamePlayer componentKey="patrol-escape" />);

    expect(screen.getByRole("heading", { name: "Patrol Escape" })).toBeInTheDocument();
    expect(screen.getByText(/Level 1 of 120/)).toBeInTheDocument();
    expect(screen.getByLabelText("Police escape car")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Undo move" })).toBeDisabled();
  });

  it("supports keyboard movement and completes the first level", () => {
    render(<GamePlayer componentKey="patrol-escape" />);

    const gateVan = screen.getByLabelText("Blue gate van");
    fireEvent.click(gateVan);
    fireEvent.keyDown(window, { key: "ArrowUp" });

    const police = screen.getByLabelText("Police escape car");
    fireEvent.click(police);
    for (let step = 0; step < 4; step += 1) {
      fireEvent.keyDown(window, { key: "ArrowRight" });
    }

    expect(screen.getByText("Exit cleared!")).toBeInTheDocument();
    expect(screen.getByText("5 moves")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next level" })).toBeInTheDocument();
  });

  it("opens a mobile-friendly level picker and jumps to any level", () => {
    render(<GamePlayer componentKey="patrol-escape" />);

    fireEvent.click(screen.getByRole("button", { name: "Choose level" }));

    expect(screen.getByRole("dialog", { name: "Choose a Patrol Escape level" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show levels 61 to 80" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Show levels 61 to 80" }));
    fireEvent.click(screen.getByRole("button", { name: /Play level 73:/ }));

    expect(screen.getByText(/Level 73 of 120/)).toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "Choose a Patrol Escape level" })).not.toBeInTheDocument();
  });

  it("offers the Master range and opens a level above 100", () => {
    render(<GamePlayer componentKey="patrol-escape" />);

    fireEvent.click(screen.getByRole("button", { name: "Choose level" }));
    fireEvent.click(screen.getByRole("button", { name: "Show levels 101 to 120" }));
    fireEvent.click(screen.getByRole("button", { name: /Play level 113:/ }));

    expect(screen.getByText(/Level 113 of 120/)).toBeInTheDocument();
    expect(screen.getByText(/Master/)).toBeInTheDocument();
  });
});
