export type LogicDifficulty = "easy" | "normal" | "hard";
type Random = () => number;

function shuffled<Value>(values: Value[], random: Random): Value[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

export const MINE_DIFFICULTIES = {
  easy: { size: 8, mines: 10 },
  normal: { size: 9, mines: 12 },
  hard: { size: 10, mines: 18 },
} as const;

export type MineBoard = {
  size: number;
  mineCount: number;
  mines: boolean[];
  revealed: boolean[];
  flags: boolean[];
  planted: boolean;
  phase: "playing" | "won" | "lost";
};

export function createMineBoard(difficulty: LogicDifficulty): MineBoard {
  const { size, mines } = MINE_DIFFICULTIES[difficulty];
  return { size, mineCount: mines, mines: Array(size * size).fill(false), revealed: Array(size * size).fill(false), flags: Array(size * size).fill(false), planted: false, phase: "playing" };
}

export function mineNeighbors(index: number, size: number): number[] {
  const neighbors: number[] = [];
  const row = Math.floor(index / size);
  const column = index % size;
  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
      const nextRow = row + rowOffset;
      const nextColumn = column + columnOffset;
      if ((rowOffset || columnOffset) && nextRow >= 0 && nextRow < size && nextColumn >= 0 && nextColumn < size) neighbors.push(nextRow * size + nextColumn);
    }
  }
  return neighbors;
}

export function mineCountAround(board: MineBoard, index: number): number {
  return mineNeighbors(index, board.size).filter((neighbor) => board.mines[neighbor]).length;
}

export function toggleMineFlag(board: MineBoard, index: number): MineBoard {
  if (board.phase !== "playing" || !Number.isInteger(index) || index < 0 || index >= board.flags.length || board.revealed[index]) return board;
  if (!board.flags[index] && board.flags.filter(Boolean).length >= board.mineCount) return board;
  const flags = [...board.flags];
  flags[index] = !flags[index];
  return { ...board, flags };
}

export function revealMine(board: MineBoard, index: number, random: Random = Math.random): MineBoard {
  if (board.phase !== "playing" || !Number.isInteger(index) || index < 0 || index >= board.mines.length || board.flags[index] || board.revealed[index]) return board;
  let mines = board.mines;
  if (!board.planted) {
    const safe = new Set([index, ...mineNeighbors(index, board.size)]);
    const candidates = shuffled(board.mines.map((_, cell) => cell).filter((cell) => !safe.has(cell)), random);
    mines = [...mines];
    candidates.slice(0, board.mineCount).forEach((cell) => { mines[cell] = true; });
  }
  const next: MineBoard = { ...board, mines, revealed: [...board.revealed], planted: true };
  if (mines[index]) {
    next.phase = "lost";
    mines.forEach((mine, cell) => { if (mine) next.revealed[cell] = true; });
    return next;
  }
  const pending = [index];
  while (pending.length) {
    const cell = pending.pop()!;
    if (next.revealed[cell] || next.flags[cell] || mines[cell]) continue;
    next.revealed[cell] = true;
    if (mineCountAround(next, cell) === 0) pending.push(...mineNeighbors(cell, board.size));
  }
  if (next.revealed.filter(Boolean).length === mines.length - board.mineCount) next.phase = "won";
  return next;
}

function boxOf(index: number) {
  return Math.floor(index / 27) * 3 + Math.floor((index % 9) / 3);
}

export function sudokuConflicts(cells: number[]): Set<number> {
  const conflicts = new Set<number>();
  for (let index = 0; index < cells.length; index += 1) {
    if (!cells[index]) continue;
    for (let other = index + 1; other < cells.length; other += 1) {
      if (cells[index] === cells[other] && (Math.floor(index / 9) === Math.floor(other / 9) || index % 9 === other % 9 || boxOf(index) === boxOf(other))) {
        conflicts.add(index);
        conflicts.add(other);
      }
    }
  }
  return conflicts;
}

export function validSudoku(cells: number[]): boolean {
  return cells.length === 81 && cells.every((value) => Number.isInteger(value) && value >= 1 && value <= 9) && sudokuConflicts(cells).size === 0;
}

export function countSudokuSolutions(puzzle: number[], limit = 2): number {
  if (puzzle.length !== 81 || puzzle.some((value) => !Number.isInteger(value) || value < 0 || value > 9) || limit < 1) return 0;
  const cells = [...puzzle];
  const rows = Array(9).fill(0);
  const columns = Array(9).fill(0);
  const boxes = Array(9).fill(0);
  for (let index = 0; index < 81; index += 1) {
    if (!cells[index]) continue;
    const bit = 1 << cells[index];
    const row = Math.floor(index / 9);
    const column = index % 9;
    const box = boxOf(index);
    if ((rows[row] | columns[column] | boxes[box]) & bit) return 0;
    rows[row] |= bit;
    columns[column] |= bit;
    boxes[box] |= bit;
  }
  let count = 0;
  function visit() {
    if (count >= limit) return;
    let selected = -1;
    let candidates = 0;
    let smallest = 10;
    for (let index = 0; index < 81; index += 1) {
      if (cells[index]) continue;
      const mask = 1022 & ~(rows[Math.floor(index / 9)] | columns[index % 9] | boxes[boxOf(index)]);
      let size = 0;
      for (let bits = mask; bits; bits &= bits - 1) size += 1;
      if (!size) return;
      if (size < smallest) { selected = index; candidates = mask; smallest = size; }
      if (size === 1) break;
    }
    if (selected === -1) { count += 1; return; }
    const row = Math.floor(selected / 9);
    const column = selected % 9;
    const box = boxOf(selected);
    for (let value = 1; value <= 9; value += 1) {
      const bit = 1 << value;
      if (!(candidates & bit)) continue;
      cells[selected] = value;
      rows[row] |= bit; columns[column] |= bit; boxes[box] |= bit;
      visit();
      rows[row] ^= bit; columns[column] ^= bit; boxes[box] ^= bit;
      cells[selected] = 0;
      if (count >= limit) break;
    }
  }
  visit();
  return count;
}

