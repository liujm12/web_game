"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const lanes = [18, 50, 82];

type FallingItem = {
  id: number;
  lane: number;
  top: number;
  type: "star" | "meteor";
};

export function MeteorSprintGame() {
  const [isRunning, setIsRunning] = useState(false);
  const [laneIndex, setLaneIndex] = useState(1);
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const itemId = useRef(1);
  const spawnCount = useRef(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = window.setInterval(() => {
      setItems((current) => {
        const moved = current
          .map((item) => ({ ...item, top: item.top + 11 }))
          .filter((item) => item.top <= 104);

        const playerLane = laneIndex;
        const caught = moved.filter(
          (item) => item.top >= 84 && item.top <= 99 && item.lane === playerLane,
        );

        if (caught.some((item) => item.type === "meteor")) {
          setGameOver(true);
          setIsRunning(false);
          return [];
        }

        const starsCaught = caught.filter((item) => item.type === "star").length;
        if (starsCaught > 0) {
          setScore((currentScore) => currentScore + starsCaught * 10);
        }

        return moved.filter(
          (item) =>
            !(item.top >= 84 && item.top <= 99 && item.lane === playerLane),
        );
      });

      spawnCount.current += 1;
      if (spawnCount.current % 2 === 0) {
        const nextLane = Math.floor(Math.random() * lanes.length);
        const type = Math.random() > 0.68 ? "meteor" : "star";

        setItems((current) => [
          ...current,
          { id: itemId.current++, lane: nextLane, top: -8, type },
        ]);
      }
    }, 260);

    return () => window.clearInterval(interval);
  }, [isRunning, laneIndex]);

  function startGame() {
    setLaneIndex(1);
    setScore(0);
    setItems([]);
    spawnCount.current = 0;
    setGameOver(false);
    setIsRunning(true);
  }

  const trackRows = useMemo(
    () => Array.from({ length: 5 }, (_, index) => index),
    [],
  );

  return (
    <div className="rounded-[30px] border border-white/10 bg-slate-950 p-4 text-white">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/70">
            Live game
          </p>
          <p className="text-xl font-semibold">Score: {score}</p>
        </div>
        <button
          type="button"
          onClick={startGame}
          className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950"
        >
          {gameOver ? "Restart run" : isRunning ? "Reset run" : "Start run"}
        </button>
      </div>
      <div className="relative h-[420px] overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.3),_rgba(15,23,42,0.95)_55%)]">
        {trackRows.map((row) => (
          <div
            key={row}
            className="absolute left-0 right-0 border-t border-white/10"
            style={{ top: `${row * 20}%` }}
          />
        ))}
        {lanes.map((left, index) => (
          <div
            key={left}
            className="absolute top-0 bottom-0 w-[2px] bg-white/10"
            style={{ left: `${left}%` }}
            data-active={laneIndex === index}
          />
        ))}

        {items.map((item) => (
          <div
            key={item.id}
            className={`absolute h-12 w-12 -translate-x-1/2 rounded-2xl text-2xl shadow-lg ${
              item.type === "meteor"
                ? "bg-orange-400/90 shadow-orange-400/30"
                : "bg-cyan-300/90 shadow-cyan-300/30"
            }`}
            style={{ left: `${lanes[item.lane]}%`, top: `${item.top}%` }}
          >
            <div className="flex h-full items-center justify-center">
              {item.type === "meteor" ? "☄" : "✦"}
            </div>
          </div>
        ))}

        <div
          className="absolute bottom-4 h-16 w-16 -translate-x-1/2 rounded-[24px] border border-white/20 bg-white/10 shadow-[0_12px_30px_rgba(34,211,238,0.35)] backdrop-blur"
          style={{ left: `${lanes[laneIndex]}%` }}
        >
          <div className="flex h-full items-center justify-center text-3xl">🚀</div>
        </div>

        {!isRunning && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/55">
            <div className="max-w-sm rounded-[28px] border border-white/10 bg-slate-900/90 p-6 text-center">
              <h3 className="text-2xl font-semibold">Ready for launch?</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Shift between lanes, catch glowing stars, and dodge every meteor.
              </p>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/65">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-6 text-center">
              <p className="text-xs uppercase tracking-[0.26em] text-orange-200/70">
                Run over
              </p>
              <h3 className="mt-2 text-3xl font-semibold">{score} points</h3>
              <p className="mt-2 text-sm text-slate-300">
                One more round usually goes better.
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setLaneIndex((current) => Math.max(0, current - 1))}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold"
        >
          Move left
        </button>
        <button
          type="button"
          onClick={() =>
            setLaneIndex((current) => Math.min(lanes.length - 1, current + 1))
          }
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold"
        >
          Move right
        </button>
      </div>
    </div>
  );
}
