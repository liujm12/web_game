"use client";

import { useEffect, useMemo, useState } from "react";

import { saveBestScore } from "@/lib/player-profile";
import { readGameScreenshotPreset } from "@/lib/game-screenshot-presets";

const gridSize = 4;
type Difficulty = "Easy" | "Normal" | "Hard";
type GamePhase = "idle" | "playing" | "won" | "lost";

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

export function canMoveTileBoard(board: number[]) {
  if (board.some((value) => value === 0)) return true;

  for (let row = 0; row < gridSize; row += 1) {
    for (let column = 0; column < gridSize; column += 1) {
      const index = row * gridSize + column;
      if (column < gridSize - 1 && board[index] === board[index + 1]) return true;
      if (row < gridSize - 1 && board[index] === board[index + gridSize]) return true;
    }
  }

  return false;
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
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [difficulty, setDifficulty] = useState<Difficulty>("Normal");
  const [capturePreset, setCapturePreset] = useState<string | null>(null);

  const has2048 = useMemo(() => board.some((value) => value >= 2048), [board]);

  useEffect(() => {
    const preset = readGameScreenshotPreset();
    if (!preset) return;

    const boards: Record<string, { board: number[]; score: number; phase: GamePhase }> = {
      progress: {
        board: [64, 32, 8, 2, 16, 8, 4, 2, 8, 4, 2, 0, 4, 2, 0, 0],
        score: 684,
        phase: "playing",
      },
      success: {
        board: [2048, 512, 128, 32, 256, 64, 16, 8, 64, 16, 8, 4, 8, 4, 2, 0],
        score: 24720,
        phase: "won",
      },
      lost: {
        board: [2, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 4, 2],
        score: 3584,
        phase: "lost",
      },
      "corner-anchor": {
        board: [0, 2, 0, 0, 0, 4, 2, 0, 16, 8, 4, 2, 256, 128, 64, 32],
        score: 3280,
        phase: "playing",
      },
      "broken-order": {
        board: [2, 4, 8, 0, 16, 128, 256, 64, 8, 64, 32, 16, 4, 2, 0, 4],
        score: 2944,
        phase: "playing",
      },
      "corner-recovery": {
        board: [0, 2, 0, 0, 4, 8, 0, 0, 16, 32, 4, 0, 0, 256, 128, 64],
        score: 3120,
        phase: "playing",
      },
      "open-space": {
        board: [0, 0, 0, 2, 0, 0, 4, 8, 16, 8, 4, 2, 512, 256, 128, 64],
        score: 7020,
        phase: "playing",
      },
      "crowded-mobility": {
        board: [2, 4, 8, 16, 4, 8, 16, 32, 2, 4, 8, 8, 64, 32, 32, 0],
        score: 5816,
        phase: "playing",
      },
      "crowded-delay-merge": {
        board: [2, 4, 8, 16, 8, 4, 16, 64, 16, 32, 32, 128, 256, 64, 64, 0],
        score: 15440,
        phase: "playing",
      },
      "crowded-order-repair": {
        board: [2, 4, 16, 8, 4, 16, 8, 64, 0, 8, 16, 32, 0, 512, 256, 128],
        score: 20480,
        phase: "playing",
      },
    };
    const capture = boards[preset];
    const timer = window.setTimeout(() => {
      setCapturePreset(preset);
      if (!capture) return;
      setBoard(capture.board);
      setScore(capture.score);
      setBestTile(Math.max(...capture.board));
      setPhase(capture.phase);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (score > 0 && !capturePreset) {
      saveBestScore("2048", score, `${score} points`);
    }
  }, [capturePreset, score]);

  function startGame() {
    const startingTiles = difficulty === "Hard" ? 3 : 2;
    const seeded = seedBoard(createEmptyBoard(), difficulty, startingTiles);
    setBoard(seeded);
    setScore(0);
    setBestTile(Math.max(...seeded));
    setPhase("playing");
    setCapturePreset(null);
  }

  function handleMove(direction: "up" | "down" | "left" | "right") {
    if (phase !== "playing") {
      return;
    }

    const result = moveBoard(board, direction, difficulty);
    if (!result.didChange) {
      if (!canMoveTileBoard(board)) setPhase("lost");
      return;
    }

    setBoard(result.board);
    setScore((currentScore) => currentScore + result.gainedScore);
    setBestTile(Math.max(...result.board));
    if (result.board.some((value) => value >= 2048)) {
      setPhase("won");
    } else if (!canMoveTileBoard(result.board)) {
      setPhase("lost");
    }
  }

  return (
    <div data-game-capture-root="2048" className="rounded-[30px] border border-white/10 bg-slate-950 p-4 text-white">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-200/70">
            Tile merge
          </p>
          <p className="text-xl font-semibold">{`Score ${score} · Best ${bestTile || 0}`}</p>
        </div>
      </div>
      <div className="mb-3 flex flex-wrap gap-2">
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
      <div data-tile-2048-board="true" className="relative grid grid-cols-4 gap-3">
        {board.map((value, index) => (
          <div
            key={index}
            className={`flex aspect-square items-center justify-center rounded-[22px] border border-white/10 text-2xl font-semibold ${getTileClass(value)}`}
          >
            {value > 0 ? value : ""}
          </div>
        ))}
        {phase !== "playing" && (
          <div className="absolute inset-0 flex items-center justify-center rounded-[24px] bg-slate-950/55 p-4">
            <div className="rounded-[24px] border border-white/10 bg-slate-900/90 p-5 text-center">
              <p className="text-xs uppercase tracking-[0.26em] text-amber-200/70">
                Tile merge
              </p>
              <h3 className="mt-2 text-2xl font-semibold">
                {phase === "won" ? "2048 reached" : phase === "lost" ? "No moves left" : "Chase 2048"}
              </h3>
              {phase === "won" ? <p className="mt-2 text-sm text-slate-300">You built the 2048 tile.</p> : null}
              {phase === "lost" ? <p className="mt-2 text-sm text-slate-300">The board is full with no matching neighbors.</p> : null}
              <button
                type="button"
                onClick={phase === "won" ? () => setPhase("playing") : startGame}
                className="mt-4 rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-slate-950"
              >
                {phase === "won" ? "Keep playing" : phase === "lost" ? "Play again" : "Start 2048"}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 sm:mt-3 sm:gap-3">
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
      <div className="mt-3 rounded-[24px] border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
        {phase === "idle"
          ? "Merge matching tiles and chase 2048."
          : phase === "lost"
            ? "No legal slide remains. Start a fresh board and protect open cells longer."
            : phase === "won"
              ? "2048 reached. Continue if you want to build an even larger tile."
          : has2048
            ? "You hit 2048. Keep stacking for a bigger board."
            : `Mode ${difficulty}. Slide the board and stack bigger numbers.`}
      </div>
    </div>
  );
}
