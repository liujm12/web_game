// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ColorSortGame, MinesweeperGame, SudokuSprintGame } from "@/components/games/classic-logic";
import * as logic from "@/lib/games/classic-logic";

function randomSeed(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

beforeEach(() => {
  const records = new Map<string, string>();
  Object.defineProperty(window, "localStorage", { configurable: true, value: {
    getItem: (key: string) => records.get(key) ?? null,
    setItem: (key: string, value: string) => records.set(key, value),
    removeItem: (key: string) => records.delete(key),
    clear: () => records.clear(),
    key: (index: number) => [...records.keys()][index] ?? null,
    get length() { return records.size; },
  } });
});

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.useRealTimers(); });

describe("Minesweeper controls", () => {
  it("protects flags in reveal mode and supports right-click and fresh difficulty boards", () => {
    const { container } = render(<MinesweeperGame />);
    const cells = container.querySelectorAll<HTMLButtonElement>(".grid-cols-8 button");
    fireEvent.click(screen.getByRole("button", { name: "Reveal mode" }));
    fireEvent.click(cells[2]);
    fireEvent.click(screen.getByRole("button", { name: "Flag mode on" }));
    fireEvent.click(cells[2]);
    expect(screen.getByText("1/10 flags")).toBeInTheDocument();
    expect(cells[2]).toHaveAccessibleName(/flagged/);
    fireEvent.contextMenu(cells[2]);
    expect(screen.getByText("0/10 flags")).toBeInTheDocument();
    fireEvent.click(cells[0]);
    fireEvent.contextMenu(cells[0]);
    expect(screen.getByText("0/10 flags")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Difficulty"), { target: { value: "hard" } });
    expect(container.querySelectorAll(".grid-cols-10 button")).toHaveLength(100);
    expect(screen.getByText("0/18 flags")).toBeInTheDocument();
  });

  it("saves actual winning time by difficulty and resets the timer", () => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockImplementation(randomSeed(51));
    const expected = logic.revealMine(logic.createMineBoard("easy"), 0, randomSeed(51));
    const { container } = render(<MinesweeperGame />);
    const cells = container.querySelectorAll<HTMLButtonElement>(".grid-cols-8 button");
    fireEvent.click(cells[0]);
    act(() => vi.advanceTimersByTime(7000));
    expected.mines.forEach((mine, index) => { if (!mine) fireEvent.click(cells[index]); });
    expect(screen.getByText("Minefield cleared!")).toBeInTheDocument();
    expect(window.localStorage.getItem("playroom:mine-time:v1:easy")).toBe("7");
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.getByText("Best 0:07")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Difficulty"), { target: { value: "normal" } });
    expect(screen.getByText("Best —")).toBeInTheDocument();
    expect(screen.getByText("0:00")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Difficulty"), { target: { value: "easy" } });
    expect(screen.getByText("Best 0:07")).toBeInTheDocument();
  });

  it("remains playable when browser storage is unavailable", () => {
    Object.defineProperty(window, "localStorage", { configurable: true, get() { throw new Error("blocked"); } });
    render(<MinesweeperGame />);
    expect(screen.getByText("Best —")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "New board" }));
    expect(screen.getByText("0/10 flags")).toBeInTheDocument();
  });
});