export type SudokuPuzzle = { puzzle: number[]; solution: number[] };

export function generateSudoku(difficulty: LogicDifficulty, random: Random = Math.random): SudokuPuzzle {
  const groups = [0, 1, 2];
  const order = () => shuffled(groups, random).flatMap((group) => shuffled(groups, random).map((offset) => group * 3 + offset));
  const rows = order();
  const columns = order();
  const digits = shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9], random);
  const solution = rows.flatMap((row) => columns.map((column) => digits[(row * 3 + Math.floor(row / 3) + column) % 9]));
  const target = { easy: 42, normal: 34, hard: 28 }[difficulty];
  let best = [...solution];
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const puzzle = [...solution];
    let clues = 81;
    for (const index of shuffled(Array.from({ length: 81 }, (_, cell) => cell), random)) {
      const value = puzzle[index];
      puzzle[index] = 0;
      if (countSudokuSolutions(puzzle) !== 1) puzzle[index] = value;
      else clues -= 1;
      if (clues <= target) break;
    }
    if (clues < best.filter(Boolean).length) best = puzzle;
    if (clues <= target) break;
  }
  return { puzzle: best, solution };
}

export type ColorTubes = number[][];
export type ColorMove = [number, number];

export function colorsSorted(tubes: ColorTubes): boolean {
  return tubes.some((tube) => tube.length > 0) && tubes.every((tube) => tube.length === 0 || (tube.length === 4 && tube.every((color) => color === tube[0])));
}

export function pourColor(tubes: ColorTubes, from: number, to: number): ColorTubes | null {
  const source = tubes[from];
  const target = tubes[to];
  if (from === to || !source?.length || !target || target.length >= 4) return null;
  const color = source[source.length - 1];
  if (target.length && target[target.length - 1] !== color) return null;
  let amount = 1;
  while (amount < source.length && source[source.length - amount - 1] === color) amount += 1;
  amount = Math.min(amount, 4 - target.length);
  return tubes.map((tube, index) => index === from ? tube.slice(0, -amount) : index === to ? [...tube, ...Array(amount).fill(color)] : [...tube]);
}

export function generateColorLevel(level: number, random: Random = Math.random): { tubes: ColorTubes; solution: ColorMove[] } {
  for (let offset = 0; offset < Math.min(100, Math.max(1, level)) * 13; offset += 1) random();
  const colorCount = Math.min(6, 3 + Math.floor((Math.max(1, level) - 1) / 3));
  let tubes: ColorTubes = shuffled([...Array.from({ length: colorCount }, (_, color) => Array(4).fill(color + 1)), [], []], random);
  const moves: ColorMove[] = [];
  const seen = new Set([JSON.stringify(tubes)]);
  let best = tubes;
  let bestMoves: ColorMove[] = [];
  let bestMix = -1;
  for (let step = 0; step < 35 + Math.min(level, 20) * 8; step += 1) {
    const choices: { tubes: ColorTubes; inverse: ColorMove; key: string; mix: number }[] = [];
    const before = JSON.stringify(tubes);
    for (let from = 0; from < tubes.length; from += 1) {
      const source = tubes[from];
      if (!source.length) continue;
      const color = source[source.length - 1];
      for (let to = 0; to < tubes.length; to += 1) {
        if (to === from) continue;
        for (let amount = 1; amount <= Math.min(source.length, 4 - tubes[to].length); amount += 1) {
          if (source.slice(-amount).some((value) => value !== color)) break;
          const candidate = tubes.map((tube, index) => index === from ? tube.slice(0, -amount) : index === to ? [...tube, ...Array(amount).fill(color)] : [...tube]);
          const key = JSON.stringify(candidate);
          if (seen.has(key) || JSON.stringify(pourColor(candidate, to, from)) !== before) continue;
          const mix = candidate.reduce((total, tube) => total + tube.filter((value, index) => index > 0 && value !== tube[index - 1]).length, 0);
          choices.push({ tubes: candidate, inverse: [to, from], key, mix });
        }
      }
    }
    if (!choices.length) break;
    const choice = choices[Math.floor(random() * choices.length)];
    tubes = choice.tubes;
    moves.push(choice.inverse);
    seen.add(choice.key);
    if (choice.mix >= bestMix && !colorsSorted(tubes)) { bestMix = choice.mix; best = tubes; bestMoves = [...moves]; }
  }
  return { tubes: best, solution: bestMoves.reverse() };
}
