// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as engine from "@/lib/games/classic-words";
import { HangmanGame, WordHuntGame } from "@/components/games/classic-words";

beforeEach(() => {
  const saved = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => saved.get(key) ?? null,
    setItem: (key: string, value: string) => saved.set(key, value),
    clear: () => saved.clear(),
  });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("word game interaction", () => {
  it("accepts keyboard letters and saves a completed streak", () => {
    vi.spyOn(engine, "chooseHangmanWord").mockReturnValue({ word: "PEPPER", clue: "A common seasoning" });
    render(<HangmanGame />);
    fireEvent.click(screen.getByRole("button", { name: "Start guessing" }));
    for (const key of ["p", "e", "r"]) fireEvent.keyDown(window, { key });
    expect(screen.getByText(/Word solved in/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guess A" })).toBeDisabled();
    expect(window.localStorage.getItem("turbo-best:hangman-streak")).toBe("1");
    fireEvent.click(screen.getByRole("button", { name: "Next word" }));
    expect(screen.getByRole("button", { name: "Guess P" })).toBeEnabled();
  });

  it("finishes a word search using endpoints and starts a fresh board", () => {
    const puzzle = engine.createWordSearch("Nature", () => 0.4);
    vi.spyOn(engine, "createWordSearch").mockReturnValue(puzzle);
    render(<WordHuntGame />);
    fireEvent.click(screen.getByRole("button", { name: "Start word hunt" }));
    const cells = within(screen.getByRole("group", { name: "Word search board" })).getAllByRole("button");
    for (const word of puzzle.words) {
      const path = puzzle.paths[word];
      fireEvent.click(cells[path[0]]);
      fireEvent.click(cells[path.at(-1)!]);
    }
    expect(screen.getByText("Board complete")).toBeInTheDocument();
    expect(Number(window.localStorage.getItem("turbo-best:word-hunt"))).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "Next puzzle" }));
    expect(screen.queryByText("Board complete")).not.toBeInTheDocument();
    expect(screen.getByText(/0\/6 found/)).toBeInTheDocument();
  });

  it("limits hints and reports an invalid line without awarding points", () => {
    render(<WordHuntGame />);
    fireEvent.click(screen.getByRole("button", { name: "Start word hunt" }));
    const cells = within(screen.getByRole("group", { name: "Word search board" })).getAllByRole("button");
    fireEvent.click(cells[0]);
    fireEvent.click(cells[10]);
    expect(screen.getByRole("status")).toHaveTextContent("No target word");
    for (const remaining of [3, 2, 1]) fireEvent.click(screen.getByRole("button", { name: "Hint " + remaining }));
    expect(screen.getByRole("button", { name: "Hint 0" })).toBeDisabled();
  });
});
