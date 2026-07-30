"use client";

import { useEffect, useState } from "react";

const fieldWidth = 100;
const fieldHeight = 100;
const paddleWidth = 18;
const paddleStep = 8;
const paddleY = 92;
const ballRadius = 1.8;
type Difficulty = "Easy" | "Normal" | "Hard";

type Brick = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  alive: boolean;
};

type BreakoutState = {
  phase: "idle" | "playing" | "over" | "won";
  difficulty: Difficulty;
  paddleX: number;
  ballX: number;
  ballY: number;
  velocityX: number;
  velocityY: number;
  score: number;
  lives: number;
  bricks: Brick[];
};

function createBricks() {
  return Array.from({ length: 5 }, (_, rowIndex) =>
    Array.from({ length: 8 }, (_, columnIndex) => ({
      id: rowIndex * 8 + columnIndex,
      x: 4 + columnIndex * 11.5,
      y: 8 + rowIndex * 7,
      width: 9.5,
      height: 4.5,
      alive: true,
    })),
  ).flat();
}

function getDifficultyConfig(difficulty: Difficulty) {
  switch (difficulty) {
    case "Easy":
      return { velocityX: 1.8, velocityY: -2.2, lives: 4 };
    case "Hard":
      return { velocityX: 2.8, velocityY: -3.3, lives: 2 };
    default:
      return { velocityX: 2.3, velocityY: -2.8, lives: 3 };
  }
}

function createInitialState(difficulty: Difficulty): BreakoutState {
  const config = getDifficultyConfig(difficulty);
  return {
    phase: "idle",
    difficulty,
    paddleX: 41,
    ballX: 50,
    ballY: 84,
    velocityX: config.velocityX,
    velocityY: config.velocityY,
    score: 0,
    lives: config.lives,
    bricks: createBricks(),
  };
}

