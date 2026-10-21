"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { patrolEscapeLevels } from "@/data/patrol-escape-levels";
import {
  applyVehicleMove,
  createPatrolEscapeState,
  getLegalDeltas,
  getPatrolEscapeHint,
  getPatrolEscapeStars,
  isPatrolEscapeSolved,
  type PatrolEscapeMove,
  type PatrolEscapeState,
  type PatrolEscapeVehicle,
} from "@/lib/patrol-escape";
import { saveBestScore } from "@/lib/player-profile";

const LEVEL_BEST_KEY = "patrol-escape-level-bests-v1";

const vehicleColors: Record<PatrolEscapeVehicle["color"], string> = {
  police: "from-sky-200 via-white to-sky-400 text-slate-950",
  blue: "from-cyan-300 to-blue-600 text-white",
  amber: "from-amber-300 to-orange-500 text-slate-950",
  green: "from-lime-300 to-emerald-600 text-slate-950",
  rose: "from-rose-300 to-red-600 text-white",
  violet: "from-violet-300 to-purple-700 text-white",
  slate: "from-slate-300 to-slate-600 text-slate-950",
};

function readLevelBests() {
  try {
    const raw = window.localStorage?.getItem(LEVEL_BEST_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, number] =>
        Number.isInteger(entry[1]),
      ),
    );
  } catch {
    return {};
  }
}

function writeLevelBests(bests: Record<string, number>) {
  try {
    window.localStorage?.setItem(LEVEL_BEST_KEY, JSON.stringify(bests));
  } catch {
    return;
  }
}

function VehicleBody({ vehicle }: { vehicle: PatrolEscapeVehicle }) {
  const isPolice = vehicle.color === "police";

  return (
    <>
      <span className="absolute inset-[9%] rounded-[30%] border border-white/30 bg-black/12" />
      <span className={`absolute bg-slate-950/75 ${vehicle.orientation === "horizontal" ? "inset-y-[18%] left-[10%] w-[16%] rounded-l-full" : "inset-x-[18%] top-[10%] h-[16%] rounded-t-full"}`} />
      <span className={`absolute bg-slate-950/75 ${vehicle.orientation === "horizontal" ? "inset-y-[18%] right-[10%] w-[16%] rounded-r-full" : "inset-x-[18%] bottom-[10%] h-[16%] rounded-b-full"}`} />
      {isPolice ? (
        <span className={`absolute flex overflow-hidden rounded-full border border-white/50 ${vehicle.orientation === "horizontal" ? "left-1/2 top-[8%] h-[18%] w-[30%] -translate-x-1/2" : "left-[8%] top-1/2 h-[30%] w-[18%] -translate-y-1/2 flex-col"}`}>
          <span className="flex-1 bg-red-500" />
          <span className="flex-1 bg-blue-500" />
        </span>
      ) : null}
      <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.14em] drop-shadow-sm sm:text-xs">
        {isPolice ? "POLICE" : vehicle.length === 3 ? "TRUCK" : "CAR"}
      </span>
    </>
  );
}

