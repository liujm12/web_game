"use client";

import { useEffect, useState, useSyncExternalStore, type ButtonHTMLAttributes, type ReactNode } from "react";
import {
  colorsSorted, createMineBoard, generateColorLevel, generateSudoku, mineCountAround,
  pourColor, revealMine, sudokuConflicts, toggleMineFlag, validSudoku,
  type ColorTubes, type LogicDifficulty, type SudokuPuzzle,
} from "@/lib/games/classic-logic";

const buttonStyle = "min-h-11 min-w-11 rounded-xl border border-white/15 px-3 py-2 text-sm font-bold transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:cursor-not-allowed disabled:opacity-35";
const boardStyle = "relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-slate-900";

function Control({ primary, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean }) {
  return <button type="button" {...props} className={`${buttonStyle} ${primary ? "bg-cyan-300 text-slate-950 hover:bg-orange-300" : "bg-white/5 text-slate-100"} ${className}`} />;
}

function Shell({ title, stats, children }: { title: string; stats: ReactNode; children: ReactNode }) {
  return <section aria-label={title} className="min-w-0 rounded-3xl border border-white/10 bg-slate-950 p-3 text-white sm:p-4">
    <header className="mb-3 flex flex-wrap items-start justify-between gap-2">
      <div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200/70">Classic logic</p><h2 className="text-xl font-black">{title}</h2></div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs tabular-nums text-slate-300">{stats}</div>
    </header>
    {children}
  </section>;
}

function Overlay({ title, detail, children }: { title: string; detail: string; children: ReactNode }) {
  return <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/85 p-3 text-center backdrop-blur-sm">
    <div className="max-w-xs"><h3 className="text-xl font-black text-white">{title}</h3><p className="my-3 text-sm text-slate-300">{detail}</p>{children}</div>
  </div>;
}

function Difficulty({ value, onChange }: { value: LogicDifficulty; onChange: (value: LogicDifficulty) => void }) {
  return <label className="flex min-h-11 items-center justify-between gap-2 text-xs text-slate-300">Difficulty
    <select aria-label="Difficulty" value={value} onChange={(event) => onChange(event.target.value as LogicDifficulty)} className="min-h-11 rounded-xl border border-white/15 bg-slate-900 px-3 text-sm text-white">
      <option value="easy">Easy</option><option value="normal">Normal</option><option value="hard">Hard</option>
    </select>
  </label>;
}

function timeLabel(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function useGameTimer() {
  const [started, setStarted] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (started === null) return;
    const interval = window.setInterval(() => setSeconds(Math.floor((Date.now() - started) / 1000)), 250);
    return () => window.clearInterval(interval);
  }, [started]);
  return {
    seconds,
    start() { setSeconds(0); setStarted(Date.now()); },
    reset() { setSeconds(0); setStarted(null); },
    stop() {
      const elapsed = started === null ? seconds : Math.floor((Date.now() - started) / 1000);
      setSeconds(elapsed); setStarted(null);
      return elapsed;
    },
  };
}

function subscribeRecords(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener("classic-time-record", listener);
  return () => { window.removeEventListener("storage", listener); window.removeEventListener("classic-time-record", listener); };
}

function readRecord(key: string) {
  try { return window.localStorage.getItem(key); } catch { return null; }
}

function useBestTime(key: string): [number | null, (seconds: number) => void] {
  const raw = useSyncExternalStore(subscribeRecords, () => readRecord(key), () => null);
  const parsed = raw === null ? null : Number(raw);
  const best = parsed !== null && Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
  return [best, (seconds) => {
    const saved = readRecord(key);
    const previous = saved === null ? NaN : Number(saved);
    if (Number.isInteger(previous) && previous >= 0 && previous <= seconds) return;
    try { window.localStorage.setItem(key, String(seconds)); window.dispatchEvent(new Event("classic-time-record")); } catch { }
  }];
}

