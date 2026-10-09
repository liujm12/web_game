export type Difficulty = "easy" | "normal" | "hard";
export type Cell = [number, number];
export type Tetromino = "I" | "O" | "T" | "S" | "Z" | "J" | "L";
export const TETROMINOES: Record<Tetromino, Cell[]> = {
  I: [[0, 0], [1, 0], [2, 0], [3, 0]],
  O: [[0, 0], [1, 0], [0, 1], [1, 1]],
  T: [[1, 0], [0, 1], [1, 1], [2, 1]],
  S: [[1, 0], [2, 0], [0, 1], [1, 1]],
  Z: [[0, 0], [1, 0], [1, 1], [2, 1]],
  J: [[0, 0], [0, 1], [1, 1], [2, 1]],
  L: [[2, 0], [0, 1], [1, 1], [2, 1]],
};
export const BLOCK_COLORS = ["#0f172a", "#67e8f9", "#fde68a", "#c4b5fd", "#bef264", "#fb7185", "#93c5fd", "#fdba74"];
const kinds = Object.keys(TETROMINOES) as Tetromino[];
const boundedRandom = (random: () => number) => Math.max(0, Math.min(0.999999, random()));

export function makeBag(random = Math.random): Tetromino[] {
  const bag = [...kinds];
  for (let index = bag.length - 1; index > 0; index--) {
    const swap = Math.floor(boundedRandom(random) * (index + 1));
    [bag[index], bag[swap]] = [bag[swap], bag[index]];
  }
  return bag;
}

export type BlockPiece = { kind: Tetromino; cells: Cell[]; x: number; y: number };
export type BlockState = {
  board: number[][]; piece: BlockPiece; queue: Tetromino[];
  score: number; lines: number; level: number; over: boolean; difficulty: Difficulty;
};
export type BlockAction = "left" | "right" | "down" | "rotate" | "hard" | "tick";

function spawnBlock(kind: Tetromino): BlockPiece {
  const cells = TETROMINOES[kind].map(cell => [...cell] as Cell);
  return { kind, cells, x: Math.floor((10 - Math.max(...cells.map(cell => cell[0])) - 1) / 2), y: 0 };
}

export function createBlocks(difficulty: Difficulty = "normal", random = Math.random): BlockState {
  const queue = makeBag(random);
  return {
    board: Array.from({ length: 20 }, () => Array<number>(10).fill(0)),
    piece: spawnBlock(queue.shift()!), queue, score: 0, lines: 0, level: 1, over: false, difficulty,
  };
}

export function rotateCells(cells: Cell[]): Cell[] {
  const rotated: Cell[] = cells.map(([col, row]) => [-row, col]);
  const minCol = Math.min(...rotated.map(cell => cell[0]));
  const minRow = Math.min(...rotated.map(cell => cell[1]));
  return rotated.map(([col, row]) => [col - minCol, row - minRow]);
}

export function blockCollides(board: number[][], piece: BlockPiece): boolean {
  return piece.cells.some(([col, row]) => {
    const actualCol = col + piece.x;
    const actualRow = row + piece.y;
    return actualCol < 0 || actualCol >= 10 || actualRow >= 20 ||
      (actualRow >= 0 && board[actualRow][actualCol] !== 0);
  });
}

export function blockGhost(state: BlockState): BlockPiece {
  let piece = { ...state.piece };
  if (blockCollides(state.board, piece)) return piece;
  while (!blockCollides(state.board, { ...piece, y: piece.y + 1 })) piece = { ...piece, y: piece.y + 1 };
  return piece;
}

export function clearBlockLines(board: number[][]): { board: number[][]; lines: number } {
  const remaining = board.filter(row => row.some(cell => cell === 0)).map(row => [...row]);
  const lines = board.length - remaining.length;
  return { board: [...Array.from({ length: lines }, () => Array<number>(10).fill(0)), ...remaining], lines };
}

export function blockInterval(difficulty: Difficulty, level: number): number {
  return Math.max(85, { easy: 900, normal: 700, hard: 470 }[difficulty] * Math.pow(0.84, level - 1));
}

function lockBlock(state: BlockState, random: () => number): BlockState {
  if (state.piece.cells.some(([, row]) => row + state.piece.y < 0)) return { ...state, over: true };
  const board = state.board.map(row => [...row]);
  for (const [col, row] of state.piece.cells) board[row + state.piece.y][col + state.piece.x] = kinds.indexOf(state.piece.kind) + 1;
  const cleared = clearBlockLines(board);
  const queue = [...state.queue];
  if (queue.length < 7) queue.push(...makeBag(random));
  const piece = spawnBlock(queue.shift()!);
  const lines = state.lines + cleared.lines;
  return {
    ...state, board: cleared.board, piece, queue, lines, level: 1 + Math.floor(lines / 10),
    score: state.score + [0, 100, 300, 500, 800][cleared.lines] * state.level,
    over: blockCollides(cleared.board, piece),
  };
}

