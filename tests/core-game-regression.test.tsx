// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { MemoryMosaicGame } from "@/components/games/memory-mosaic-game";
import { MergeShot2048Game } from "@/components/games/merge-shot-2048-game";
import { NeonSnakeGame } from "@/components/games/neon-snake-game";
import { NumberRushGame } from "@/components/games/number-rush-game";
import { PatrolEscapeGame } from "@/components/games/patrol-escape-game";
import { PatternPulseGame } from "@/components/games/pattern-pulse-game";
import { TargetBlitzGame } from "@/components/games/target-blitz-game";
import { TileMerge2048Game } from "@/components/games/tile-merge-2048-game";

afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
});

describe("core game start, completion, and replay regression", () => {
  it("solves and restarts Patrol Escape level one", () => {
    render(<PatrolEscapeGame />);

    fireEvent.click(screen.getByLabelText("Blue gate van"));
    fireEvent.keyDown(window, { key: "ArrowUp" });
    fireEvent.click(screen.getByLabelText("Police escape car"));
    for (let step = 0; step < 4; step += 1) {
      fireEvent.keyDown(window, { key: "ArrowRight" });
    }

    expect(screen.getByText("Exit cleared!")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Restart" }));
    expect(screen.queryByText("Exit cleared!")).not.toBeInTheDocument();
  });

  it("restarts Merge Shot 2048 from a completed stack", async () => {
    window.history.replaceState({}, "", "/games/merge-shot-2048?screenshot=lost");
    render(<MergeShot2048Game />);

    const replay = await screen.findByRole("button", { name: "Play again" });
    fireEvent.click(replay);

    expect(screen.queryByRole("button", { name: "Play again" })).not.toBeInTheDocument();
    expect(screen.getByText("Cannon armed. Pick a lane and fire.")).toBeInTheDocument();
  });

  it("clears and replays Number Rush", async () => {
    window.history.replaceState({}, "", "/games/number-rush?screenshot=success");
    render(<NumberRushGame />);

    const replay = await screen.findByRole("button", { name: "Play again" });
    fireEvent.click(replay);

    expect(screen.queryByRole("button", { name: "Play again" })).not.toBeInTheDocument();
    expect(screen.getByText("Next 1 · Mistakes 0 · Cleared 1")).toBeInTheDocument();
  });

  it("restarts Target Blitz after the timer ends", async () => {
    window.history.replaceState({}, "", "/games/target-blitz?screenshot=lost");
    render(<TargetBlitzGame />);

    const replay = await screen.findByRole("button", { name: "Play again" });
    fireEvent.click(replay);

    expect(screen.queryByRole("button", { name: "Play again" })).not.toBeInTheDocument();
    expect(screen.getByText("Time 20s · Score 0 · Best 12")).toBeInTheDocument();
  });

  it("reshuffles Memory Mosaic after a cleared board", async () => {
    window.history.replaceState({}, "", "/games/memory-mosaic?screenshot=success");
    render(<MemoryMosaicGame />);

    await waitFor(() => expect(screen.getByText(/Board clear in 9 moves/)).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Shuffle board" }));

    expect(screen.getByText("Moves: 0")).toBeInTheDocument();
    expect(screen.getByText(/Flip two tiles at a time/)).toBeInTheDocument();
  });

  it("restarts Pattern Pulse after a wrong pad", async () => {
    window.history.replaceState({}, "", "/games/pattern-pulse?screenshot=lost");
    render(<PatternPulseGame />);

    await waitFor(() => expect(screen.getByText(/Wrong pad/)).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Restart" }));

    await waitFor(() => expect(screen.getByText(/Memorize the order/)).toBeInTheDocument());
  });

  it("restarts 2048 after no legal moves remain", async () => {
    window.history.replaceState({}, "", "/games/2048?screenshot=lost");
    render(<TileMerge2048Game />);

    const replay = await screen.findByRole("button", { name: "Play again" });
    fireEvent.click(replay);

    expect(screen.queryByRole("button", { name: "Play again" })).not.toBeInTheDocument();
    expect(screen.getByText(/Score 0 · Best/)).toBeInTheDocument();
  });

  it("restarts Snake after a collision", async () => {
    window.history.replaceState({}, "", "/games/snake?screenshot=lost");
    render(<NeonSnakeGame />);

    const replay = await screen.findByRole("button", { name: "Play again" });
    fireEvent.click(replay);

    expect(screen.queryByRole("button", { name: "Play again" })).not.toBeInTheDocument();
    expect(screen.getByText("Choose a direction to start.")).toBeInTheDocument();
  });
});
