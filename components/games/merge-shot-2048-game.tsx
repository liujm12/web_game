"use client";

import { useEffect, useMemo, useState } from "react";

const columnCount = 5;
const rowCount = 7;
const emptyBoard = () =>
  Array.from({ length: rowCount }, () => Array.from({ length: columnCount }, () => 0));
const tileQueue = [2, 2, 4, 2, 8, 4, 2, 16];

type Phase = "idle" | "playing" | "over";
type Board = number[][];

function getTileColor(value: number) {
  if (value >= 1024) return "from-yellow-200 to-orange-400 text-slate-950";
  if (value >= 256) return "from-fuchsia-300 to-rose-400 text-slate-950";
  if (value >= 64) return "from-cyan-200 to-sky-400 text-slate-950";
  if (value >= 16) return "from-emerald-200 to-lime-400 text-slate-950";
  if (value >= 8) return "from-violet-300 to-indigo-400 text-white";
  if (value >= 4) return "from-amber-200 to-orange-300 text-slate-950";
  if (value >= 2) return "from-slate-100 to-slate-300 text-slate-950";
  return "from-white/5 to-white/10 text-transparent";
}

function cloneBoard(board: Board) {
  return board.map((row) => [...row]);
}

function getLowestOpenRow(board: Board, column: number) {
  for (let row = rowCount - 1; row >= 0; row -= 1) {
    if (board[row][column] === 0) {
      return row;
    }
  }

  return -1;
}

function mergeTouchingTiles(board: Board, startRow: number, startColumn: number) {
  const nextBoard = cloneBoard(board);
  const currentRow = startRow;
  const currentColumn = startColumn;
  let currentValue = nextBoard[currentRow][currentColumn];
  let combo = 0;
  let gainedScore = 0;

  while (currentValue > 0) {
    const neighbor = [
      [currentRow - 1, currentColumn],
      [currentRow + 1, currentColumn],
      [currentRow, currentColumn - 1],
      [currentRow, currentColumn + 1],
    ].find(
      ([row, column]) =>
        row >= 0 &&
        row < rowCount &&
        column >= 0 &&
        column < columnCount &&
        nextBoard[row][column] === currentValue,
    );

    if (!neighbor) {
      break;
    }

    const [mergeRow, mergeColumn] = neighbor;
    currentValue *= 2;
    combo += 1;
    gainedScore += currentValue;
    nextBoard[mergeRow][mergeColumn] = 0;
    nextBoard[currentRow][currentColumn] = currentValue;
  }

  return { board: nextBoard, combo, gainedScore, value: currentValue };
}

function compactBoard(board: Board) {
  const nextBoard = emptyBoard();

  for (let column = 0; column < columnCount; column += 1) {
    const values = board.map((row) => row[column]).filter((value) => value > 0);
    values.reverse().forEach((value, index) => {
      nextBoard[rowCount - 1 - index][column] = value;
    });
  }

  return nextBoard;
}