export function PatrolEscapeGame() {
  const [levelIndex, setLevelIndex] = useState(0);
  const level = patrolEscapeLevels[levelIndex];
  const [state, setState] = useState(() => createPatrolEscapeState(level));
  const [history, setHistory] = useState<PatrolEscapeState[]>([]);
  const [selectedId, setSelectedId] = useState("police");
  const [hint, setHint] = useState<PatrolEscapeMove | null>(null);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [levelBests, setLevelBests] = useState<Record<string, number>>({});
  const [levelPickerOpen, setLevelPickerOpen] = useState(false);
  const [levelPage, setLevelPage] = useState(0);
  const boardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ vehicleId: string; startX: number; startY: number } | null>(null);
  const solved = isPatrolEscapeSolved(state);
  const selectedVehicle = state.vehicles.find((vehicle) => vehicle.id === selectedId);
  const best = levelBests[String(level.id)];

  useEffect(() => {
    const timer = window.setTimeout(() => setLevelBests(readLevelBests()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (solved) return;
    const timer = window.setInterval(
      () => setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [solved, startedAt]);

  const resetLevel = useCallback((nextIndex = levelIndex) => {
    const nextLevel = patrolEscapeLevels[nextIndex];
    setLevelIndex(nextIndex);
    setState(createPatrolEscapeState(nextLevel));
    setHistory([]);
    setSelectedId("police");
    setHint(null);
    setStartedAt(Date.now());
    setElapsedSeconds(0);
  }, [levelIndex]);

  const moveVehicle = useCallback((vehicleId: string, delta: number) => {
    if (solved) return;
    const next = applyVehicleMove(state, vehicleId, delta);
    if (next === state) return;
    if (isPatrolEscapeSolved(next)) {
      setLevelBests((current) => {
        const key = String(level.id);
        if (current[key] && current[key] <= next.moves) return current;
        const updated = { ...current, [key]: next.moves };
        writeLevelBests(updated);
        return updated;
      });
      const performanceScore = Math.max(1, 100_000 - next.moves * 500 - elapsedSeconds);
      saveBestScore(
        "patrol-escape",
        performanceScore,
        `Level ${level.id} · ${next.moves} moves`,
      );
    }
    setHistory((current) => [...current, state]);
    setState(next);
    setSelectedId(vehicleId);
    setHint(null);
  }, [elapsedSeconds, level.id, solved, state]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!selectedVehicle || solved) return;
      const delta =
        selectedVehicle.orientation === "horizontal"
          ? event.key === "ArrowLeft"
            ? -1
            : event.key === "ArrowRight"
              ? 1
              : 0
          : event.key === "ArrowUp"
            ? -1
            : event.key === "ArrowDown"
              ? 1
              : 0;

      if (delta === 0) return;
      event.preventDefault();
      moveVehicle(selectedVehicle.id, delta);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveVehicle, selectedVehicle, solved]);

  const legalDeltas = useMemo(
    () => (selectedVehicle ? getLegalDeltas(state, selectedVehicle.id) : []),
    [selectedVehicle, state],
  );

  function handlePointerDown(event: React.PointerEvent<HTMLButtonElement>, vehicleId: string) {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = { vehicleId, startX: event.clientX, startY: event.clientY };
    setSelectedId(vehicleId);
  }

  function handlePointerUp(event: React.PointerEvent<HTMLButtonElement>, vehicle: PatrolEscapeVehicle) {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag || drag.vehicleId !== vehicle.id || !boardRef.current) return;

    const cellSize = boardRef.current.getBoundingClientRect().width / 6;
    const distance = vehicle.orientation === "horizontal"
      ? event.clientX - drag.startX
      : event.clientY - drag.startY;
    const requestedDelta = Math.round(distance / cellSize);
    if (requestedDelta === 0) return;

    const allowed = getLegalDeltas(state, vehicle.id);
    const sameDirection = allowed.filter((delta) => Math.sign(delta) === Math.sign(requestedDelta));
    const clamped = sameDirection.reduce((closest, delta) =>
      Math.abs(delta) <= Math.abs(requestedDelta) && Math.abs(delta) > Math.abs(closest)
        ? delta
        : closest,
    0);
    if (clamped !== 0) moveVehicle(vehicle.id, clamped);
  }

  function undoMove() {
    const previous = history.at(-1);
    if (!previous) return;
    setState(previous);
    setHistory((current) => current.slice(0, -1));
    setHint(null);
  }

  function showHint() {
    const nextHint = getPatrolEscapeHint(state);
    setHint(nextHint);
    if (nextHint) setSelectedId(nextHint.vehicleId);
  }

  function openLevelPicker() {
    setLevelPage(Math.floor(levelIndex / 20));
    setLevelPickerOpen(true);
  }

  function chooseLevel(index: number) {
    resetLevel(index);
    setLevelPickerOpen(false);
  }

  const visibleLevels = patrolEscapeLevels.slice(levelPage * 20, levelPage * 20 + 20);

  return (
    <div className="rounded-[30px] border border-cyan-200/15 bg-[#07101c] p-4 text-white shadow-[0_26px_80px_rgba(2,8,23,0.5)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200/65">Original traffic puzzle</p>
          <h2 className="mt-2 text-3xl font-black">Patrol Escape</h2>
          <p className="mt-1 text-sm text-slate-400">Level {level.id} of {patrolEscapeLevels.length} · {level.title} · {level.difficulty}</p>
        </div>
        <div className="flex gap-2 text-center">
          <div className="min-w-20 rounded-2xl border border-white/10 bg-white/5 px-3 py-2"><span className="block text-[10px] uppercase tracking-widest text-slate-500">Moves</span><strong>{state.moves}</strong></div>
          <div className="min-w-20 rounded-2xl border border-white/10 bg-white/5 px-3 py-2"><span className="block text-[10px] uppercase tracking-widest text-slate-500">Best</span><strong>{best ?? "—"}</strong></div>
          <div className="min-w-20 rounded-2xl border border-white/10 bg-white/5 px-3 py-2"><span className="block text-[10px] uppercase tracking-widest text-slate-500">Time</span><strong>{elapsedSeconds}s</strong></div>
        </div>
      </div>

      <div className="mt-5 rounded-[28px] border border-cyan-200/15 bg-gradient-to-b from-slate-800 to-slate-950 p-3 sm:p-5">
        <div ref={boardRef} className="relative mx-auto aspect-square w-full max-w-[620px] touch-none overflow-visible rounded-[24px] border-4 border-slate-600 bg-[#182434] shadow-inner">
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
            {Array.from({ length: 36 }, (_, index) => <span key={index} className="border border-white/[0.045]" />)}
          </div>
          <div className="pointer-events-none absolute -right-[5%] top-[33.333%] h-[16.667%] w-[9%] bg-cyan-300/75 shadow-[0_0_24px_rgba(103,232,249,0.7)]" aria-hidden="true" />
          <span className="pointer-events-none absolute -right-[4%] top-[29%] text-[9px] font-black uppercase tracking-widest text-cyan-100 sm:text-xs">Exit</span>

          {state.vehicles.map((vehicle) => {
            const selected = selectedId === vehicle.id;
            const hinted = hint?.vehicleId === vehicle.id;
            const width = vehicle.orientation === "horizontal" ? vehicle.length * (100 / 6) : 100 / 6;
            const height = vehicle.orientation === "vertical" ? vehicle.length * (100 / 6) : 100 / 6;
            return (
              <button
                key={vehicle.id}
                type="button"
                aria-label={vehicle.label}
                aria-pressed={selected}
                onClick={() => setSelectedId(vehicle.id)}
                onPointerDown={(event) => handlePointerDown(event, vehicle.id)}
                onPointerUp={(event) => handlePointerUp(event, vehicle)}
                className={`absolute flex select-none items-center justify-center overflow-hidden rounded-[18px] border-2 bg-gradient-to-br shadow-[0_8px_18px_rgba(2,6,23,0.45)] transition-[left,top,box-shadow,transform] duration-150 ${vehicleColors[vehicle.color]} ${selected ? "z-20 border-white ring-2 ring-cyan-300/75" : "z-10 border-white/30"} ${hinted ? "animate-pulse ring-4 ring-amber-300" : ""}`}
                style={{
                  left: `${vehicle.col * (100 / 6)}%`,
                  top: `${vehicle.row * (100 / 6)}%`,
                  width: `${width}%`,
                  height: `${height}%`,
                }}
              >
                <VehicleBody vehicle={vehicle} />
              </button>
            );
          })}

          {solved ? (
            <div className="absolute inset-3 z-30 flex items-center justify-center rounded-[22px] bg-slate-950/84 p-5 text-center backdrop-blur-sm">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Exit cleared!</p>
                <p className="mt-3 text-4xl font-black">{"★".repeat(getPatrolEscapeStars(state.moves, level.par))}</p>
                <p className="mt-3 text-2xl font-black">{state.moves} moves</p>
                <p className="mt-1 text-sm text-slate-400">Par {level.par} · {elapsedSeconds} seconds</p>
                <button type="button" onClick={() => resetLevel((levelIndex + 1) % patrolEscapeLevels.length)} className="mt-5 rounded-full bg-cyan-300 px-6 py-3 font-black text-cyan-950 hover:bg-orange-300" aria-label="Next level">Next level</button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mx-auto mt-4 flex max-w-[620px] flex-wrap items-center justify-between gap-3">
          <p className="text-sm leading-6 text-slate-300">
            {hint
              ? `Hint: move ${state.vehicles.find((vehicle) => vehicle.id === hint.vehicleId)?.label.toLowerCase()} ${hint.delta < 0 ? "back" : "forward"}.`
              : selectedVehicle
                ? `${selectedVehicle.label}: ${legalDeltas.length > 0 ? "drag along its lane or use the arrow keys." : "blocked in both directions."}`
                : "Drag a vehicle along its lane."}
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={undoMove} disabled={history.length === 0} aria-label="Undo move" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-black disabled:cursor-not-allowed disabled:opacity-35">Undo</button>
            <button type="button" onClick={() => resetLevel()} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-black">Restart</button>
            <button type="button" onClick={showHint} className="rounded-full border border-amber-200/20 bg-amber-300/10 px-4 py-2 text-sm font-black text-amber-100">Hint</button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200/65">Mission map</p>
          <p className="mt-1 text-sm text-slate-400">120 distinct, solver-verified traffic puzzles.</p>
        </div>
        <button type="button" onClick={openLevelPicker} aria-label="Choose level" className="rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-black text-cyan-950 transition hover:bg-orange-300">
          Choose level · {level.id}/{patrolEscapeLevels.length}
        </button>
      </div>

      {levelPickerOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/78 p-0 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(event) => {
          if (event.currentTarget === event.target) setLevelPickerOpen(false);
        }}>
          <section role="dialog" aria-modal="true" aria-label="Choose a Patrol Escape level" className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-[28px] border border-cyan-200/20 bg-[#091321] p-4 shadow-[0_-24px_80px_rgba(2,8,23,0.7)] sm:rounded-[28px] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200/65">Mission map</p>
                <h3 className="mt-2 text-2xl font-black">Choose a level</h3>
                <p className="mt-1 text-sm text-slate-400">Completed levels show your best move count.</p>
              </div>
              <button type="button" onClick={() => setLevelPickerOpen(false)} aria-label="Close level picker" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-slate-300">×</button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {Array.from({ length: Math.ceil(patrolEscapeLevels.length / 20) }, (_, page) => {
                const start = page * 20 + 1;
                const end = start + 19;
                return (
                  <button key={page} type="button" onClick={() => setLevelPage(page)} aria-label={`Show levels ${start} to ${end}`} className={`rounded-xl px-2 py-2 text-xs font-black sm:text-sm ${page === levelPage ? "bg-cyan-300 text-cyan-950" : "border border-white/10 bg-white/5 text-slate-300"}`}>
                    {start}–{end}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5">
              {visibleLevels.map((candidate) => {
                const candidateIndex = candidate.id - 1;
                const candidateBest = levelBests[String(candidate.id)];
                const active = candidateIndex === levelIndex;
                return (
                  <button key={candidate.id} type="button" onClick={() => chooseLevel(candidateIndex)} aria-label={`Play level ${candidate.id}: ${candidate.title}`} className={`min-h-16 rounded-2xl border px-2 py-2 text-left transition ${active ? "border-cyan-200 bg-cyan-300 text-cyan-950" : candidateBest ? "border-emerald-300/35 bg-emerald-300/10 text-white" : "border-white/10 bg-white/[0.045] text-white hover:border-cyan-200/35"}`}>
                    <span className="block text-lg font-black">{candidate.id}</span>
                    <span className={`block text-[10px] font-bold uppercase tracking-wider ${active ? "text-cyan-900/70" : "text-slate-400"}`}>
                      {candidateBest ? `Best ${candidateBest}` : candidate.difficulty}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
