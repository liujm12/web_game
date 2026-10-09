import { describe, expect, it } from "vitest";
import {
  MINE_DIFFICULTIES, createMineBoard, mineNeighbors, revealMine, toggleMineFlag,
  generateSudoku, countSudokuSolutions, validSudoku, sudokuConflicts,
  generateColorLevel, pourColor, colorsSorted,
} from "@/lib/games/classic-logic";

function randomSeed(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

describe("Minesweeper engine", () => {
  for (const difficulty of ["easy", "normal", "hard"] as const) {
    it(`generates ${difficulty} with exact mine counts and a safe opening neighborhood`, () => {
      const config = MINE_DIFFICULTIES[difficulty];
      for (let seed = 1; seed <= 20; seed += 1) {
        const initial = createMineBoard(difficulty);
        const first = seed % (config.size * config.size);
        const board = revealMine(initial, first, randomSeed(seed));
        expect(board.mines.filter(Boolean)).toHaveLength(config.mines);
        for (const index of [first, ...mineNeighbors(first, config.size)]) {
          expect(board.mines[index]).toBe(false);
          expect(board.revealed[index]).toBe(true);
        }
      }
    });
  }

  it("protects flags from clicks and floods, and cannot flag revealed cells", () => {
    let board = toggleMineFlag(createMineBoard("easy"), 1);
    expect(revealMine(board, 1)).toBe(board);
    board = revealMine(board, 0, randomSeed(42));
    expect(board.revealed[1]).toBe(false);
    expect(toggleMineFlag(board, 0)).toBe(board);
    board = revealMine(toggleMineFlag(board, 1), 1);
    expect(board.revealed[1]).toBe(true);
  });

  it("ends on a mine, wins only by revealing all safe cells, and freezes finished games", () => {
    const board = revealMine(createMineBoard("normal"), 40, randomSeed(8));
    const lost = revealMine(board, board.mines.findIndex(Boolean));
    expect(lost.phase).toBe("lost");
    expect(toggleMineFlag(lost, 2)).toBe(lost);
    let won = board;
    board.mines.forEach((mine, index) => { if (!mine) won = revealMine(won, index); });
    expect(won.phase).toBe("won");
    expect(revealMine(won, board.mines.findIndex(Boolean))).toBe(won);
    expect(board.revealed.filter(Boolean).length).toBeLessThan(won.revealed.filter(Boolean).length);
  });
});

describe("Sudoku engine", () => {
  for (const difficulty of ["easy", "normal", "hard"] as const) {
    it(`generates unique standard 9x9 ${difficulty} puzzles`, () => {
      for (let seed = 1; seed <= 5; seed += 1) {
        const { puzzle, solution } = generateSudoku(difficulty, randomSeed(seed));
        expect(puzzle).toHaveLength(81);
        expect(validSudoku(solution)).toBe(true);
        expect(countSudokuSolutions(puzzle)).toBe(1);
        expect(puzzle.filter(Boolean).length).toBeLessThanOrEqual(difficulty === "easy" ? 42 : difficulty === "normal" ? 34 : 30);
        expect(puzzle.every((value, index) => !value || solution[index] === value)).toBe(true);
      }
    });
  }

  it("produces varied puzzles and rejects incomplete, conflicting, and invalid boards", () => {
    const first = generateSudoku("easy", randomSeed(21));
    const second = generateSudoku("easy", randomSeed(22));
    expect(first.puzzle).not.toEqual(second.puzzle);
    expect(validSudoku(first.puzzle)).toBe(false);
    const invalid = [...first.solution];
    invalid[0] = invalid[1];
    expect(validSudoku(invalid)).toBe(false);
    expect(countSudokuSolutions(invalid)).toBe(0);
    expect(sudokuConflicts(invalid).has(0)).toBe(true);
    expect(sudokuConflicts(invalid).has(1)).toBe(true);
    expect(countSudokuSolutions(Array(81).fill(0))).toBe(2);
    expect(validSudoku(Array(81).fill(10))).toBe(false);
  });
});

describe("Color Sort engine", () => {
  it("pours the entire fitting top run without mutating its input", () => {
    const tubes = [[1, 2, 2], [2], []];
    expect(pourColor(tubes, 0, 1)).toEqual([[1], [2, 2, 2], []]);
    expect(tubes).toEqual([[1, 2, 2], [2], []]);
    expect(pourColor([[1, 1], [1, 1, 1], []], 0, 1)).toEqual([[1], [1, 1, 1, 1], []]);
  });

  it("rejects empty, same-tube, full and mismatched pours", () => {
    const tubes = [[1], [2], [], [1, 1, 1, 1]];
    for (const [from, to] of [[0, 1], [0, 0], [2, 0], [0, 3], [-1, 0]]) {
      expect(pourColor(tubes, from, to)).toBeNull();
    }
    expect(colorsSorted([[1], [2]])).toBe(false);
    expect(colorsSorted([[1, 1, 1, 1], [2, 2, 2, 2], []])).toBe(true);
  });

  it("generates varied levels with a replayable legal solution and exact color inventory", () => {
    const layouts = new Set<string>();
    for (let level = 1; level <= 12; level += 1) {
      for (let seed = 1; seed <= 4; seed += 1) {
        const generated = generateColorLevel(level, randomSeed(seed));
        let tubes = generated.tubes;
        layouts.add(JSON.stringify(tubes));
        expect(colorsSorted(tubes)).toBe(false);
        expect(tubes.every((tube) => tube.length <= 4)).toBe(true);
        const inventory = tubes.flat();
        for (const color of new Set(inventory)) expect(inventory.filter((value) => value === color)).toHaveLength(4);
        for (const [from, to] of generated.solution) {
          const next = pourColor(tubes, from, to);
          expect(next).not.toBeNull();
          tubes = next!;
        }
        expect(colorsSorted(tubes)).toBe(true);
      }
    }
    expect(layouts.size).toBeGreaterThan(35);
  });
});
