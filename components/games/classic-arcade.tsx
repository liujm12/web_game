"use client";

import { useCallback, useEffect, useEffectEvent, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { GameShell, GameMessage, useBestScore } from "./classic-shared";
import {
  BLOCK_COLORS, FLAPPY, TETROMINOES, blockAction, blockGhost, blockInterval,
  createBlocks, createFlappy, flapBird, stepFlappy,
  type BlockAction, type Difficulty,
} from "@/lib/games/classic-arcade";

type Phase = "idle" | "playing" | "paused" | "over";

function Control({ primary, className = "", onClick, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean }) {
  return <button {...props} type="button" onClick={event => { event.currentTarget.blur(); onClick?.(event); }} className={`min-h-11 min-w-11 rounded-xl px-2 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 disabled:cursor-not-allowed disabled:opacity-35 ${primary ? "bg-cyan-300 text-slate-950 hover:bg-orange-300" : "border border-white/15 bg-white/5 text-slate-100 hover:bg-white/10"} ${className}`} />;
}

function DifficultyPicker({ value, onChange, disabled }: { value: Difficulty; onChange: (value: Difficulty) => void; disabled: boolean }) {
  return <label className="flex min-h-11 items-center gap-2 text-xs text-slate-300">Difficulty
    <select aria-label="Difficulty" value={value} disabled={disabled} onChange={event => onChange(event.target.value as Difficulty)} className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/15 bg-slate-900 px-2 text-sm text-white disabled:opacity-50">
      <option value="easy">Easy</option><option value="normal">Normal</option><option value="hard">Hard</option>
    </select>
  </label>;
}

function Overlay({ phase, score, title, children }: { phase: Phase; score: number; title: string; children: ReactNode }) {
  if (phase === "playing") return null;
  return <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-950/85 p-3">
    <div className="max-w-full text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-cyan-200">{phase === "idle" ? "Ready when you are" : phase === "paused" ? "Take a breath" : "Round complete"}</p>
      <h3 className="mt-2 text-xl font-black text-white">{phase === "paused" ? "Paused" : phase === "over" ? `${score} points` : title}</h3>
      <div className="mt-4 flex flex-wrap justify-center gap-2">{children}</div>
    </div>
  </div>;
}

function useArcadeState<Game extends { over: boolean }>(initial: () => Game) {
  const [game, setGame] = useState(initial);
  const gameRef = useRef(game);
  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const changePhase = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);
  const update = useCallback((next: Game) => {
    gameRef.current = next;
    setGame(next);
    if (next.over) changePhase("over");
  }, [changePhase]);
  const pause = useCallback(() => {
    if (phaseRef.current === "playing") changePhase("paused");
  }, [changePhase]);
  useEffect(() => {
    const hidden = () => { if (document.hidden) pause(); };
    window.addEventListener("blur", pause);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      window.removeEventListener("blur", pause);
      document.removeEventListener("visibilitychange", hidden);
    };
  }, [pause]);
  return { game, gameRef, phase, phaseRef, changePhase, update, pause };
}

function useArcadeKeys(handler: (key: string, repeated: boolean) => boolean) {
  const handle = useEffectEvent(handler);
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.target instanceof HTMLElement && event.target.closest("input, textarea, select, button, [contenteditable='true']")) return;
      if (handle(event.key, event.repeat)) event.preventDefault();
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
}

function useArcadeFrames(running: boolean, tick: (seconds: number) => void) {
  const onFrame = useEffectEvent(tick);
  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let previous: number | null = null;
    const animate = (now: number) => {
      if (previous !== null) onFrame(Math.min((now - previous) / 1000, 0.05));
      previous = now;
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [running]);
}

