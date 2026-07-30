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
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">
            Tap challenge
          </p>
          <p className="text-xl font-semibold">{`Time ${timeLeft}s · Score ${score} · Best ${bestScore}`}</p>
        </div>
      </div>
      <div
        data-target-blitz-field="true"
        className="relative grid grid-cols-3 gap-3 sm:grid-cols-4"
      >
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
        {phase !== "playing" && (
          <div className="absolute inset-0 flex items-center justify-center rounded-[24px] bg-slate-950/60 p-4">
            <div className="rounded-[24px] border border-white/10 bg-slate-900/90 p-5 text-center">
              <p className="text-xs uppercase tracking-[0.26em] text-emerald-200/70">
                {phase === "over" ? "Challenge over" : "Ready"}
              </p>
              <h3 className="mt-2 text-2xl font-semibold">
                {phase === "over" ? `${score} hits` : "Target Blitz"}
              </h3>
              <p className="mt-2 text-sm text-slate-300">{`Best ${bestScore}`}</p>
              <button
                type="button"
                onClick={startGame}
                className="mt-4 rounded-full bg-emerald-300 px-5 py-2.5 text-sm font-semibold text-slate-950"
              >
                {phase === "over" ? "Play again" : "Start challenge"}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 rounded-[24px] border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
        {phase === "idle" && "Tap the glowing target as fast as you can."}
        {phase === "playing" && "Keep tapping the active tile before time runs out."}
        {phase === "over" &&
          `Challenge over. You landed ${score} hits. Press start and chase a better score.`}
      </div>
    </div>
  );
}
