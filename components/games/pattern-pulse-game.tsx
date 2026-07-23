"use client";

import { useEffect, useRef, useState } from "react";

const pads = [
  { id: 0, label: "North", color: "bg-cyan-400" },
  { id: 1, label: "East", color: "bg-orange-400" },
  { id: 2, label: "South", color: "bg-fuchsia-400" },
  { id: 3, label: "West", color: "bg-lime-400" },
];

const padSequenceSeed = [0, 3, 1, 2, 1, 0, 2, 3, 2, 1, 3, 0];

export function PatternPulseGame() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "showing" | "playing" | "over">(
    "idle",
  );
  const [bestRound, setBestRound] = useState(0);
  const seedIndex = useRef(0);

  useEffect(() => {
    if (status !== "showing" || sequence.length === 0) return;

    let step = 0;
    const interval = window.setInterval(() => {
      const pad = sequence[step];
      setActivePad(pad);
      window.setTimeout(() => setActivePad(null), 320);
      step += 1;

      if (step >= sequence.length) {
        window.clearInterval(interval);
        window.setTimeout(() => setStatus("playing"), 380);
      }
    }, 700);

    return () => window.clearInterval(interval);
  }, [sequence, status]);

  function addRound(nextSequence = sequence) {
    const nextPad = padSequenceSeed[seedIndex.current % padSequenceSeed.length];
    seedIndex.current += 1;
    const extended = [...nextSequence, nextPad];
    setSequence(extended);
    setPlayerIndex(0);
    setStatus("showing");
  }

  function startGame() {
    seedIndex.current = 0;
    setSequence([]);
    setPlayerIndex(0);
    setStatus("idle");
    window.setTimeout(() => addRound([]), 120);
  }

  function handlePadClick(padId: number) {
    if (status !== "playing") return;

    if (sequence[playerIndex] !== padId) {
      setStatus("over");
      setBestRound((current) => Math.max(current, Math.max(sequence.length - 1, 0)));
      return;
    }

    const nextIndex = playerIndex + 1;
    if (nextIndex === sequence.length) {
      setBestRound((current) => Math.max(current, sequence.length));
      window.setTimeout(() => addRound(sequence), 450);
      return;
    }

    setPlayerIndex(nextIndex);
  }

  return (
    <div className="rounded-[30px] border border-white/10 bg-slate-950 p-4 text-white">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-200/70">
            Sequence game
          </p>
          <p className="text-xl font-semibold">Best round: {bestRound}</p>
        </div>
        <button
          type="button"
          onClick={startGame}
          className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950"
        >
          {status === "idle" ? "Start sequence" : "Restart"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {pads.map((pad) => {
          const isActive = activePad === pad.id;
          return (
            <button
              key={pad.id}
              type="button"
              onClick={() => handlePadClick(pad.id)}
              className={`rounded-[28px] p-8 text-left transition ${
                isActive ? `${pad.color} scale-[1.02] text-slate-950` : "bg-white/6"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.25em] text-white/60">
                Pad {pad.id + 1}
              </p>
              <p className="mt-4 text-2xl font-semibold">{pad.label}</p>
            </button>
          );
        })}
      </div>
      <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        {status === "idle" && "Watch the pattern, then replay it pad by pad."}
        {status === "showing" && "Memorize the order before your turn begins."}
        {status === "playing" && "Your turn. Repeat the flashing order exactly."}
        {status === "over" && "Wrong pad. Restart and push to a longer sequence."}
      </div>
    </div>
  );
}
