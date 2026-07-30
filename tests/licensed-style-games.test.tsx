// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GamePlayer } from "@/components/game-player";

describe("expanded game entries", () => {
  it("renders a playable 2048 game", () => {
    const view = render(<GamePlayer componentKey="tile-merge-2048" />);
    const scoped = within(view.container);

    fireEvent.click(scoped.getByRole("button", { name: "Hard" }));
    fireEvent.click(scoped.getByRole("button", { name: "Start 2048" }));

    expect(scoped.getByText(/Score 0 · Best/)).toBeInTheDocument();
    expect(scoped.getByText(/Mode Hard/)).toBeInTheDocument();
    expect(scoped.queryByText("Merge matching tiles and chase 2048.")).not.toBeInTheDocument();
    cleanup();
  });

  it("renders a playable snake game", () => {
    const view = render(<GamePlayer componentKey="neon-snake" />);
    const scoped = within(view.container);

    fireEvent.click(scoped.getByRole("button", { name: "Hard" }));
    fireEvent.click(scoped.getByRole("button", { name: "Start snake" }));

    expect(scoped.getByText("Choose a direction to start.")).toBeInTheDocument();
    expect(scoped.getByText("Score 0 · Fast")).toBeInTheDocument();
    expect(scoped.queryByText("Use the arrow buttons to guide the snake to fruit.")).not.toBeInTheDocument();
    cleanup();
  });

  it("renders a playable gomoku board on a standard grid", () => {
    const { container } = render(<GamePlayer componentKey="gomoku-board" />);
    const scoped = within(container);

    fireEvent.click(scoped.getByRole("button", { name: "New board" }));

    expect(scoped.getByText(/Turn:/)).toBeInTheDocument();
    expect(scoped.getByText("Turn: Black")).toBeInTheDocument();
    expect(container.querySelectorAll('[data-gomoku-cell="true"]').length).toBe(225);
    expect(scoped.queryByText("Place five stones in a row on a standard board.")).not.toBeInTheDocument();
    cleanup();
  });

  it("renders a playable breakout game", () => {
    const view = render(<GamePlayer componentKey="breakout-blitz" />);
    const scoped = within(view.container);

    fireEvent.click(scoped.getByRole("button", { name: "Hard" }));
    fireEvent.click(scoped.getByRole("button", { name: "Launch ball" }));

    expect(scoped.queryByRole("button", { name: "Launch ball" })).not.toBeInTheDocument();
    expect(scoped.getByText(/Score 0 · Lives 2/)).toBeInTheDocument();
    expect(scoped.queryByText("Break every brick and protect the paddle.")).not.toBeInTheDocument();
    cleanup();
  });
});
