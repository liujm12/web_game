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
  const [phase, setPhase] = useState<"idle" | "ready" | "playing" | "over">("idle");
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
    setPhase("ready");
  }

  function chooseDirection(nextDirection: "up" | "down" | "left" | "right") {
    setDirection(nextDirection);
    if (phase === "ready") {
      setPhase("playing");
    }
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      const handledKeys = [
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
        "w",
        "a",
        "s",
        "d",
        " ",
        "enter",
        "r",
      ];

      if (!handledKeys.includes(key)) {
        return;
      }

      event.preventDefault();

      if (key === " " || key === "enter" || key === "r") {
        startGame();
      } else if (key === "arrowup" || key === "w") {
        chooseDirection("up");
      } else if (key === "arrowdown" || key === "s") {
        chooseDirection("down");
      } else if (key === "arrowleft" || key === "a") {
        chooseDirection("left");
      } else {
        chooseDirection("right");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="rounded-[30px] border border-white/10 bg-slate-950 p-4 text-white">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-lime-200/70">
            Snake run
          </p>
          <p className="text-xl font-semibold">{`Score ${score} · ${speedLabelByMode[difficulty]}`}</p>
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
                ? "bg-lime-300 text-slate-950"
                : "border border-white/10 bg-white/5 text-slate-300"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
      <div
        data-snake-board="true"
        className="relative mx-auto grid max-w-[720px] gap-1 rounded-[24px] border border-white/10 bg-white/5 p-3"
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
        {phase !== "playing" && (
          <div className="absolute inset-0 flex items-center justify-center rounded-[24px] bg-slate-950/60 p-4">
            <div className="max-w-xs rounded-[24px] border border-white/10 bg-slate-900/90 p-5 text-center">
              {phase === "ready" ? (
                <p className="text-lg font-semibold">Choose a direction to start.</p>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-[0.26em] text-lime-200/70">
                    {phase === "over" ? "Game over" : "Ready"}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">
                    {phase === "over" ? `${score} points` : "Snake Run"}
                  </h3>
                  <button
                    type="button"
                    onClick={startGame}
                    className="mt-4 rounded-full bg-lime-300 px-5 py-2.5 text-sm font-semibold text-slate-950"
                  >
                    {phase === "over" ? "Play again" : "Start snake"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 sm:mt-3 sm:gap-3">
        <div />
        <button
          type="button"
          onClick={() => chooseDirection("up")}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold"
        >
          Up
        </button>
        <div />
        <button
          type="button"
          onClick={() => chooseDirection("left")}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold"
        >
          Left
        </button>
        <button
          type="button"
          onClick={() => chooseDirection("down")}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold"
        >
          Down
        </button>
        <button
          type="button"
          onClick={() => chooseDirection("right")}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold"
        >
          Right
        </button>
      </div>
      <div className="mt-3 rounded-[24px] border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
        {phase === "idle" && "Use the arrow buttons to guide the snake to fruit."}
        {phase === "ready" && "Pick any direction when your thumb is ready."}
        {phase === "playing" && "Keep moving, eat the orange fruit, and avoid walls or your own trail."}
        {phase === "over" && "Crash. Hit start and go for a longer run."}
      </div>
    </div>
  );
}