describe("Sudoku controls", () => {
  it("leaves browser modifier shortcuts alone", () => {
    const generated = logic.generateSudoku("easy", randomSeed(14));
    vi.spyOn(logic, "generateSudoku").mockReturnValue(generated);
    const { container } = render(<SudokuSprintGame />);
    fireEvent.click(screen.getByRole("button", { name: "Start Sudoku" }));
    const index = generated.puzzle.indexOf(0);
    const cell = container.querySelector<HTMLButtonElement>(`[data-sudoku-cell="${index}"]`)!;
    const event = new KeyboardEvent("keydown", { key: "1", ctrlKey: true, bubbles: true, cancelable: true });
    fireEvent(cell, event);
    expect(event.defaultPrevented).toBe(false);
    expect(cell).toHaveAccessibleName(/empty/);
  });

  it("supports pencil notes, number entry, erase, undo, hints and arrow navigation", () => {
    const generated = logic.generateSudoku("easy", randomSeed(14));
    vi.spyOn(logic, "generateSudoku").mockReturnValue(generated);
    const { container } = render(<SudokuSprintGame />);
    fireEvent.click(screen.getByRole("button", { name: "Start Sudoku" }));
    const index = generated.puzzle.indexOf(0);
    const cell = container.querySelector<HTMLButtonElement>(`[data-sudoku-cell="${index}"]`)!;
    fireEvent.click(cell);
    fireEvent.keyDown(cell, { key: "n" });
    fireEvent.keyDown(cell, { key: "3" });
    expect(cell).toHaveAccessibleName(/notes 3/);
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(cell).not.toHaveAccessibleName(/notes/);
    fireEvent.click(screen.getByRole("button", { name: "Notes" }));
    fireEvent.keyDown(cell, { key: String(generated.solution[index]) });
    expect(cell).toHaveTextContent(String(generated.solution[index]));
    fireEvent.keyDown(cell, { key: "Delete" });
    expect(cell).toHaveAccessibleName(/empty/);
    fireEvent.click(screen.getByRole("button", { name: "Hint" }));
    expect(screen.getByText("Hints 1")).toBeInTheDocument();
    expect(cell).toHaveTextContent(String(generated.solution[index]));
    fireEvent.keyDown(cell, { key: "z", ctrlKey: true });
    expect(cell).toHaveAccessibleName(/empty/);
    expect(screen.getByText("Hints 1")).toBeInTheDocument();
    fireEvent.keyDown(cell, { key: "ArrowRight" });
    expect(container.querySelector(`[data-sudoku-cell="${Math.min(80, index + 1)}"]`)).toHaveFocus();
  });

  it("protects givens and only completes a fully valid grid", () => {
    const generated = logic.generateSudoku("easy", randomSeed(33));
    vi.spyOn(logic, "generateSudoku").mockReturnValue(generated);
    const { container } = render(<SudokuSprintGame />);
    fireEvent.click(screen.getByRole("button", { name: "Start Sudoku" }));
    const fixed = generated.puzzle.findIndex(Boolean);
    const fixedCell = container.querySelector<HTMLButtonElement>(`[data-sudoku-cell="${fixed}"]`)!;
    fireEvent.click(fixedCell);
    fireEvent.keyDown(fixedCell, { key: "Delete" });
    expect(fixedCell).toHaveTextContent(String(generated.puzzle[fixed]));
    const empty = generated.puzzle.map((value, index) => value ? -1 : index).filter((index) => index >= 0);
    for (const index of empty) {
      const cell = container.querySelector<HTMLButtonElement>(`[data-sudoku-cell="${index}"]`)!;
      fireEvent.click(cell);
      fireEvent.keyDown(cell, { key: String(index === empty.at(-1) ? generated.solution[index] % 9 + 1 : generated.solution[index]) });
    }
    expect(screen.queryByText("Puzzle solved!")).not.toBeInTheDocument();
    const last = empty.at(-1)!;
    fireEvent.keyDown(container.querySelector(`[data-sudoku-cell="${last}"]`)!, { key: String(generated.solution[last]) });
    expect(screen.getByText("Puzzle solved!")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next puzzle" }));
    expect(screen.queryByText("Puzzle solved!")).not.toBeInTheDocument();
    expect(screen.getByText("Hints 0")).toBeInTheDocument();
  });
});

it("keeps initial renders deterministic for hydration", () => {
  const random = vi.spyOn(Math, "random");
  render(<><MinesweeperGame /><SudokuSprintGame /><ColorSortGame /></>);
  expect(random).not.toHaveBeenCalled();
});

describe("Color Sort controls", () => {
  it("reports invalid pours, supports undo/reset and advances only after a real win", () => {
    const generated = logic.generateColorLevel(1, randomSeed(99));
    vi.spyOn(logic, "generateColorLevel").mockReturnValue(generated);
    render(<ColorSortGame />);
    fireEvent.click(screen.getByRole("button", { name: "Start sorting" }));
    const tube = (index: number) => screen.getByRole("button", { name: new RegExp(`^Tube ${index + 1},`) });
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    let invalid: [number, number] | null = null;
    generated.tubes.forEach((source, from) => generated.tubes.forEach((_, to) => {
      if (source.length && from !== to && !logic.pourColor(generated.tubes, from, to)) invalid = [from, to];
    }));
    expect(invalid).not.toBeNull();
    const [invalidFrom, invalidTo] = invalid!;
    fireEvent.click(tube(invalidFrom)); fireEvent.click(tube(invalidTo));
    expect(screen.getByRole("status")).toHaveTextContent(/full|must match/);
    expect(screen.getByText("Moves 0")).toBeInTheDocument();
    fireEvent.click(tube(invalidFrom));
    const [firstFrom, firstTo] = generated.solution[0];
    const original = tube(firstFrom).getAttribute("aria-label");
    fireEvent.click(tube(firstFrom)); fireEvent.click(tube(firstTo));
    expect(screen.getByText("Moves 1")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(tube(firstFrom)).toHaveAttribute("aria-label", original);
    fireEvent.click(tube(firstFrom)); fireEvent.click(tube(firstTo));
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(tube(firstFrom)).toHaveAttribute("aria-label", original);
    expect(screen.getByText("Moves 0")).toBeInTheDocument();
    for (const [from, to] of generated.solution) { fireEvent.click(tube(from)); fireEvent.click(tube(to)); }
    expect(screen.getByText("Perfectly sorted!")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next level" }));
    expect(screen.getByText("Level 2")).toBeInTheDocument();
    expect(screen.queryByText("Perfectly sorted!")).not.toBeInTheDocument();
  });
});