export function MergeShot2048Game() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [board, setBoard] = useState<Board>(() => emptyBoard());
  const [lane, setLane] = useState(2);
  const [shotIndex, setShotIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestTile, setBestTile] = useState(0);
  const [message, setMessage] = useState("Aim your cannon and build the biggest block.");

  const currentTile = tileQueue[shotIndex % tileQueue.length];
  const nextTile = tileQueue[(shotIndex + 1) % tileQueue.length];
  const hasWon = bestTile >= 2048;

  const trajectoryRows = useMemo(() => {
    const stopRow = getLowestOpenRow(board, lane);
    return Array.from({ length: rowCount }, (_, row) => row <= stopRow);
  }, [board, lane]);

  function startGame() {
    setPhase("playing");
    setBoard(emptyBoard());
    setLane(2);
    setShotIndex(0);
    setScore(0);
    setCombo(0);
    setBestTile(0);
    setMessage("Cannon armed. Pick a lane and fire.");
  }

  function moveLane(direction: -1 | 1) {
    setLane((currentLane) => Math.min(columnCount - 1, Math.max(0, currentLane + direction)));
  }

  function shootTile() {
    if (phase === "idle") {
      startGame();
      return;
    }

    if (phase !== "playing") {
      return;
    }

    const landingRow = getLowestOpenRow(board, lane);
    if (landingRow < 0) {
      setPhase("over");
      setMessage("Lane jammed. Restart and keep the stack lower.");
      return;
    }

    const placedBoard = cloneBoard(board);
    placedBoard[landingRow][lane] = currentTile;
    const merged = mergeTouchingTiles(placedBoard, landingRow, lane);
    const settledBoard = compactBoard(merged.board);
    const nextBestTile = Math.max(bestTile, merged.value);

    setBoard(settledBoard);
    setShotIndex((currentIndex) => currentIndex + 1);
    setScore((currentScore) => currentScore + currentTile + merged.gainedScore);
    setCombo(merged.combo);
    setBestTile(nextBestTile);
    setMessage(
      merged.combo > 0
        ? `Combo x${merged.combo + 1}! Merged into ${merged.value}.`
        : "Nice shot. Line up a matching block for a combo.",
    );

    if (settledBoard[0].some((value) => value > 0)) {
      setPhase("over");
      setMessage("Stack reached the danger line. Try another run.");
    }
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      const handledKeys = ["arrowleft", "arrowright", "a", "d", " ", "enter", "r"];

      if (!handledKeys.includes(key)) {
        return;
      }

      event.preventDefault();

      if (key === "arrowleft" || key === "a") {
        moveLane(-1);
      } else if (key === "arrowright" || key === "d") {
        moveLane(1);
      } else if (key === "r") {
        startGame();
      } else {
        shootTile();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="rounded-[26px] border border-white/10 bg-slate-950 p-3 text-white sm:rounded-[30px] sm:p-4">
      <div className="mb-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/70">
            Merge shooter
          </p>
          <h2 className="text-2xl font-semibold">Merge Shot 2048</h2>
          <p className="mt-1 text-xs text-slate-300 sm:text-sm">
            Arrow keys or A/D to aim. Space or Enter to shoot. R restarts.
          </p>
        </div>
      </div>

      <div className="mb-3 rounded-[22px] border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
        <p>{`Score ${score} · Lane ${lane + 1} · Best ${bestTile || currentTile} · ${
          combo > 0 ? `Combo x${combo + 1}` : "Combo ready"
        }`}</p>
        <p className="mt-2 text-xs text-slate-400">{`Current ${currentTile} · Next ${nextTile}`}</p>
      </div>

      <div className="grid gap-3 lg:gap-4">
        <div
          aria-label="Merge Shot 2048 board"
          className="relative grid grid-cols-5 gap-1.5 rounded-[24px] border border-cyan-200/20 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.20),_rgba(15,23,42,0.98)_62%)] p-2 sm:gap-2 sm:rounded-[28px] sm:p-3"
        >
          <div className="pointer-events-none absolute left-2 right-2 top-2 grid grid-cols-5 gap-1.5 sm:left-3 sm:right-3 sm:top-3 sm:gap-2">
            {Array.from({ length: columnCount }, (_, column) => (
              <div
                key={column}
                className={`min-h-[320px] rounded-[16px] border sm:min-h-[520px] sm:rounded-[20px] ${
                  column === lane
                    ? "border-cyan-200/60 bg-cyan-200/10 shadow-[0_0_28px_rgba(34,211,238,0.25)]"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>
          {board.flatMap((row, rowIndex) =>
            row.map((value, columnIndex) => {
              const isTrajectory = columnIndex === lane && trajectoryRows[rowIndex];
              return (
                <div
                  key={`${rowIndex}-${columnIndex}`}
                  className={`z-10 flex h-10 items-center justify-center rounded-[14px] border text-sm font-black transition sm:h-16 sm:rounded-[20px] sm:text-lg ${
                    value > 0
                      ? `border-white/30 bg-gradient-to-br ${getTileColor(value)} shadow-[0_14px_30px_rgba(15,23,42,0.35)]`
                      : isTrajectory
                        ? "border-cyan-200/25 bg-cyan-200/10"
                        : "border-white/10 bg-white/5"
                  }`}
                >
                  {value > 0 ? value : isTrajectory ? "•" : ""}
                </div>
              );
            }),
          )}
          {phase !== "playing" && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[24px] bg-slate-950/60 p-4 sm:rounded-[28px]">
              <div className="rounded-[24px] border border-white/10 bg-slate-900/90 p-5 text-center">
                <p className="text-xs uppercase tracking-[0.26em] text-cyan-200/70">
                  {phase === "over" ? "Stack full" : "Ready"}
                </p>
                <h3 className="mt-2 text-2xl font-semibold">
                  {phase === "over" ? `${score} points` : "Ready to fire"}
                </h3>
                <button
                  type="button"
                  onClick={startGame}
                  className="mt-4 rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(103,232,249,0.35)]"
                >
                  {phase === "over" ? "Play again" : "Start Shot"}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => moveLane(-1)}
          className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold sm:px-4"
        >
          Aim left
        </button>
        <button
          type="button"
          onClick={shootTile}
          className="rounded-2xl border border-cyan-200/30 bg-cyan-300/15 px-3 py-3 text-sm font-semibold text-cyan-100 sm:px-4"
        >
          Fire
        </button>
        <button
          type="button"
          onClick={() => moveLane(1)}
          className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold sm:px-4"
        >
          Aim right
        </button>
      </div>

      <div className="mt-3 rounded-[22px] border border-white/10 bg-white/5 p-3 text-sm text-slate-300 sm:mt-5 sm:rounded-[24px] sm:p-4">
        {hasWon ? "2048 reached. Keep firing for a bigger chain." : message}
      </div>
    </div>
  );
}