export function MinesweeperGame() {
  const [difficulty, setDifficulty] = useState<LogicDifficulty>("easy");
  const [board, setBoard] = useState(() => createMineBoard("easy"));
  const [flagMode, setFlagMode] = useState(false);
  const timer = useGameTimer();
  const [best, saveBest] = useBestTime(`playroom:mine-time:v1:${difficulty}`);

  function reset(nextDifficulty = difficulty) {
    setDifficulty(nextDifficulty); setBoard(createMineBoard(nextDifficulty)); setFlagMode(false); timer.reset();
  }

  function choose(index: number, flag = flagMode) {
    if (flag) { setBoard(toggleMineFlag(board, index)); return; }
    const next = revealMine(board, index);
    if (next === board) return;
    if (!board.planted) timer.start();
    if (next.phase !== "playing") {
      const seconds = timer.stop();
      if (next.phase === "won") saveBest(seconds);
    }
    setBoard(next);
  }

  return <Shell title="Minesweeper" stats={<><span>{board.flags.filter(Boolean).length}/{board.mineCount} flags</span><span>{timeLabel(timer.seconds)}</span><span>Best {best === null ? "—" : timeLabel(best)}</span></>}>
    <div className={boardStyle}>
      <div className={`grid gap-px bg-white/10 p-1 ${board.size === 8 ? "grid-cols-8" : board.size === 9 ? "grid-cols-9" : "grid-cols-10"}`} aria-label="Minefield">
        {board.mines.map((mine, index) => {
          const revealed = board.revealed[index];
          const count = revealed ? mineCountAround(board, index) : 0;
          const flag = board.flags[index];
          return <button key={index} type="button" disabled={board.phase !== "playing"} aria-label={`Row ${Math.floor(index / board.size) + 1}, column ${index % board.size + 1}: ${revealed ? mine ? "mine" : `${count} nearby mines` : flag ? "flagged" : "hidden"}`}
            onClick={() => choose(index)} onContextMenu={(event) => { event.preventDefault(); choose(index, true); }}
            className={`aspect-square min-w-0 rounded-sm text-sm font-black focus-visible:z-[1] focus-visible:outline-2 focus-visible:outline-cyan-300 ${revealed ? mine ? "bg-orange-400 text-slate-950" : "bg-slate-800 text-cyan-200" : flag ? "bg-orange-300/20 text-orange-200" : "bg-slate-950 text-white hover:bg-slate-700"}`}>
            {revealed ? mine ? "✹" : count || "" : flag ? "⚑" : ""}
          </button>;
        })}
      </div>
      {board.phase !== "playing" && <Overlay title={board.phase === "won" ? "Minefield cleared!" : "Mine hit"} detail={board.phase === "won" ? `Every safe tile found in ${timeLabel(timer.seconds)}.` : "Your next board will have a fresh, safe opening."}><Control primary onClick={() => reset()}>Play again</Control></Overlay>}
    </div>
    <div className="mt-3 grid grid-cols-2 gap-2"><Control primary={flagMode} aria-pressed={flagMode} onClick={() => setFlagMode(!flagMode)}>{flagMode ? "Flag mode on" : "Reveal mode"}</Control><Control onClick={() => reset()}>New board</Control></div>
    <Difficulty value={difficulty} onChange={reset} />
    <p className="mt-2 text-xs leading-relaxed text-slate-400">First reveal and its neighbors are always safe. Tap to reveal; use flag mode or right-click to mark mines. Clear every safe tile to win.</p>
  </Shell>;
}

type SudokuEntry = { cells: number[]; notes: number[][] };

