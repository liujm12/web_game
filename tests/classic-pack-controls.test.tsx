// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BlockDropGame, MinesweeperGame } from "@/components/games/classic-pack-games";

afterEach(cleanup);

describe("classic game controls", () => {
  it("keeps flagged mines protected when returning to reveal mode", () => {
    const { container } = render(<MinesweeperGame />);
    const cells = container.querySelectorAll(".grid-cols-8 button");
    fireEvent.click(screen.getByRole("button", { name: "Reveal mode" }));
    fireEvent.click(cells[2]);
    fireEvent.click(screen.getByRole("button", { name: "Flag mode on" }));
    fireEvent.click(cells[2]);
    expect(screen.queryByText(/Mine hit/)).not.toBeInTheDocument();
    expect(screen.getByText("1/10 flags")).toBeInTheDocument();
  });

  it("does not let players flag revealed cells", () => {
    const { container } = render(<MinesweeperGame />);
    const cells = container.querySelectorAll(".grid-cols-8 button");
    fireEvent.click(cells[1]);
    fireEvent.click(screen.getByRole("button", { name: "Reveal mode" }));
    fireEvent.click(cells[1]);
    expect(screen.getByText("0/10 flags")).toBeInTheDocument();
  });

  it("prevents arrow-key scrolling only during an active block game", () => {
    render(<BlockDropGame />);
    const idleEvent = new KeyboardEvent("keydown", { key: "ArrowDown", cancelable: true });
    fireEvent(window, idleEvent);
    expect(idleEvent.defaultPrevented).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Start blocks" }));
    const playingEvent = new KeyboardEvent("keydown", { key: "ArrowDown", cancelable: true });
    fireEvent(window, playingEvent);
    expect(playingEvent.defaultPrevented).toBe(true);
  });
});
