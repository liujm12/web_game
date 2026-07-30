"use client";

import { useMemo, useState } from "react";

function shuffleNumbers() {
  return Array.from({ length: 9 }, (_, index) => index + 1).sort(
    () => Math.random() - 0.5,
  );
}

function orderedNumbers() {
  return Array.from({ length: 9 }, (_, index) => index + 1);
}

export function NumberRushGame() {
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [numbers, setNumbers] = useState<number[]>(() => orderedNumbers());
  const [nextNumber, setNextNumber] = useState(1);
  const [mistakes, setMistakes] = useState(0);
  const [roundsCleared, setRoundsCleared] = useState(0);

  const clearedNumbers = useMemo(
    () => new Set(Array.from({ length: nextNumber - 1 }, (_, index) => index + 1)),
    [nextNumber],
  );

  function startRound() {
    setNumbers(shuffleNumbers());
    setNextNumber(1);
    setMistakes(0);
    setPhase("playing");
  }

  function handleNumberClick(value: number) {
    if (phase !== "playing") {
      return;
    }

    if (value !== nextNumber) {
      setMistakes((currentMistakes) => currentMistakes + 1);
      return;
    }

    if (value === 9) {
      setRoundsCleared((currentRounds) => currentRounds + 1);
      setNextNumber(10);
      setPhase("over");
      return;
    }

    setNextNumber((currentNumber) => currentNumber + 1);
  }

  return (
    <div className="rounded-[30px] border border-white/10 bg-slate-950 p-4 text-white">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-violet-200/70">
            Order game
          </p>
          <p className="text-xl font-semibold">{`Next ${Math.min(nextNumber, 9)} · Mistakes ${mistakes} · Cleared ${roundsCleared}`}</p>
        </div>
      </div>
      <div data-number-rush-board="true" className="relative grid grid-cols-3 gap-3">
        {numbers.map((value) => {
          const isCleared = clearedNumbers.has(value);

          return (
            <button
              key={value}
              type="button"
              onClick={() => handleNumberClick(value)}
              className={`aspect-square rounded-[22px] border text-2xl font-semibold transition ${
                isCleared
                  ? "border-violet-300/30 bg-violet-300/15 text-violet-100"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              {value}
            </button>
          );
        })}
        {phase !== "playing" && (
          <div className="absolute inset-0 flex items-center justify-center rounded-[24px] bg-slate-950/60 p-4">
            <div className="rounded-[24px] border border-white/10 bg-slate-900/90 p-5 text-center">
              <p className="text-xs uppercase tracking-[0.26em] text-violet-200/70">
                {phase === "over" ? "Round clear" : "Ready"}
              </p>
              <h3 className="mt-2 text-2xl font-semibold">
                {phase === "over" ? `${mistakes} mistakes` : "Number Rush"}
              </h3>
              <button
                type="button"
                onClick={startRound}
                className="mt-4 rounded-full bg-violet-300 px-5 py-2.5 text-sm font-semibold text-slate-950"
              >
                {phase === "over" ? "Play again" : "Start round"}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 rounded-[24px] border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
        {phase === "idle" && "Tap numbers from low to high as quickly as you can."}
        {phase === "playing" && "Stay in order. Wrong taps add mistakes but do not end the round."}
        {phase === "over" &&
          `Board cleared with ${mistakes} mistakes. Start another round and try to clean it up.`}
      </div>
    </div>
  );
}