export function blockAction(state: BlockState, action: BlockAction, random = Math.random): BlockState {
  if (state.over) return state;
  if (action === "hard") {
    const piece = blockGhost(state);
    return lockBlock({ ...state, piece, score: state.score + (piece.y - state.piece.y) * 2 }, random);
  }
  if (action === "rotate") {
    if (state.piece.kind === "O") return state;
    const cells = rotateCells(state.piece.cells);
    for (const [offsetX, offsetY] of [[0, 0], [-1, 0], [1, 0], [-2, 0], [2, 0], [0, -1], [0, -2]]) {
      const piece = { ...state.piece, cells, x: state.piece.x + offsetX, y: state.piece.y + offsetY };
      if (!blockCollides(state.board, piece)) return { ...state, piece };
    }
    return state;
  }
  const vertical = action === "down" || action === "tick";
  const piece = { ...state.piece, x: state.piece.x + (vertical ? 0 : action === "left" ? -1 : 1), y: state.piece.y + (vertical ? 1 : 0) };
  if (blockCollides(state.board, piece)) return vertical ? lockBlock(state, random) : state;
  return { ...state, piece, score: state.score + (action === "down" ? 1 : 0) };
}

export const FLAPPY = { width: 360, height: 480, birdX: 84, radius: 12, pipeWidth: 52, spacing: 220 };
export const flappySettings = {
  easy: { gap: 186, speed: 115, gravity: 750, flap: -280 },
  normal: { gap: 160, speed: 140, gravity: 850, flap: -300 },
  hard: { gap: 138, speed: 165, gravity: 950, flap: -320 },
};
export type FlappyPipe = { id: number; x: number; center: number; gap: number; scored: boolean };
export type FlappyState = { y: number; velocity: number; pipes: FlappyPipe[]; score: number; over: boolean; difficulty: Difficulty; nextId: number };

export function createFlappy(difficulty: Difficulty = "normal", random = Math.random): FlappyState {
  return {
    y: 240, velocity: 0, pipes: [{ id: 0, x: 400, center: 220 + boundedRandom(random) * 40, gap: flappySettings[difficulty].gap, scored: false }],
    score: 0, over: false, difficulty, nextId: 1,
  };
}

export function flapBird(state: FlappyState): FlappyState {
  return state.over ? state : { ...state, velocity: flappySettings[state.difficulty].flap };
}

function circleHitsRect(centerY: number, left: number, top: number, width: number, height: number): boolean {
  const closestX = Math.max(left, Math.min(FLAPPY.birdX, left + width));
  const closestY = Math.max(top, Math.min(centerY, top + height));
  return (closestX - FLAPPY.birdX) ** 2 + (closestY - centerY) ** 2 <= FLAPPY.radius ** 2;
}

export function flappyCollision(state: FlappyState): boolean {
  if (state.y - FLAPPY.radius <= 0 || state.y + FLAPPY.radius >= FLAPPY.height) return true;
  return state.pipes.some(pipe => {
    const top = pipe.center - pipe.gap / 2;
    const bottom = pipe.center + pipe.gap / 2;
    return circleHitsRect(state.y, pipe.x, 0, FLAPPY.pipeWidth, top) ||
      circleHitsRect(state.y, pipe.x, bottom, FLAPPY.pipeWidth, FLAPPY.height - bottom);
  });
}

export function stepFlappy(state: FlappyState, seconds: number, random = Math.random): FlappyState {
  if (state.over || !Number.isFinite(seconds) || seconds <= 0) return state;
  let next = { ...state, pipes: state.pipes.map(pipe => ({ ...pipe })) };
  let remaining = Math.min(seconds, 0.25);
  const settings = flappySettings[state.difficulty];
  while (remaining > 1e-9 && !next.over) {
    const delta = Math.min(remaining, 1 / 120);
    remaining -= delta;
    const speed = settings.speed + Math.min(65, next.score * 2.5);
    next.y += next.velocity * delta + 0.5 * settings.gravity * delta * delta;
    next.velocity += settings.gravity * delta;
    next.pipes = next.pipes.map(pipe => ({ ...pipe, x: pipe.x - speed * delta }));
    next.over = flappyCollision(next);
    if (next.over) break;
    for (const pipe of next.pipes) {
      if (!pipe.scored && pipe.x + FLAPPY.pipeWidth < FLAPPY.birdX - FLAPPY.radius) {
        pipe.scored = true;
        next.score++;
      }
    }
    next.pipes = next.pipes.filter(pipe => pipe.x + FLAPPY.pipeWidth >= 0);
    const last = next.pipes.at(-1);
    if (!last || last.x <= FLAPPY.width - FLAPPY.spacing) {
      const gap = settings.gap - Math.min(16, next.score * 0.5);
      const margin = gap / 2 + 40;
      const center = Math.max(margin, Math.min(FLAPPY.height - margin, (last?.center ?? 240) + (boundedRandom(random) * 2 - 1) * 70));
      next = { ...next, nextId: next.nextId + 1, pipes: [...next.pipes, { id: next.nextId, x: last ? last.x + FLAPPY.spacing : 400, center, gap, scored: false }] };
    }
  }
  return next;
}
