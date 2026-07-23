"use client";

import { useMemo, useState } from "react";

const gridSize = 4;
type Difficulty = "Easy" | "Normal" | "Hard";

function createEmptyBoard() {
  return Array.from({ length: gridSize * gridSize }, () => 0);
}

function pickRandomEmptyIndex(board: number[]) {
  const emptyIndexes = board
    .map((value, index) => (value === 0 ? index : -1))
    .filter((index) => index >= 0);

  if (emptyIndexes.length === 0) {
    return -1;
  }

  return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
}

function seedBoard(board: number[], difficulty: Difficulty, tileCount = 1) {
  const nextBoard = [...board];
  const spawnThreshold = difficulty === "Hard" ? 0.65 : difficulty === "Normal" ? 0.82 : 0.92;

  for (let spawnIndex = 0; spawnIndex < tileCount; spawnIndex += 1) {
    const nextIndex = pickRandomEmptyIndex(nextBoard);
    if (nextIndex < 0) {
      break;
    }
    nextBoard[nextIndex] = Math.random() > spawnThreshold ? 4 : 2;
  }

  return nextBoard;
}

function slideLine(line: number[]) {
  const compact = line.filter((value) => value > 0);
  const merged: number[] = [];
  let gainedScore = 0;

  for (let index = 0; index < compact.length; index += 1) {
    const current = compact[index];
    const next = compact[index + 1];

    if (next === current) {
      const mergedValue = current * 2;
      merged.push(mergedValue);
      gainedScore += mergedValue;
      index += 1;
      continue;
    }

    merged.push(current);
  }

  while (merged.length < gridSize) {
    merged.push(0);
  }

  return { line: merged, gainedScore };
}

function moveBoard(
  board: number[],
  direction: "up" | "down" | "left" | "right",
  difficulty: Difficulty,
) {
  const nextBoard = createEmptyBoard();
  let gainedScore = 0;

  for (let lineIndex = 0; lineIndex < gridSize; lineIndex += 1) {
    const rawLine =
      direction === "left" || direction === "right"
        ? Array.from({ length: gridSize }, (_, cellIndex) => board[lineIndex * gridSize + cellIndex])
        : Array.from({ length: gridSize }, (_, cellIndex) => board[cellIndex * gridSize + lineIndex]);

    const orientedLine =
      direction === "right" || direction === "down" ? [...rawLine].reverse() : rawLine;

    const result = slideLine(orientedLine);
    gainedScore += result.gainedScore;

    const outputLine =
      direction === "right" || direction === "down" ? [...result.line].reverse() : result.line;

    outputLine.forEach((value, cellIndex) => {
      if (direction === "left" || direction === "right") {
        nextBoard[lineIndex * gridSize + cellIndex] = value;
      } else {
        nextBoard[cellIndex * gridSize + lineIndex] = value;
      }
    });
  }

  const didChange = nextBoard.some((value, index) => value !== board[index]);
  return {
    board: didChange ? seedBoard(nextBoard, difficulty, 1) : board,
    gainedScore,
    didChange,
  };
}

function getTileClass(value: number) {
  if (value >= 1024) return "bg-orange-300 text-slate-950";
  if (value >= 256) return "bg-amber-300 text-slate-950";
  if (value >= 64) return "bg-fuchsia-300 text-slate-950";
  if (value >= 16) return "bg-cyan-300 text-slate-950";
  if (value >= 8) return "bg-emerald-300 text-slate-950";
  if (value >= 4) return "bg-white/60 text-white";
  if (value >= 2) return "bg-white/30 text-white";
  return "bg-white/5 text-slate-500";
}

export function TileMerge2048Game() {
  const [board, setBoard] = useState<number[]>(() => createEmptyBoard());
  const [score, setScore] = useState(0);
  const [bestTile, setBestTile] = useState(0);
  const [phase, setPhase] = useState<"idle" | "playing">("idle");
  const [difficulty, setDifficulty] = useState<Difficulty>("Normal");

  const has2048 = useMemo(() => board.some((value) => value >= 2048), [board]);

  function startGame() {
    const startingTiles = difficulty === "Hard" ? 3 : 2;
    const seeded = seedBoard(createEmptyBoard(), difficulty, startingTiles);
    setBoard(seeded);
    setScore(0);
    setBestTile(Math.max(...seeded));
    setPhase("playing");
  }

  function handleMove(direction: "up" | "down" | "left" | "right") {
    if (phase !== "playing") {
      return;
    }

    const result = moveBoard(board, direction, difficulty);
    if (!result.didChange) {
      return;
    }

    setBoard(result.board);
    setScore((currentScore) => currentScore + result.gainedScore);
    setBestTile(Math.max(...result.board));
  }

  return (
    <div className="rounded-[30px] border border-white/10 bg-slate-950 p-4 text-white">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-200/70">
            Tile merge
          </p>
          <p className="text-xl font-semibold">{`Score: ${score}`}</p>
        </div>
        <button
          type="button"
          onClick={startGame}
          className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950"
        >
          {phase === "playing" ? "Restart 2048" : "Start 2048"}
        </button>
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {(["Easy", "Normal", "Hard"] as Difficulty[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setDifficulty(mode)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              difficulty === mode
                ? "bg-amber-300 text-slate-950"
                : "border border-white/10 bg-white/5 text-slate-300"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {board.map((value, index) => (
          <div
            key={index}
            className={`flex aspect-square items-center justify-center rounded-[22px] border border-white/10 text-2xl font-semibold ${getTileClass(value)}`}
          >
            {value > 0 ? value : ""}
          </div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => handleMove("left")}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold"
        >
          Left
        </button>
        <button
          type="button"
          onClick={() => handleMove("up")}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold"
        >
          Up
        </button>
        <button
          type="button"
          onClick={() => handleMove("right")}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold"
        >
          Right
        </button>
        <button
          type="button"
          onClick={() => handleMove("down")}
          className="col-span-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold"
        >
          Down
        </button>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          {`Best tile: ${bestTile || 0}`}
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          {has2048 ? "You hit 2048." : `Mode: ${difficulty}`}
        </div>
      </div>
      <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        {phase === "idle"
          ? "Merge matching tiles and chase 2048."
          : "Use the direction buttons to slide the whole board and stack bigger numbers."}
      </div>
    </div>
  );
}
