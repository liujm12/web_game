"use client";

import { useEffect, useRef, useState } from "react";
import { createWordSearch, findWordPath, wordThemes, chooseHangmanWord, hangmanRound, type WordSearch } from "@/lib/games/classic-words";
import { ActionButton, GameMessage, GameShell, formatGameTime, useBestScore, useGameKeys } from "./classic-shared";

function ThemePicker({ value, onChange, disabled }: { value: string; onChange: (value: string) => void; disabled?: boolean }) {
  return <label className="flex items-center gap-2 text-xs text-slate-300">Theme
    <select aria-label="Word theme" value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="min-h-11 rounded-xl border border-white/15 bg-slate-900 px-2 text-sm text-white">
      {Object.keys(wordThemes).map((theme) => <option key={theme}>{theme}</option>)}
    </select>
  </label>;
}

export function WordHuntGame() {
  const [theme, setTheme] = useState("Nature");
  const [puzzle, setPuzzle] = useState<WordSearch | null>(null);
  const [found, setFound] = useState<Record<string, number[]>>({});
  const [first, setFirst] = useState<number | null>(null);
  const [message, setMessage] = useState("Find six hidden words. Select the first letter, then the last.");
  const [seconds, setSeconds] = useState(0);
  const [hints, setHints] = useState(0);
  const [hintCell, setHintCell] = useState<number | null>(null);
  const [best, recordBest] = useBestScore("word-hunt");
  const dragStart = useRef<number | null>(null);
  const ignoreClick = useRef(false);
  const won = !!puzzle && Object.keys(found).length === puzzle.words.length;

  useEffect(() => {
    if (!puzzle || won) return;
    const interval = window.setInterval(() => { if (!document.hidden) setSeconds((current) => current + 1); }, 1000);
    return () => window.clearInterval(interval);
  }, [puzzle, won]);

  function start() {
    setPuzzle(createWordSearch(theme));
    setFound({});
    setFirst(null);
    setSeconds(0);
    setHints(0);
    setHintCell(null);
    setMessage("Words run horizontally, vertically or diagonally, in either direction.");
  }

  function finishSelection(startIndex: number, lastIndex: number) {
    if (!puzzle || won) return;
    const match = findWordPath(puzzle, startIndex, lastIndex);
    if (!match) setMessage("No target word on that line. Try another pair of letters.");
    else if (found[match.word]) setMessage(match.word + " is already found.");
    else {
      const next = { ...found, [match.word]: match.path };
      setFound(next);
      setHintCell(null);
      if (Object.keys(next).length === puzzle.words.length) {
        const score = Math.max(100, 1800 - seconds * 3 - hints * 100);
        recordBest(score);
        setMessage("All six found in " + formatGameTime(seconds) + ". Score " + score + " · Hints " + hints + ".");
      } else setMessage(match.word + " found. " + (puzzle.words.length - Object.keys(next).length) + " to go.");
    }
    setFirst(null);
  }

  function select(index: number) {
    if (ignoreClick.current) { ignoreClick.current = false; return; }
    if (won) return;
    if (first === null) { setFirst(index); setMessage("Now select the last letter of the word."); }
    else if (first === index) setFirst(null);
    else finishSelection(first, index);
  }

  const covered = new Set(Object.values(found).flat());
  return <GameShell title="Word Hunt" eyebrow="Six words. Eight directions." stats={Object.keys(found).length + "/6 found · " + formatGameTime(seconds) + " · Best " + best}>
    <div className="relative mx-auto w-full max-w-[440px] overflow-hidden rounded-2xl border border-amber-100/20 bg-[#efe7d3] p-2">
      {puzzle ? <div className="grid grid-cols-8 gap-0.5" role="group" aria-label="Word search board">
        {puzzle.cells.map((letter, index) => <button
          key={index} type="button" aria-label={"Row " + (Math.floor(index / 8) + 1) + " column " + (index % 8 + 1) + ": " + letter}
          aria-pressed={first === index || covered.has(index)}
          onClick={() => select(index)}
          onPointerDown={() => { dragStart.current = index; ignoreClick.current = false; }}
          onPointerUp={() => {
            if (dragStart.current !== null && dragStart.current !== index) {
              finishSelection(dragStart.current, index); ignoreClick.current = true;
            }
            dragStart.current = null;
          }}
          onKeyDown={(event) => {
            const delta = ({ ArrowLeft: -1, ArrowRight: 1, ArrowUp: -8, ArrowDown: 8 } as Record<string, number>)[event.key];
            if (delta !== undefined) {
              event.preventDefault();
              const next = Math.max(0, Math.min(63, index + delta));
              event.currentTarget.parentElement?.querySelectorAll("button")[next]?.focus();
            }
            if (event.key === "Escape") setFirst(null);
          }}
          className={["aspect-square min-w-0 select-none rounded-md font-mono text-sm font-bold focus-visible:outline-2 focus-visible:outline-slate-900 sm:text-xl", first === index ? "bg-orange-400 text-slate-950" : hintCell === index ? "bg-yellow-300 text-slate-950 ring-2 ring-orange-600" : covered.has(index) ? "bg-teal-700 text-white" : "text-slate-900 hover:bg-white/50"].join(" ")}
        >{letter}</button>)}
      </div> : <div className="flex aspect-square items-center justify-center text-center text-slate-900">
        <div><p className="font-mono text-5xl font-black tracking-widest">FIND</p><p className="mt-1 text-sm">A fresh puzzle every round.</p><ActionButton primary className="mt-5" onClick={start}>Start word hunt</ActionButton></div>
      </div>}
      {won && <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 p-5 text-center">
        <div><p className="text-xs uppercase tracking-widest text-cyan-200">Board complete</p><h3 className="mt-2 text-3xl font-black">{formatGameTime(seconds)}</h3><p className="mt-2 text-sm text-slate-200">{hints} hints used</p><ActionButton primary className="mt-4" onClick={start}>Next puzzle</ActionButton></div>
      </div>}
    </div>
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <ThemePicker value={theme} onChange={setTheme} />
      <ActionButton onClick={start}>{puzzle ? "New puzzle" : "Start"}</ActionButton>
      <ActionButton disabled={!puzzle || won || hints >= 3} onClick={() => {
        if (!puzzle) return;
        const next = puzzle.words.find((word) => !found[word]);
        if (next) {
          setHintCell(puzzle.paths[next][0]); setFirst(null); setHints((current) => current + 1);
          setMessage("The first letter of " + next + " is highlighted. Each hint costs 100 points.");
        }
      }}>Hint {3 - hints}</ActionButton>
    </div>
    {puzzle && <ul aria-label="Words to find" className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-bold sm:text-sm">{puzzle.words.map((word) => <li key={word} className={found[word] ? "rounded-lg bg-teal-900/60 py-2 text-teal-200 line-through" : "rounded-lg bg-white/5 py-2 text-slate-200"}>{word}</li>)}</ul>}
    <GameMessage>{message}</GameMessage>
  </GameShell>;
}

export function HangmanGame() {
  const [theme, setTheme] = useState("Nature");
  const [difficulty, setDifficulty] = useState("Normal");
  const [entry, setEntry] = useState<{ word: string; clue: string } | null>(null);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [best, recordBest] = useBestScore("hangman-streak");
  const limit = difficulty === "Easy" ? 8 : difficulty === "Hard" ? 5 : 6;
  const { misses, won, lost } = hangmanRound(entry?.word || "?", guesses, limit);
  const playing = !!entry && !won && !lost;
  const drawnParts = Math.ceil(misses * 6 / limit);

  useEffect(() => {
    if (!playing) return;
    const interval = window.setInterval(() => { if (!document.hidden) setSeconds((current) => current + 1); }, 1000);
    return () => window.clearInterval(interval);
  }, [playing]);

  function nextWord() {
    if (playing) setStreak(0);
    setEntry(chooseHangmanWord(theme, entry?.word));
    setGuesses([]);
    setSeconds(0);
  }

  function guess(letter: string) {
    if (!entry || !playing || guesses.includes(letter)) return;
    const next = [...guesses, letter];
    setGuesses(next);
    const result = hangmanRound(entry.word, next, limit);
    if (result.won) {
      const nextStreak = streak + 1;
      setStreak(nextStreak); recordBest(nextStreak);
    } else if (result.lost) setStreak(0);
  }

  useGameKeys((key) => {
    if (/^[a-z]$/i.test(key)) { guess(key.toUpperCase()); return true; }
    return false;
  }, playing);

  return <GameShell title="Hangman" eyebrow="Clues & letters" stats={"Misses " + misses + "/" + limit + " · Streak " + streak + " · Best " + best}>
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#11222a] p-4">
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 150 160" role="img" aria-label={misses + " incorrect guesses"} className="h-32 w-28 shrink-0 text-amber-200 sm:h-40">
          <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
            <path d="M20 150H125M40 150V15H105V35" opacity=".35" />
            {drawnParts >= 1 && <circle cx="105" cy="51" r="16" />}
            {drawnParts >= 2 && <path d="M105 67V112" />}
            {drawnParts >= 3 && <path d="M105 77L82 94" />}
            {drawnParts >= 4 && <path d="M105 77L128 94" />}
            {drawnParts >= 5 && <path d="M105 112L87 140" />}
            {drawnParts >= 6 && <path d="M105 112L123 140" />}
          </g>
        </svg>
        <div><p className="text-[10px] font-bold uppercase tracking-widest text-amber-200">{theme} clue</p><p className="mt-2 text-sm leading-relaxed text-slate-100">{entry?.clue || "Read the clue. Guess a letter. Keep your streak alive."}</p><p className="mt-3 text-xs tabular-nums text-slate-400">{formatGameTime(seconds)}</p></div>
      </div>
      <div aria-label="Hidden word" className="mt-4 flex flex-wrap justify-center gap-1.5">
        {(entry?.word || "READY").split("").map((letter, index) => <span key={index} className={["flex h-10 w-7 items-center justify-center border-b-2 font-mono text-xl font-black sm:w-9", guesses.includes(letter) ? "border-teal-300 text-teal-200" : lost ? "border-orange-300 text-orange-200" : "border-white/30 text-white"].join(" ")}>{entry ? guesses.includes(letter) || lost ? letter : "" : letter}</span>)}
      </div>
      {(!entry || won || lost) && <div className="mt-4 border-t border-white/10 pt-4 text-center">
        {entry && <p role="status" className="mb-3 font-bold">{won ? "Word solved in " + formatGameTime(seconds) + "!" : "The word was " + entry.word + "."}</p>}
        <ActionButton primary onClick={nextWord}>{entry ? "Next word" : "Start guessing"}</ActionButton>
      </div>}
    </div>
    <div className="mt-3 grid grid-cols-7 gap-1.5" aria-label="Letter keyboard">
      {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => <button type="button" key={letter} disabled={!playing || guesses.includes(letter)} onClick={() => guess(letter)} aria-label={"Guess " + letter} className={["min-h-11 rounded-lg border text-sm font-bold focus-visible:outline-2 focus-visible:outline-cyan-200 disabled:cursor-default", guesses.includes(letter) ? entry?.word.includes(letter) ? "border-teal-700 bg-teal-900 text-teal-200" : "border-white/5 bg-white/5 text-slate-600" : "border-white/15 bg-white/10 text-white disabled:opacity-35"].join(" ")}>{letter}</button>)}
    </div>
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <ThemePicker value={theme} onChange={setTheme} disabled={playing} />
      <label className="flex items-center gap-2 text-xs text-slate-300">Level<select aria-label="Hangman difficulty" value={difficulty} disabled={playing} onChange={(event) => setDifficulty(event.target.value)} className="min-h-11 rounded-xl border border-white/15 bg-slate-900 px-2 text-sm text-white">{["Easy", "Normal", "Hard"].map((level) => <option key={level}>{level}</option>)}</select></label>
      {playing && <ActionButton onClick={nextWord}>Skip word</ActionButton>}
    </div>
    <GameMessage>{playing ? "Tap a letter or type A–Z. Skipping ends your streak. Choose a theme and difficulty between rounds." : "Easy allows 8 misses, Normal 6, Hard 5. Your best streak stays on this device."}</GameMessage>
  </GameShell>;
}
