// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, act } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import { CheckersLiteGame } from "@/components/games/classic-checkers";
import { describe, expect, it } from "vitest";
import { applyMove, chooseComputerMove, createCheckers, legalMoves, type Board, type Side } from "@/lib/games/classic-checkers";

function position(entries: [number, Side, boolean?][], turn: Side = "orange") {
  const board: Board = Array(64).fill(null);
  for (const [square, side, king] of entries) board[square] = { side, king: Boolean(king) };
  return createCheckers(board, turn);
}

describe("American checkers", () => {
  it("starts with 12 pieces each and orange moves first", () => {
    const state = createCheckers();
    expect(state.board.filter(piece => piece?.side === "orange")).toHaveLength(12);
    expect(state.board.filter(piece => piece?.side === "cyan")).toHaveLength(12);
    expect(legalMoves(state)).toHaveLength(7);
    const next = applyMove(state, legalMoves(state)[0]);
    expect(next.turn).toBe("cyan");
    expect(state.board).not.toEqual(next.board);
  });

  it("makes captures mandatory across all pieces and rejects illegal moves", () => {
    const state = position([[42, "orange"], [46, "orange"], [33, "cyan"], [1, "cyan"]]);
    expect(legalMoves(state)).toEqual([{ from: 42, to: 24, captured: 33 }]);
    expect(applyMove(state, { from: 46, to: 37 })).toBe(state);
  });

  it("forces the same piece to finish a multi-jump", () => {
    const state = position([[42, "orange"], [46, "orange"], [33, "cyan"], [17, "cyan"], [1, "cyan"]]);
    const first = applyMove(state, { from: 42, to: 24 });
    expect(first.turn).toBe("orange");
    expect(first.forced).toBe(24);
    expect(first.board[33]).toBeNull();
    expect(legalMoves(first)).toEqual([{ from: 24, to: 10, captured: 17 }]);
    const second = applyMove(first, { from: 24, to: 10 });
    expect(second.turn).toBe("cyan");
    expect(second.forced).toBeNull();
  });

  it("crowns a man and ends the turn even when a backward capture exists", () => {
    const state = position([[17, "orange"], [10, "cyan"], [12, "cyan"]]);
    const next = applyMove(state, { from: 17, to: 3 });
    expect(next.board[3]).toEqual({ side: "orange", king: true });
    expect(next.turn).toBe("cyan");
    expect(next.forced).toBeNull();
  });

  it("allows backward king captures but not backward man captures", () => {
    const king = position([[26, "orange", true], [35, "cyan"], [1, "cyan"]]);
    expect(legalMoves(king)).toEqual([{ from: 26, to: 44, captured: 35 }]);
    const man = position([[26, "orange"], [35, "cyan"], [1, "cyan"]]);
    expect(legalMoves(man).every(move => move.to < move.from && move.captured === undefined)).toBe(true);
  });

  it("wins by elimination or by blocking every opposing move", () => {
    expect(applyMove(position([[42, "orange"], [33, "cyan"]]), { from: 42, to: 24 }).result).toBe("orange");
    expect(position([[1, "orange"], [62, "cyan"]], "cyan").result).toBe("orange");
  });

  it("draws after three repeated positions", () => {
    let state = position([[56, "orange", true], [7, "cyan", true]]);
    for (let cycle = 0; cycle < 2; cycle++) {
      for (const [from, to] of [[56, 49], [7, 14], [49, 56], [14, 7]]) state = applyMove(state, { from, to });
    }
    expect(state.result).toBe("draw");
    expect(state.drawReason).toBe("Threefold repetition");
  });

  it("draws after 80 quiet half-turns and resets the clock on captures", () => {
    const state = { ...position([[56, "orange", true], [7, "cyan", true]]), quietTurns: 79 };
    expect(applyMove(state, { from: 56, to: 49 }).result).toBe("draw");
    const capture = { ...position([[42, "orange"], [33, "cyan"], [1, "cyan"]]), quietTurns: 79 };
    expect(applyMove(capture, { from: 42, to: 24 }).quietTurns).toBe(0);
  });

  it.each(["easy", "normal", "hard"] as const)("%s AI is deterministic, legal, and completes forced chains", difficulty => {
    let state = position([[21, "cyan"], [30, "orange"], [46, "orange"], [62, "orange"]], "cyan");
    const chosen = chooseComputerMove(state, difficulty);
    expect(chosen).toEqual(chooseComputerMove(state, difficulty));
    expect(chosen).toEqual({ from: 21, to: 39, captured: 30 });
    state = applyMove(state, chosen!);
    expect(state.forced).toBe(39);
    const continuation = chooseComputerMove(state, difficulty);
    expect(continuation).toEqual({ from: 39, to: 53, captured: 46 });
    expect(applyMove(state, continuation!).turn).toBe("orange");
  });

  it("hard AI avoids offering its last piece to a capture", () => {
    const state = position([[42, "orange"], [24, "cyan"]]);
    const unsafe = applyMove(state, { from: 42, to: 33 });
    expect(applyMove(unsafe, legalMoves(unsafe)[0]).result).toBe("cyan");
    const move = chooseComputerMove(state, "hard");
    expect(move).toEqual({ from: 42, to: 35 });
    expect(chooseComputerMove(position([[1, "orange"]], "cyan"), "hard")).toBeNull();
  });

  it("plays complete deterministic AI games without an illegal or stalled turn", () => {
    let state = createCheckers();
    for (let step = 0; step < 350 && !state.result; step++) {
      const move = chooseComputerMove(state, "normal");
      expect(move).not.toBeNull();
      expect(legalMoves(state)).toContainEqual(move);
      const next = applyMove(state, move!);
      expect(next).not.toBe(state);
      state = next;
    }
    expect(state.result).not.toBeNull();
  });

  it("offers either capture branch rather than imposing a longest-jump rule", () => {
    const state = position([[42, "orange"], [33, "cyan"], [35, "cyan"], [17, "cyan"]]);
    expect(legalMoves(state)).toEqual([{ from: 42, to: 24, captured: 33 }, { from: 42, to: 28, captured: 35 }]);
    expect(applyMove(state, { from: 42, to: 28 }).turn).toBe("cyan");
  });

  it("crowns cyan at the opposite edge and kings step backward without wrapping", () => {
    const crowned = applyMove(position([[49, "cyan"], [1, "orange", true]], "cyan"), { from: 49, to: 56 });
    expect(crowned.board[56]).toEqual({ side: "cyan", king: true });
    const cornerKing = position([[56, "orange", true], [7, "cyan", true]]);
    expect(legalMoves(cornerKing)).toEqual([{ from: 56, to: 49 }]);
    const centralKing = position([[26, "orange", true], [7, "cyan", true]]);
    expect(legalMoves(centralKing).map(move => move.to)).toEqual([17, 19, 33, 35]);
  });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("checkers controls", () => {
  it("starts with an overlay and lets the computer respond to a legal move", () => {
    vi.useFakeTimers();
    render(<CheckersLiteGame />);
    expect(screen.getByRole("button", { name: "Start checkers" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Start checkers" }));
    fireEvent.click(screen.getByRole("button", { name: /a3, orange man/ }));
    expect(screen.getByRole("button", { name: /b4, empty, legal destination/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /b4, empty, legal destination/ }));
    expect(screen.getByRole("status")).toHaveTextContent("Computer thinking");
    act(() => { vi.advanceTimersByTime(300); });
    expect(screen.getByRole("status")).toHaveTextContent("Orange to move");
  });

  it("supports two local players and keeps controls below the board", () => {
    render(<CheckersLiteGame />);
    fireEvent.change(screen.getByLabelText("Opponent"), { target: { value: "local" } });
    expect(screen.getByLabelText("Difficulty")).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Start checkers" }));
    fireEvent.click(screen.getByRole("button", { name: /a3, orange man/ }));
    fireEvent.click(screen.getByRole("button", { name: /b4, empty, legal destination/ }));
    expect(screen.getByRole("status")).toHaveTextContent("Cyan to move");
    fireEvent.click(screen.getByRole("button", { name: /b6, cyan man/ }));
    fireEvent.click(screen.getByRole("button", { name: /a5, empty, legal destination/ }));
    expect(screen.getByRole("status")).toHaveTextContent("Orange to move");
    expect(screen.getByRole("group", { name: "Checkers board" }).compareDocumentPosition(screen.getByLabelText("Opponent")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("reset cancels a pending computer move and restores the start overlay", () => {
    vi.useFakeTimers();
    render(<CheckersLiteGame />);
    fireEvent.click(screen.getByRole("button", { name: "Start checkers" }));
    fireEvent.click(screen.getByRole("button", { name: /a3, orange man/ }));
    fireEvent.click(screen.getByRole("button", { name: /b4, empty, legal destination/ }));
    fireEvent.click(screen.getByRole("button", { name: "Reset board" }));
    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByRole("button", { name: "Start checkers" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Orange moves first");
    expect(screen.getByRole("button", { name: /a3, orange man/ })).toBeDisabled();
  });
});
