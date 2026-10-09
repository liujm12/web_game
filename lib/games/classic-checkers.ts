export type Side = "orange" | "cyan";
export type Piece = { side: Side; king: boolean };
export type Board = (Piece | null)[];
export type Move = { from: number; to: number; captured?: number };
export type Difficulty = "easy" | "normal" | "hard";
export type CheckersState = {
  board: Board;
  turn: Side;
  forced: number | null;
  quietTurns: number;
  repetitions: Record<string, number>;
  result: Side | "draw" | null;
  drawReason: string | null;
};

const opponent = (side: Side): Side => side === "orange" ? "cyan" : "orange";

function positionKey(board: Board, turn: Side) {
  return turn + board.map(piece => !piece ? "." : piece.side === "orange" ? (piece.king ? "O" : "o") : (piece.king ? "C" : "c")).join("");
}

function pieceMoves(board: Board, from: number, capturesOnly: boolean): Move[] {
  const piece = board[from];
  if (!piece) return [];
  const moves: Move[] = [];
  const row = Math.floor(from / 8);
  const column = from % 8;
  const directions = piece.king ? [-1, 1] : [piece.side === "orange" ? -1 : 1];
  for (const vertical of directions) {
    for (const horizontal of [-1, 1]) {
      const nextRow = row + vertical;
      const nextColumn = column + horizontal;
      if (nextRow < 0 || nextRow > 7 || nextColumn < 0 || nextColumn > 7) continue;
      const adjacent = nextRow * 8 + nextColumn;
      if (!board[adjacent] && !capturesOnly) moves.push({ from, to: adjacent });
      const landingRow = row + vertical * 2;
      const landingColumn = column + horizontal * 2;
      if (board[adjacent]?.side !== opponent(piece.side) || landingRow < 0 || landingRow > 7 || landingColumn < 0 || landingColumn > 7) continue;
      const landing = landingRow * 8 + landingColumn;
      if (!board[landing]) moves.push({ from, to: landing, captured: adjacent });
    }
  }
  return moves;
}

export function legalMoves(state: CheckersState): Move[] {
  if (state.result) return [];
  if (state.forced !== null) return pieceMoves(state.board, state.forced, true);
  const moves = state.board.flatMap((piece, index) => piece?.side === state.turn ? pieceMoves(state.board, index, false) : []);
  const captures = moves.filter(move => move.captured !== undefined);
  return captures.length ? captures : moves;
}

export function createCheckers(board?: Board, turn: Side = "orange"): CheckersState {
  const pieces = board ? board.map(piece => piece ? { ...piece } : null) : Array.from({ length: 64 }, (_, index): Piece | null => {
    const row = Math.floor(index / 8);
    if ((row + index % 8) % 2 === 0 || row === 3 || row === 4) return null;
    return { side: row < 3 ? "cyan" : "orange", king: false };
  });
  const state: CheckersState = { board: pieces, turn, forced: null, quietTurns: 0, repetitions: { [positionKey(pieces, turn)]: 1 }, result: null, drawReason: null };
  if (!legalMoves(state).length) state.result = opponent(turn);
  return state;
}

export function applyMove(state: CheckersState, candidate: Move): CheckersState {
  const move = legalMoves(state).find(legal => legal.from === candidate.from && legal.to === candidate.to);
  if (!move) return state;
  const piece = state.board[move.from]!;
  const promoted = !piece.king && Math.floor(move.to / 8) === (piece.side === "orange" ? 0 : 7);
  const board = [...state.board];
  board[move.from] = null;
  board[move.to] = { ...piece, king: piece.king || promoted };
  if (move.captured !== undefined) board[move.captured] = null;
  const next: CheckersState = { ...state, board, forced: null, quietTurns: move.captured !== undefined || promoted ? 0 : state.quietTurns + 1 };
  if (move.captured !== undefined && !promoted && pieceMoves(board, move.to, true).length) {
    next.forced = move.to;
    return next;
  }
  next.turn = opponent(state.turn);
  const key = positionKey(board, next.turn);
  next.repetitions = { ...state.repetitions, [key]: (state.repetitions[key] ?? 0) + 1 };
  if (!legalMoves(next).length) next.result = state.turn;
  else if (next.repetitions[key] >= 3 || next.quietTurns >= 80) {
    next.result = "draw";
    next.drawReason = next.repetitions[key] >= 3 ? "Threefold repetition" : "40 moves each without a capture or promotion";
  }
  return next;
}

function evaluate(state: CheckersState, side: Side): number {
  if (state.result) return state.result === "draw" ? 0 : state.result === side ? 100000 : -100000;
  return state.board.reduce((total, piece, index) => {
    if (!piece) return total;
    const row = Math.floor(index / 8);
    const column = index % 8;
    const advancement = piece.side === "orange" ? 7 - row : row;
    const center = column >= 2 && column <= 5 ? 5 : 0;
    const value = (piece.king ? 175 : 100 + advancement * 4) + center;
    return total + (piece.side === side ? value : -value);
  }, 0);
}

export function chooseComputerMove(state: CheckersState, difficulty: Difficulty = "normal"): Move | null {
  const moves = legalMoves(state);
  if (!moves.length) return null;
  const depth = { easy: 1, normal: 3, hard: 5 }[difficulty];
  const budget = { easy: 1000, normal: 5000, hard: 16000 }[difficulty];
  let nodes = 0;
  const side = state.turn;

  function search(current: CheckersState, remaining: number, alpha: number, beta: number): number {
    nodes++;
    if (current.result || nodes >= budget || (remaining <= 0 && current.forced === null)) return evaluate(current, side);
    const maximizing = current.turn === side;
    let best = maximizing ? -Infinity : Infinity;
    for (const move of legalMoves(current)) {
      const next = applyMove(current, move);
      const score = search(next, remaining - (next.turn !== current.turn ? 1 : 0), alpha, beta);
      best = maximizing ? Math.max(best, score) : Math.min(best, score);
      if (maximizing) alpha = Math.max(alpha, best);
      else beta = Math.min(beta, best);
      if (beta <= alpha || nodes >= budget) break;
    }
    return best;
  }

  let bestMove = moves[0];
  let bestScore = -Infinity;
  for (const move of moves) {
    const next = applyMove(state, move);
    const score = search(next, depth - (next.turn !== state.turn ? 1 : 0), -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
}