export function BlockDropGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const { game, gameRef, phase, phaseRef, changePhase, update, pause } = useArcadeState(() => createBlocks("normal", () => 0.5));
  const elapsed = useRef(0);
  const [best, saveBest] = useBestScore(`block-drop-${difficulty}`);
  useEffect(() => { saveBest(game.score); }, [game.score, saveBest]);

  function start() {
    elapsed.current = 0;
    update(createBlocks(difficulty));
    changePhase("playing");
  }
  function act(action: BlockAction) {
    if (phaseRef.current !== "playing") return;
    const next = blockAction(gameRef.current, action);
    if (next.queue !== gameRef.current.queue) elapsed.current = 0;
    update(next);
  }
  function togglePause() {
    if (phaseRef.current === "paused") changePhase("playing");
    else pause();
  }
  useArcadeFrames(phase === "playing", seconds => {
    if (phaseRef.current !== "playing") return;
    elapsed.current += seconds * 1000;
    const interval = blockInterval(gameRef.current.difficulty, gameRef.current.level);
    if (elapsed.current >= interval) {
      elapsed.current -= interval;
      act("tick");
    }
  });
  useArcadeKeys((key, repeated) => {
    if (key.toLowerCase() === "p" && (phaseRef.current === "playing" || phaseRef.current === "paused")) {
      if (!repeated) togglePause();
      return true;
    }
    const action = ({ ArrowLeft: "left", ArrowRight: "right", ArrowDown: "down", ArrowUp: "rotate", " ": "hard" } as Record<string, BlockAction>)[key];
    if (!action || phaseRef.current !== "playing") return false;
    if (!repeated || (action !== "hard" && action !== "rotate")) act(action);
    return true;
  });

  const ghost = blockGhost(game);
  const color = BLOCK_COLORS[Object.keys(TETROMINOES).indexOf(game.piece.kind) + 1];
  const nextKind = game.queue[0];
  return <GameShell title="Block Drop" eyebrow="Seven shapes. Clean lines." stats={`Score ${game.score} · Best ${best}`}>
    <div className="mb-2 flex items-center justify-between gap-2 text-xs text-slate-300">
      <span>Level {game.level} · {game.lines} lines</span>
      <div className="flex items-center gap-2">Next
        <svg viewBox="0 0 4 2" width="64" height="32" role="img" aria-label={`Next piece: ${nextKind}`}>
          {TETROMINOES[nextKind].map(([col, row]) => <rect key={`${col}-${row}`} x={col + 0.05} y={row + 0.05} width="0.9" height="0.9" rx="0.12" fill={BLOCK_COLORS[Object.keys(TETROMINOES).indexOf(nextKind) + 1]} />)}
        </svg>
      </div>
    </div>
    <div className="relative mx-auto overflow-hidden rounded-2xl border border-white/15 bg-slate-900" style={{ width: "min(100%, 240px, 25svh)" }} tabIndex={0} aria-label="Block Drop board. Arrow keys move and rotate. Space hard drops. P pauses.">
      <svg className="block h-auto w-full" viewBox="0 0 10 20" role="img" aria-label={`${game.lines} lines cleared. Current piece ${game.piece.kind}.`}>
        {game.board.flatMap((row, rowIndex) => row.map((cell, colIndex) => <rect key={`${rowIndex}-${colIndex}`} x={colIndex + 0.035} y={rowIndex + 0.035} width="0.93" height="0.93" rx="0.1" fill={BLOCK_COLORS[cell]} stroke="#334155" strokeWidth="0.025" />))}
        {!game.over && ghost.cells.map(([col, row]) => <rect key={`ghost-${col}-${row}`} x={ghost.x + col + 0.08} y={ghost.y + row + 0.08} width="0.84" height="0.84" rx="0.1" fill={color} fillOpacity="0.12" stroke={color} strokeOpacity="0.65" strokeWidth="0.045" />)}
        {!game.over && game.piece.cells.map(([col, row]) => <rect key={`piece-${col}-${row}`} x={game.piece.x + col + 0.035} y={game.piece.y + row + 0.035} width="0.93" height="0.93" rx="0.1" fill={color} />)}
      </svg>
      <Overlay phase={phase} score={game.score} title="Build. Clear. Repeat.">
        <Control primary onClick={phase === "paused" ? () => changePhase("playing") : start}>{phase === "paused" ? "Resume" : phase === "over" ? "Play again" : "Start blocks"}</Control>
      </Overlay>
    </div>
    <div className="mt-2 grid grid-cols-4 gap-2">
      <Control disabled={phase !== "playing"} aria-label="Move left" onClick={() => act("left")}>←</Control>
      <Control disabled={phase !== "playing"} aria-label="Rotate clockwise" onClick={() => act("rotate")}>Rotate</Control>
      <Control disabled={phase !== "playing"} aria-label="Soft drop" onClick={() => act("down")}>↓</Control>
      <Control disabled={phase !== "playing"} aria-label="Move right" onClick={() => act("right")}>→</Control>
    </div>
    <div className="mt-2 grid grid-cols-2 gap-2">
      <Control primary disabled={phase !== "playing"} onClick={() => act("hard")}>Hard drop</Control>
      <Control disabled={phase === "idle" || phase === "over"} onClick={togglePause}>{phase === "paused" ? "Resume" : "Pause"}</Control>
    </div>
    <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-2">
      <DifficultyPicker value={difficulty} onChange={value => { setDifficulty(value); update(createBlocks(value)); changePhase("idle"); }} disabled={phase === "playing" || phase === "paused"} />
      <Control disabled={phase === "idle"} onClick={start}>Restart</Control>
    </div>
    <GameMessage>← → move · ↑ rotate · ↓ soft drop · Space hard drop · P pause. Clear lines to level up. The outline shows your landing.</GameMessage>
  </GameShell>;
}

