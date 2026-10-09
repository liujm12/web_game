import { describe, expect, it } from "vitest";
import { createWordSearch, findWordPath, wordThemes, chooseHangmanWord, hangmanRound } from "@/lib/games/classic-words";

describe("word game engines", () => {
  it("places every target on a straight contiguous path in every theme", () => {
    for (const theme of Object.keys(wordThemes)) {
      for (let round = 0; round < 12; round += 1) {
        const puzzle = createWordSearch(theme);
        expect(puzzle.cells).toHaveLength(64);
        for (const word of puzzle.words) {
          const path = puzzle.paths[word];
          expect(path.map((index) => puzzle.cells[index]).join("")).toBe(word);
          expect(findWordPath(puzzle, path[0], path.at(-1)!)).toEqual({ word, path });
          expect(findWordPath(puzzle, path.at(-1)!, path[0])?.word).toBe(word);
        }
      }
    }
  });

  it("rejects non-straight and incomplete selections", () => {
    const puzzle = createWordSearch("Nature");
    expect(findWordPath(puzzle, 0, 10)).toBeNull();
    expect(findWordPath(puzzle, 0, 0)).toBeNull();
  });

  it("selects a different hangman word and supplies a useful clue", () => {
    const first = chooseHangmanWord("Nature");
    for (let round = 0; round < 20; round += 1) {
      const next = chooseHangmanWord("Nature", first.word);
      expect(next.word).not.toBe(first.word);
      expect(next.clue.length).toBeGreaterThan(8);
    }
  });

  it("handles repeated letters, duplicate guesses and both terminal states", () => {
    expect(hangmanRound("PEPPER", ["P", "E", "R"], 6).won).toBe(true);
    expect(hangmanRound("PEPPER", ["A", "A"], 6).misses).toBe(1);
    expect(hangmanRound("PEPPER", ["A", "B", "C", "D", "F", "G"], 6).lost).toBe(true);
  });
});