export function SudokuSprintGame() {
  const [difficulty, setDifficulty] = useState<LogicDifficulty>("easy");
  const [puzzle, setPuzzle] = useState<SudokuPuzzle | null>(null);
  const [entry, setEntry] = useState<SudokuEntry>(() => ({ cells: Array(81).fill(0), notes: Array.from({ length: 81 }, () => []) }));
  const [history, setHistory] = useState<SudokuEntry[]>([]);
  const [selected, setSelected] = useState(0);
  const [notesMode, setNotesMode] = useState(false);
  const [hints, setHints] = useState(0);
  const [message, setMessage] = useState("Fill every row, column and 3×3 box with 1–9.");
  const timer = useGameTimer();
  const won = puzzle !== null && validSudoku(entry.cells);
  const conflicts = sudokuConflicts(entry.cells);

  function start(nextDifficulty = difficulty) {
    const next = generateSudoku(nextDifficulty);
    setDifficulty(nextDifficulty); setPuzzle(next);
    setEntry({ cells: [...next.puzzle], notes: Array.from({ length: 81 }, () => []) });
    setHistory([]); setHints(0); setNotesMode(false); setSelected(next.puzzle.indexOf(0));
    setMessage("Select a cell, then enter 1–9. Orange cells have a row, column or box conflict."); timer.start();
  }

  function commit(next: SudokuEntry) {
    setHistory([...history, entry]); setEntry(next);
    if (validSudoku(next.cells)) timer.stop();
  }

  function place(value: number) {
    if (!puzzle || won) return;
    if (puzzle.puzzle[selected]) { setMessage("That number is a fixed clue. Select an empty or editable cell."); return; }
    const next = { cells: [...entry.cells], notes: entry.notes.map((notes) => [...notes]) };
    if (notesMode && value !== 0) {
      if (next.cells[selected]) { setMessage("Erase this number before adding notes."); return; }
      next.notes[selected] = next.notes[selected].includes(value) ? next.notes[selected].filter((note) => note !== value) : [...next.notes[selected], value].sort();
    } else {
      if (value === entry.cells[selected] && !entry.notes[selected].length) return;
      next.cells[selected] = value; next.notes[selected] = [];
    }
    commit(next); setMessage(notesMode && value ? "Notes updated. Toggle Notes off to enter an answer." : "Use Undo to recover the previous number or notes.");
  }

  function hint() {
    if (!puzzle || won) return;
    const target = !puzzle.puzzle[selected] && entry.cells[selected] !== puzzle.solution[selected] ? selected : entry.cells.findIndex((value, index) => value !== puzzle.solution[index]);
    if (target < 0) return;
    const next = { cells: [...entry.cells], notes: entry.notes.map((notes) => [...notes]) };
    next.cells[target] = puzzle.solution[target]; next.notes[target] = [];
    setSelected(target); setHints(hints + 1); commit(next); setMessage("One correct number revealed. Hints stay counted even after Undo.");
  }

  function undo() {
    if (!history.length || won) return;
    setEntry(history[history.length - 1]); setHistory(history.slice(0, -1)); setMessage("Previous entry restored.");
  }

  return <Shell title="Sudoku Sprint" stats={<><span>{timeLabel(timer.seconds)}</span><span>{entry.cells.filter(Boolean).length}/81 filled</span><span>Hints {hints}</span></>}>
    <div onKeyDown={(event) => {
      if (!puzzle || won || (event.target instanceof HTMLElement && event.target.tagName === "SELECT")) return;
      const key = event.key;
      if (event.altKey) return;
      if (event.ctrlKey || event.metaKey) {
        if (key.toLowerCase() === "z" && !event.shiftKey) { event.preventDefault(); undo(); }
        return;
      }
      if (/^[1-9]$/.test(key)) { event.preventDefault(); place(Number(key)); }
      else if (["Backspace", "Delete", "0"].includes(key)) { event.preventDefault(); place(0); }
      else if (key.toLowerCase() === "n") { event.preventDefault(); setNotesMode(!notesMode); }
      else if (key.startsWith("Arrow")) {
        event.preventDefault();
        const next = key === "ArrowLeft" ? Math.max(0, selected - 1) : key === "ArrowRight" ? Math.min(80, selected + 1) : key === "ArrowUp" ? Math.max(0, selected - 9) : Math.min(80, selected + 9);
        setSelected(next);
        event.currentTarget.querySelector<HTMLButtonElement>(`[data-sudoku-cell="${next}"]`)?.focus();
      }
    }}>
      <div className={boardStyle}>
        <div role="group" aria-label="Sudoku board" className="grid grid-cols-9">
          {entry.cells.map((value, index) => {
            const fixed = Boolean(puzzle?.puzzle[index]);
            const row = Math.floor(index / 9);
            const column = index % 9;
            const related = row === Math.floor(selected / 9) || column === selected % 9;
            return <button key={index} type="button" data-sudoku-cell={index} tabIndex={index === selected ? 0 : -1} disabled={!puzzle || won} aria-label={`Row ${row + 1}, column ${column + 1}: ${value || "empty"}${fixed ? ", fixed clue" : ""}${entry.notes[index].length ? `, notes ${entry.notes[index].join(", ")}` : ""}`} aria-pressed={index === selected} onClick={() => setSelected(index)}
              className={`relative aspect-square min-w-0 border-r border-b text-base font-bold focus-visible:z-[1] focus-visible:outline-2 focus-visible:outline-cyan-300 sm:text-xl ${column % 3 === 2 && column < 8 ? "border-r-2 border-r-cyan-200/50" : "border-r-white/10"} ${row % 3 === 2 && row < 8 ? "border-b-2 border-b-cyan-200/50" : "border-b-white/10"} ${index === selected ? "bg-cyan-300 text-slate-950" : conflicts.has(index) ? "bg-orange-400/25 text-orange-200" : related ? "bg-cyan-300/10" : "bg-slate-950"} ${fixed && index !== selected ? "text-white" : index !== selected && !conflicts.has(index) ? "text-cyan-200" : ""}`}>
              {value || (entry.notes[index].length > 0 ? <span className="absolute inset-0 grid grid-cols-3 p-px text-[8px] leading-none sm:text-[10px]">{Array.from({ length: 9 }, (_, note) => <span key={note} className="flex items-center justify-center">{entry.notes[index].includes(note + 1) ? note + 1 : ""}</span>)}</span> : "")}
            </button>;
          })}
        </div>
        {!puzzle && <Overlay title="A proper 9×9 challenge" detail="One unique solution. Use pencil notes, undo, and hints at your own pace."><Control primary onClick={() => start()}>Start Sudoku</Control></Overlay>}
        {won && <Overlay title="Puzzle solved!" detail={`${timeLabel(timer.seconds)} · ${hints} hint${hints === 1 ? "" : "s"} used`}><Control primary onClick={() => start()}>Next puzzle</Control></Overlay>}
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1.5">{Array.from({ length: 9 }, (_, index) => <Control key={index} style={{ paddingInline: 4 }} disabled={!puzzle || won} onClick={() => place(index + 1)}>{index + 1}</Control>)}<Control style={{ paddingInline: 4 }} disabled={!puzzle || won} onClick={() => place(0)}>Erase</Control></div>
      <div className="mt-2 grid grid-cols-3 gap-2"><Control primary={notesMode} aria-pressed={notesMode} disabled={!puzzle || won} onClick={() => setNotesMode(!notesMode)}>Notes</Control><Control disabled={!history.length || won} onClick={undo}>Undo</Control><Control disabled={!puzzle || won} onClick={hint}>Hint</Control></div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2"><Control onClick={() => start()}>New puzzle</Control><Difficulty value={difficulty} onChange={(next) => { if (puzzle) start(next); else setDifficulty(next); }} /></div>
    </div>
    <p role="status" className="mt-2 text-xs leading-relaxed text-slate-300">{message}</p>
    <p className="mt-1 text-xs text-slate-400">Keyboard: arrows, 1–9, Delete, N for notes, Ctrl/⌘ Z to undo. Difficulty changes start a new puzzle.</p>
  </Shell>;
}