export function FlappyDashGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const { game, gameRef, phase, phaseRef, changePhase, update, pause } = useArcadeState(() => createFlappy("normal", () => 0.5));
  const [best, saveBest] = useBestScore(`flappy-dash-${difficulty}`);
  useEffect(() => { saveBest(game.score); }, [game.score, saveBest]);
  function start() {
    update(flapBird(createFlappy(difficulty)));
    changePhase("playing");
  }
  function flap() {
    if (phaseRef.current === "playing") update(flapBird(gameRef.current));
  }
  function togglePause() {
    if (phaseRef.current === "paused") changePhase("playing");
    else pause();
  }
  useArcadeFrames(phase === "playing", seconds => {
    if (phaseRef.current === "playing") update(stepFlappy(gameRef.current, seconds));
  });
  useArcadeKeys((key, repeated) => {
    if (key.toLowerCase() === "p" && (phaseRef.current === "playing" || phaseRef.current === "paused")) {
      if (!repeated) togglePause();
      return true;
    }
    if (key !== " " && key !== "ArrowUp") return false;
    if (phaseRef.current !== "playing") return false;
    if (!repeated) flap();
    return true;
  });
  return <GameShell title="Flappy Dash" eyebrow="Find your rhythm" stats={`Score ${game.score} · Best ${best}`}>
    <div className="relative mx-auto overflow-hidden rounded-2xl border border-cyan-200/20 bg-slate-950 focus-visible:outline-2 focus-visible:outline-cyan-200" style={{ width: "min(100%, 360px, 39svh)" }} tabIndex={0} role="group" aria-label="Flight board. Tap, Space, or Up to flap. P pauses." onPointerDown={event => {
      if ((event.target as HTMLElement).closest("button")) return;
      event.currentTarget.focus();
      flap();
    }}>
      <svg viewBox={`0 0 ${FLAPPY.width} ${FLAPPY.height}`} className="block h-auto w-full touch-manipulation select-none" role="img" aria-label={`Bird flight. ${game.score} pipes cleared.`}>
        <rect width="360" height="480" fill="#082f49" />
        <circle cx="286" cy="80" r="42" fill="#164e63" />
        <path d="M0 390 L45 350 L90 390 L160 325 L235 390 L305 340 L360 390 V480 H0Z" fill="#0f172a" />
        {[55, 145, 225, 315].map((col, index) => <circle key={col} cx={col} cy={45 + index * 55} r="2" fill="#a5f3fc" fillOpacity="0.45" />)}
        {game.pipes.map(pipe => <g key={pipe.id}>
          <rect x={pipe.x} y="0" width={FLAPPY.pipeWidth} height={pipe.center - pipe.gap / 2} fill="#67e8f9" />
          <rect x={pipe.x} y={pipe.center + pipe.gap / 2} width={FLAPPY.pipeWidth} height={FLAPPY.height - pipe.center - pipe.gap / 2} fill="#67e8f9" />
          <rect x={pipe.x + 4} y={pipe.center - pipe.gap / 2 - 8} width={FLAPPY.pipeWidth - 8} height="4" fill="#0e7490" />
          <rect x={pipe.x + 4} y={pipe.center + pipe.gap / 2 + 4} width={FLAPPY.pipeWidth - 8} height="4" fill="#0e7490" />
        </g>)}
        <g transform={`translate(${FLAPPY.birdX} ${game.y}) rotate(${Math.max(-25, Math.min(65, game.velocity * 0.12))})`}>
          <circle r={FLAPPY.radius} fill="#fdba74" />
          <ellipse cx="-4" cy="3" rx="6" ry="4" fill="#f97316" />
          <circle cx="5" cy="-4" r="3" fill="#fff7ed" /><circle cx="6" cy="-4" r="1.5" fill="#0f172a" />
        </g>
        <path d="M0 479 H360" stroke="#fb923c" strokeWidth="2" />
      </svg>
      <Overlay phase={phase} score={game.score} title="One tap. Take flight.">
        <Control primary onClick={phase === "paused" ? () => changePhase("playing") : start}>{phase === "paused" ? "Resume" : phase === "over" ? "Fly again" : "Start flight"}</Control>
      </Overlay>
    </div>
    <div className="mt-2 grid grid-cols-[2fr_1fr] gap-2">
      <Control primary disabled={phase !== "playing"} onClick={flap}>Flap ↑</Control>
      <Control disabled={phase === "idle" || phase === "over"} onClick={togglePause}>{phase === "paused" ? "Resume" : "Pause"}</Control>
    </div>
    <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-2">
      <DifficultyPicker value={difficulty} onChange={value => { setDifficulty(value); update(createFlappy(value)); changePhase("idle"); }} disabled={phase === "playing" || phase === "paused"} />
      <Control disabled={phase === "idle"} onClick={start}>Restart</Control>
    </div>
    <GameMessage>Tap the sky, press Space / ↑, or use Flap. Clear each pipe for a point. Speed rises as you score. P pauses; leaving this tab pauses automatically.</GameMessage>
  </GameShell>;
}
