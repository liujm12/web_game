"use client";

import { useEffect, useState } from "react";

const cellCount = 12;
const roundSeconds = 20;

function getNextTarget(currentTarget: number | null) {
  const nextTarget = Math.floor(Math.random() * cellCount);
  if (currentTarget === null || nextTarget !== currentTarget) {
    return nextTarget;
  }

  return (nextTarget + 1) % cellCount;
}

export function TargetBlitzGame() {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(roundSeconds);
  const [bestScore, setBestScore] = useState(0);
  const [activeCell, setActiveCell] = useState<number | null>(null);

  useEffect(() => {
    if (phase !== "playing") {
      return;
    }

    const interval = window.setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          window.clearInterval(interval);
          setPhase("over");
          setActiveCell(null);
          return 0;
        }

        return currentTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [phase]);

  function startGame() {
    setPhase("playing");
    setScore(0);
    setTimeLeft(roundSeconds);
    setActiveCell(getNextTarget(null));
  }

  function handleCellClick(index: number) {
    if (phase !== "playing") {
      return;
    }

    if (index !== activeCell) {
      return;
    }

    setScore((currentScore) => {
      const nextScore = currentScore + 1;
      setBestScore((currentBest) => Math.max(currentBest, nextScore));
      return nextScore;
    });
    setActiveCell((currentTarget) => getNextTarget(currentTarget));
  }

  return (
    <div className="rounded-[30px] border border-white/10 bg-slate-950 p-4 text-white">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">
            Tap challenge
          </p>
          <p className="text-xl font-semibold">{`Time: ${timeLeft}s`}</p>
        </div>
        <button
          type="button"
          onClick={startGame}
          className="rounded-full bg-emerald-300 px-4 py-2 text-sm font-semibold text-slate-950"
        >
          {phase === "playing" ? "Restart challenge" : "Start challenge"}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {Array.from({ length: cellCount }, (_, index) => {
          const isActive = phase === "playing" && activeCell === index;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleCellClick(index)}
              className={`aspect-square rounded-[22px] border transition ${
                isActive
                  ? "border-emerald-200 bg-emerald-300 text-slate-950 shadow-[0_0_30px_rgba(110,231,183,0.45)]"
                  : "border-white/10 bg-white/5 text-slate-500 hover:bg-white/10"
              }`}
              aria-label={isActive ? `Target ${index + 1}` : `Cell ${index + 1}`}
            >
              <span className="text-xl font-semibold">{isActive ? "GO" : ""}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          {`Score: ${score}`}
        </div>
        <div className="rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          {`Best: ${bestScore}`}
        </div>
      </div>
      <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        {phase === "idle" && "Tap the glowing target as fast as you can."}
        {phase === "playing" && "Keep tapping the active tile before time runs out."}
        {phase === "over" &&
          `Challenge over. You landed ${score} hits. Press start and chase a better score.`}
      </div>
    </div>
  );
}
