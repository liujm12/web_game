"use client";

import { useEffect, useState } from "react";
import { applyMove, chooseComputerMove, createCheckers, legalMoves, type Difficulty } from "@/lib/games/classic-checkers";

const controlClass = "min-h-11 rounded-xl border border-white/20 bg-slate-800 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300";
const squareName = (square: number) => `${"abcdefgh"[square % 8]}${8 - Math.floor(square / 8)}`;

export function CheckersLiteGame() {
  const [state, setState] = useState(createCheckers);
  const [selected, setSelected] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<"computer" | "local">("computer");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [hint, setHint] = useState("Choose a highlighted piece, then a dotted square.");
  const moves = legalMoves(state);
  const activePiece = state.forced ?? selected;
  const computerTurn = mode === "computer" && state.turn === "cyan";
  const interactive = started && !state.result && !computerTurn;
  const orangeCount = state.board.filter(piece => piece?.side === "orange").length;
  const cyanCount = state.board.filter(piece => piece?.side === "cyan").length;
  const sideName = state.turn === "orange" ? "Orange" : "Cyan";
  const status = state.result === "draw" ? "Draw" : state.result ? mode === "computer" ? state.result === "orange" ? "You win!" : "Computer wins" : `${state.result === "orange" ? "Orange" : "Cyan"} wins!` : !started ? "Orange moves first" : `${sideName} to move${computerTurn ? " · Computer thinking…" : state.forced !== null ? " · Continue jumping" : moves[0]?.captured !== undefined ? " · Capture required" : ""}`;

  useEffect(() => {
    if (!started || state.result || !computerTurn) return;
    const timer = window.setTimeout(() => {
      const move = chooseComputerMove(state, difficulty);
      if (move) setState(current => current === state ? applyMove(current, move) : current);
    }, 280);
    return () => window.clearTimeout(timer);
  }, [state, started, computerTurn, difficulty]);

  function reset(play: boolean) {
    setState(createCheckers());
    setSelected(null);
    setStarted(play);
    setHint("Choose a highlighted piece, then a dotted square.");
  }

  function chooseSquare(square: number) {
    if (!interactive) return;
    const move = moves.find(candidate => candidate.from === activePiece && candidate.to === square);
    if (move) {
      const next = applyMove(state, move);
      setState(next);
      setSelected(next.forced);
      setHint(next.forced !== null ? "Keep jumping with the same piece." : "Choose a highlighted piece, then a dotted square.");
    } else if (moves.some(candidate => candidate.from === square)) {
      setSelected(square);
      setHint("Choose a dotted destination.");
    } else {
      setHint(state.forced !== null ? "Finish the capture chain with the selected piece." : moves[0]?.captured !== undefined ? "A capture is available and must be taken." : "Choose a highlighted piece or a dotted destination.");
    }
  }

  return (
    <section className="mx-auto w-full min-w-0 max-w-lg rounded-2xl border border-white/10 bg-slate-950 p-3 text-white sm:p-4" aria-label="Checkers Lite game">
      <header className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h2 className="text-lg font-bold">Checkers Lite</h2>
        <p className="text-xs text-slate-300">American rules · 8 × 8</p>
      </header>
      <div className="mb-2 flex flex-wrap justify-between gap-1 text-xs">
        <p role="status" aria-live="polite" className="font-semibold text-cyan-200">{status}</p>
        <p><span className="text-orange-300">Orange {orangeCount}</span> · <span className="text-cyan-300">Cyan {cyanCount}</span></p>
      </div>
      <div className="relative overflow-hidden rounded-xl border border-white/20">
        <div className="grid aspect-square grid-cols-8" role="group" aria-label="Checkers board">
          {state.board.map((piece, square) => {
            const dark = (Math.floor(square / 8) + square % 8) % 2 === 1;
            const selectable = moves.some(move => move.from === square);
            const destination = moves.some(move => move.from === activePiece && move.to === square);
            const selectedSquare = activePiece === square;
            const description = piece ? `${piece.side} ${piece.king ? "king" : "man"}` : "empty";
            return (
              <button
                key={square}
                type="button"
                aria-label={`${squareName(square)}, ${description}${selectedSquare ? ", selected" : ""}${destination ? ", legal destination" : selectable ? ", can move" : ""}`}
                aria-pressed={selectedSquare}
                disabled={!interactive || !dark}
                onClick={() => chooseSquare(square)}
                className={`relative flex aspect-square min-w-0 items-center justify-center p-1 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-white ${dark ? "bg-slate-800" : "bg-slate-600"} ${selectedSquare ? "ring-2 ring-inset ring-orange-200" : ""}`}
              >
                {piece ? <span aria-hidden="true" className={`flex h-[85%] w-[85%] items-center justify-center rounded-full border-2 text-sm font-black text-slate-950 shadow-md ${piece.side === "orange" ? "border-orange-200 bg-orange-400" : "border-cyan-100 bg-cyan-400"} ${selectable && interactive ? "outline outline-2 outline-offset-2 outline-white/75" : ""}`}>{piece.king ? "K" : ""}</span> : destination ? <span aria-hidden="true" className="h-3 w-3 rounded-full bg-cyan-200 ring-4 ring-cyan-300/20" /> : null}
              </button>
            );
          })}
        </div>
        {(!started || state.result) && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/90 p-5 text-center">
          <h3 className="text-xl font-bold">{state.result ? status : "Make your move"}</h3>
          <p className="max-w-xs text-sm text-slate-300">{state.result ? state.drawReason ?? "The other side has no legal moves left." : "Orange starts. Capture when you can, finish every jump, and reach the far edge to crown a king."}</p>
          <button type="button" onClick={() => reset(true)} className="min-h-11 rounded-xl bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{state.result ? "Play again" : "Start checkers"}</button>
        </div>}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <label className="flex min-w-0 flex-col gap-1 text-xs text-slate-300">Opponent
          <select className={controlClass} value={mode} onChange={event => { setMode(event.target.value as "computer" | "local"); reset(false); }}>
            <option value="computer">Computer</option><option value="local">Local 2 players</option>
          </select>
        </label>
        <label className="flex min-w-0 flex-col gap-1 text-xs text-slate-300">Difficulty
          <select className={`${controlClass} disabled:opacity-50`} value={difficulty} disabled={mode === "local"} onChange={event => setDifficulty(event.target.value as Difficulty)}>
            <option value="easy">Easy</option><option value="normal">Normal</option><option value="hard">Hard</option>
          </select>
        </label>
        <button type="button" className={`${controlClass} col-span-2`} onClick={() => reset(false)}>Reset board</button>
      </div>
      <p className="mt-2 text-xs text-slate-300" aria-live="polite">{mode === "computer" ? "You are Orange. " : "Share the board. "}{hint}</p>
      <details className="mt-2 text-xs text-slate-400">
        <summary className="flex min-h-11 cursor-pointer items-center text-cyan-200">Rules & keyboard help</summary>
        <p className="pb-2 leading-relaxed">Men move and capture diagonally forward. Kings move and capture in either direction, one step or jump at a time. All captures are mandatory; choose any available capture, then finish that piece’s chain. Crowning ends your turn. No legal moves means a loss. Threefold repetition or 40 moves each without capture or promotion is a draw. Tab between squares; Enter or Space selects. Changing opponent resets the board.</p>
      </details>
    </section>
  );
}