export function BreakoutBlitzGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("Normal");
  const [game, setGame] = useState<BreakoutState>(() => createInitialState("Normal"));

  useEffect(() => {
    if (game.phase !== "playing") {
      return;
    }

    const interval = window.setInterval(() => {
      setGame((currentGame) => {
        if (currentGame.phase !== "playing") {
          return currentGame;
        }

        let nextX = currentGame.ballX + currentGame.velocityX;
        let nextY = currentGame.ballY + currentGame.velocityY;
        let nextVelocityX = currentGame.velocityX;
        let nextVelocityY = currentGame.velocityY;
        let nextScore = currentGame.score;
        let nextLives = currentGame.lives;
        let nextPhase: BreakoutState["phase"] = currentGame.phase;
        let nextBricks = currentGame.bricks;

        if (nextX <= ballRadius || nextX >= fieldWidth - ballRadius) {
          nextVelocityX *= -1;
          nextX = Math.min(
            fieldWidth - ballRadius,
            Math.max(ballRadius, currentGame.ballX + nextVelocityX),
          );
        }

        if (nextY <= ballRadius) {
          nextVelocityY *= -1;
          nextY = ballRadius + 1;
        }

        const hitBrick = currentGame.bricks.find(
          (brick) =>
            brick.alive &&
            nextX >= brick.x &&
            nextX <= brick.x + brick.width &&
            nextY >= brick.y &&
            nextY <= brick.y + brick.height,
        );

        if (hitBrick) {
          nextBricks = currentGame.bricks.map((brick) =>
            brick.id === hitBrick.id ? { ...brick, alive: false } : brick,
          );
          nextScore += 10;
          if (nextScore % 40 === 0) {
            nextVelocityX = nextVelocityX > 0 ? nextVelocityX + 0.15 : nextVelocityX - 0.15;
            nextVelocityY = nextVelocityY > 0 ? nextVelocityY + 0.2 : nextVelocityY - 0.2;
          }
          nextVelocityY *= -1;
          nextY = currentGame.ballY + nextVelocityY;

          if (nextBricks.every((brick) => !brick.alive)) {
            nextPhase = "won";
          }
        }

        const paddleHit =
          nextVelocityY > 0 &&
          nextY >= paddleY - 2 &&
          nextY <= paddleY + 2 &&
          nextX >= currentGame.paddleX &&
          nextX <= currentGame.paddleX + paddleWidth;

        if (paddleHit) {
          const offset =
            (nextX - (currentGame.paddleX + paddleWidth / 2)) / (paddleWidth / 2);
          nextVelocityX = Number((offset * 2.2).toFixed(2));
          nextVelocityY = -Math.abs(nextVelocityY);
          nextY = paddleY - 3;
        }

        if (nextY >= fieldHeight - ballRadius) {
          nextLives -= 1;
          if (nextLives <= 0) {
            nextPhase = "over";
          }

          return {
            ...currentGame,
            phase: nextPhase,
            lives: nextLives,
            score: nextScore,
            bricks: nextBricks,
            ballX: 50,
            ballY: 84,
            velocityX: currentGame.velocityX > 0 ? currentGame.velocityX : Math.abs(currentGame.velocityX),
            velocityY: -Math.abs(currentGame.velocityY),
          };
        }

        return {
          ...currentGame,
          phase: nextPhase,
          score: nextScore,
          lives: nextLives,
          bricks: nextBricks,
          ballX: nextX,
          ballY: nextY,
          velocityX: nextVelocityX,
          velocityY: nextVelocityY,
        };
      });
    }, 320);

    return () => window.clearInterval(interval);
  }, [game.phase]);

  function startGame() {
    setGame({ ...createInitialState(difficulty), phase: "playing" });
  }

  function movePaddle(direction: -1 | 1) {
    setGame((currentGame) => ({
      ...currentGame,
      paddleX:
        direction < 0
          ? Math.max(0, currentGame.paddleX - paddleStep)
          : Math.min(100 - paddleWidth, currentGame.paddleX + paddleStep),
    }));
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
        movePaddle(-1);
      } else if (key === "arrowright" || key === "d") {
        movePaddle(1);
      } else {
        startGame();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="rounded-[26px] border border-white/10 bg-slate-950 p-3 text-white sm:rounded-[30px] sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-3 sm:mb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-sky-200/70">
            Brick breaker
          </p>
          <p className="text-xl font-semibold">{`Score: ${game.score}`}</p>
        </div>
        <button
          type="button"
          onClick={startGame}
          className="rounded-full bg-sky-300 px-4 py-2 text-sm font-semibold text-slate-950"
        >
          {game.phase === "playing" ? "Reset round" : "Launch ball"}
        </button>
      </div>
      <div className="mb-3 flex flex-wrap gap-2 sm:mb-5">
        {(["Easy", "Normal", "Hard"] as Difficulty[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setDifficulty(mode)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              difficulty === mode
                ? "bg-sky-300 text-slate-950"
                : "border border-white/10 bg-white/5 text-slate-300"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2 sm:mb-5 sm:gap-3">
        <button
          type="button"
          onClick={() => movePaddle(-1)}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold"
        >
          Paddle left
        </button>
        <button
          type="button"
          onClick={() => movePaddle(1)}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold"
        >
          Paddle right
        </button>
      </div>
      <div
        data-breakout-field="true"
        className="relative mx-auto h-[52svh] min-h-[320px] max-h-[440px] w-full max-w-[760px] overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),_rgba(15,23,42,0.98)_58%)] sm:h-[460px] sm:rounded-[28px]"
      >
        {game.bricks
          .filter((brick) => brick.alive)
          .map((brick) => (
            <div
              key={brick.id}
              className="absolute rounded-lg border border-white/20 bg-gradient-to-r from-orange-300 via-amber-300 to-rose-300 shadow-[0_8px_18px_rgba(251,146,60,0.28)]"
              style={{
                left: `${brick.x}%`,
                top: `${brick.y}%`,
                width: `${brick.width}%`,
                height: `${brick.height}%`,
              }}
            />
          ))}

        <div
          data-breakout-paddle="true"
          className="absolute h-3 rounded-full bg-fuchsia-300 shadow-[0_10px_25px_rgba(232,121,249,0.4)]"
          style={{
            left: `${game.paddleX}%`,
            top: `${paddleY}%`,
            width: `${paddleWidth}%`,
          }}
        />

        <div
          data-breakout-ball="true"
          className="absolute rounded-full bg-sky-300 shadow-[0_0_24px_rgba(125,211,252,0.8)]"
          style={{
            left: `calc(${game.ballX}% - 8px)`,
            top: `calc(${game.ballY}% - 8px)`,
            width: "16px",
            height: "16px",
          }}
        />

        {game.phase === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/45">
            <div className="rounded-[24px] border border-white/10 bg-slate-900/80 px-6 py-5 text-center">
              <h3 className="text-2xl font-semibold">Ready to break bricks?</h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
                Launch the ball, move the paddle, and clear the wall across a much
                wider arcade field.
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 grid gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3">
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          {`Lives: ${game.lives}`}
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          {`Mode: ${difficulty}`}
        </div>
      </div>
      <div className="mt-3 rounded-[22px] border border-white/10 bg-white/5 p-3 text-sm text-slate-300 sm:mt-5 sm:rounded-[24px] sm:p-4">
        {game.phase === "idle" && "Break every brick and protect the paddle."}
        {game.phase === "playing" &&
          "Use the paddle buttons to keep the ball alive and clear the full brick wall."}
        {game.phase === "over" && "Ball lost. Launch another round and try a cleaner clear."}
        {game.phase === "won" && "Board clear. Launch again and beat your last score."}
      </div>
    </div>
  );
}
