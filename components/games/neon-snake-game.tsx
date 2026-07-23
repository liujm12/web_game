"use client";

import { useEffect, useState } from "react";

const boardSize = 12;
const totalCells = boardSize * boardSize;
type Difficulty = "Easy" | "Normal" | "Hard";
const speedLabelByMode: Record<Difficulty, string> = {
  Easy: "Slow",
  Normal: "Balanced",
  Hard: "Fast",
};
const tickByMode: Record<Difficulty, number> = {
  Easy: 290,
  Normal: 220,
  Hard: 150,
};

function randomFreeCell(blocked: number[]) {
  const freeCells = Array.from({ length: totalCells }, (_, index) => index).filter(
    (index) => !blocked.includes(index),
  );

  return freeCells[Math.floor(Math.random() * freeCells.length)] ?? 0;
}

export function NeonSnakeGame() {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [snake, setSnake] = useState<number[]>([27, 28, 29]);
  const [direction, setDirection] = useState<"up" | "down" | "left" | "right">("right");
  const [fruit, setFruit] = useState(34);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>("Normal");

  useEffect(() => {
    if (phase !== "playing") {
      return;
    }

    const interval = window.setInterval(() => {
      setSnake((currentSnake) => {
        const head = currentSnake[currentSnake.length - 1];
        const row = Math.floor(head / boardSize);
        const column = head % boardSize;

        const offsets = {
          up: [-1, 0],
          down: [1, 0],
          left: [0, -1],
          right: [0, 1],
        } as const;

        const [rowOffset, columnOffset] = offsets[direction];
        const nextRow = row + rowOffset;
        const nextColumn = column + columnOffset;

        if (
          nextRow < 0 ||
          nextRow >= boardSize ||
          nextColumn < 0 ||
          nextColumn >= boardSize
        ) {
          setPhase("over");
          return currentSnake;
        }

        const nextHead = nextRow * boardSize + nextColumn;
        if (currentSnake.includes(nextHead)) {
          setPhase("over");
          return currentSnake;
        }

        const grew = nextHead === fruit;
        const nextSnake = grew
          ? [...currentSnake, nextHead]
          : [...currentSnake.slice(1), nextHead];

        if (grew) {
          setScore((currentScore) => currentScore + 10);
          setFruit(randomFreeCell(nextSnake));
        }

        return nextSnake;
      });
    }, tickByMode[difficulty]);

    return () => window.clearInterval(interval);
  }, [difficulty, direction, fruit, phase]);

  function startGame() {
    setSnake([27, 28, 29]);
    setDirection("right");
    setFruit(34);
    setScore(0);
    setPhase("playing");
  }

  return (
    <div className="rounded-[30px] border border-white/10 bg-slate-950 p-4 text-white">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-lime-200/70">
            Snake run
          </p>
          <p className="text-xl font-semibold">{`Score: ${score}`}</p>
        </div>
        <button
          type="button"
          onClick={startGame}
          className="rounded-full bg-lime-300 px-4 py-2 text-sm font-semibold text-slate-950"
        >
          {phase === "playing" ? "Reset snake" : "Start snake"}
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
                ? "bg-lime-300 text-slate-950"
                : "border border-white/10 bg-white/5 text-slate-300"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
      <div
        className="mx-auto grid max-w-[720px] gap-1 rounded-[24px] border border-white/10 bg-white/5 p-3"
        style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: totalCells }, (_, index) => {
          const isHead = snake[snake.length - 1] === index;
          const isSnake = snake.includes(index);
          const isFruit = fruit === index;

          return (
            <div
              key={index}
              data-snake-cell="true"
              className={`aspect-square rounded-xl border border-white/8 ${
                isHead
                  ? "bg-lime-300 shadow-[0_0_18px_rgba(190,242,100,0.35)]"
                  : isSnake
                    ? "bg-lime-400/55"
                    : isFruit
                      ? "bg-orange-300"
                      : "bg-white/5"
              }`}
            />
          );
        })}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div />
        <button
          type="button"
          onClick={() => setDirection("up")}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold"
        >
          Up
        </button>
        <div />
        <button
          type="button"
          onClick={() => setDirection("left")}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold"
        >
          Left
        </button>
        <button
          type="button"
          onClick={() => setDirection("down")}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold"
        >
          Down
        </button>
        <button
          type="button"
          onClick={() => setDirection("right")}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold"
        >
          Right
        </button>
      </div>
      <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        {phase === "idle" && "Use the arrow buttons to guide the snake to fruit."}
        {phase === "playing" && "Keep moving, eat the orange fruit, and avoid walls or your own trail."}
        {phase === "over" && "Crash. Hit start and go for a longer run."}
      </div>
      <div className="mt-3 rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        {`Speed: ${speedLabelByMode[difficulty]}`}
      </div>
    </div>
  );
}