const tubeColors = ["", "bg-cyan-300", "bg-orange-300", "bg-lime-300", "bg-fuchsia-300", "bg-blue-300", "bg-yellow-200"];

export function ColorSortGame() {
  const [level, setLevel] = useState(1);
  const [initial, setInitial] = useState<ColorTubes | null>(null);
  const [tubes, setTubes] = useState<ColorTubes>([[1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3], [], []]);
  const [history, setHistory] = useState<ColorTubes[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [message, setMessage] = useState("Match colors and numbers. Fill one tube per color.");
  const won = initial !== null && colorsSorted(tubes);

  function start(nextLevel = level) {
    const next = generateColorLevel(nextLevel).tubes;
    setLevel(nextLevel); setInitial(next); setTubes(next); setHistory([]); setSelected(null);
    setMessage("Select a source tube, then a destination. Matching top layers pour together.");
  }

  function choose(index: number) {
    if (!initial || won) return;
    if (selected === null) {
      if (!tubes[index].length) { setMessage("This tube is empty. Choose a tube with color first."); return; }
      setSelected(index); setMessage(`Tube ${index + 1} selected. Choose an empty tube or the same top number.`); return;
    }
    if (selected === index) { setSelected(null); setMessage("Selection cleared."); return; }
    const next = pourColor(tubes, selected, index);
    if (!next) { setMessage(tubes[index].length === 4 ? "That tube is full. Choose another destination." : "Top numbers must match, unless the destination is empty."); return; }
    setHistory([...history, tubes]); setTubes(next); setSelected(null); setMessage("Pour complete. Select your next source tube.");
  }

  return <Shell title="Color Sort" stats={<><span>Level {level}</span><span>Moves {history.length}</span><span>{tubes.length - 2} colors</span></>}>
    <div className={`${boardStyle} p-2`}>
      <div className="grid grid-cols-4 gap-x-2 gap-y-3 sm:grid-cols-5">
        {tubes.map((tube, index) => <div key={index} className="min-w-0 text-center">
          <button type="button" disabled={!initial || won} aria-label={`Tube ${index + 1}, bottom to top: ${tube.join(", ") || "empty"}`} aria-pressed={selected === index} onClick={() => choose(index)}
            className={`mx-auto flex h-36 min-w-11 w-full max-w-14 flex-col-reverse gap-1 rounded-b-2xl rounded-t-md border-2 p-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 ${selected === index ? "border-cyan-300 bg-cyan-300/15 -translate-y-1" : "border-slate-600 bg-slate-950 hover:border-slate-300"}`}>
            {Array.from({ length: 4 }, (_, slot) => <span key={slot} className={`flex h-7 shrink-0 items-center justify-center rounded-md text-sm font-black text-slate-950 ${tube[slot] ? tubeColors[tube[slot]] : "bg-white/5"}`}>{tube[slot] || ""}</span>)}
          </button>
          <span className="mt-1 block text-[10px] text-slate-400">{index + 1}</span>
        </div>)}
      </div>
      {!initial && <Overlay title="A place for every color" detail="Pour matching layers. Numbered colors make every move easy to identify."><Control primary onClick={() => start()}>Start sorting</Control></Overlay>}
      {won && <Overlay title="Perfectly sorted!" detail={`Level ${level} cleared in ${history.length} pours.`}><Control primary onClick={() => start(level + 1)}>Next level</Control></Overlay>}
    </div>
    <div className="mt-3 grid grid-cols-3 gap-2">
      <Control disabled={!history.length || won} onClick={() => { setTubes(history[history.length - 1]); setHistory(history.slice(0, -1)); setSelected(null); setMessage("Last pour undone."); }}>Undo</Control>
      <Control disabled={!initial} onClick={() => { if (initial) setTubes(initial); setHistory([]); setSelected(null); setMessage("Level reset to its original arrangement."); }}>Reset</Control>
      <Control disabled={!won} primary={won} onClick={() => start(level + 1)}>Next</Control>
    </div>
    <p role="status" className="mt-3 text-xs leading-relaxed text-slate-300">{message}</p>
    <p className="mt-1 text-xs leading-relaxed text-slate-400">Tap a selected tube again to cancel. Only empty or same-number tops accept a pour. Every level has a verified reverse-move solution.</p>
  </Shell>;
}
