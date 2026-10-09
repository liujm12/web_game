import Link from "next/link";

import type { GameRecord } from "@/lib/site-content";

type GameCardProps = {
  game: GameRecord;
};

const gameCardCopy: Record<string, { cta: string; hook: string; badge: string }> = {
  "2048": {
    cta: "Chase 2048",
    hook: "Merge tiles, build bigger numbers, and keep the board alive.",
    badge: "Classic puzzle",
  },
  "breakout-blitz": {
    cta: "Break bricks",
    hook: "Bounce the ball, clear the wall, and keep your paddle ready.",
    badge: "Brick breaker",
  },
  "comet-loop": {
    cta: "Time the shot",
    hook: "Wait for the gate, fire clean, and keep the comet streak going.",
    badge: "Timing loop",
  },
  "four-in-a-row": {
    cta: "Place stones",
    hook: "Read the board and line up five before your opponent does.",
    badge: "Board duel",
  },
  "memory-mosaic": {
    cta: "Match tiles",
    hook: "Flip fast, remember the glow, and clear pairs with fewer moves.",
    badge: "Memory board",
  },
  "merge-shot-2048": {
    cta: "Fire blocks",
    hook: "Aim a lane, launch the next tile, and stack smarter merges.",
    badge: "Merge cannon",
  },
  "number-rush": {
    cta: "Clear 1 to 9",
    hook: "Tap the sequence cleanly and race your own best time.",
    badge: "Focus sprint",
  },
  "pattern-pulse": {
    cta: "Repeat lights",
    hook: "Watch the pulse, replay the order, and push the streak further.",
    badge: "Sequence test",
  },
  "snake": {
    cta: "Grow snake",
    hook: "Turn early, grab food, and avoid boxing yourself in.",
    badge: "Arcade classic",
  },
  "target-blitz": {
    cta: "Hit targets",
    hook: "Find the glow, tap quickly, and pile up hits before time runs out.",
    badge: "Reaction rush",
  },
  "block-drop": {
    cta: "Drop blocks",
    hook: "Rotate falling shapes, clear rows, and keep the stack low.",
    badge: "Block puzzle",
  },
  "minesweeper": {
    cta: "Sweep mines",
    hook: "Read the numbers, flag the risky tiles, and clear the board.",
    badge: "Logic classic",
  },
  "sudoku-sprint": {
    cta: "Fill grid",
    hook: "Solve a fresh 9x9 puzzle with notes, undo, and hints.",
    badge: "Classic sudoku",
  },
  "word-hunt": {
    cta: "Find words",
    hook: "Find six hidden words in a fresh eight-direction letter grid.",
    badge: "Word grid",
  },
  "hangman": {
    cta: "Guess word",
    hook: "Use the clue, guess letters, and build a winning streak.",
    badge: "Word classic",
  },
  "color-sort": {
    cta: "Sort tubes",
    hook: "Move colors into clean tubes without trapping the top color.",
    badge: "Calm puzzle",
  },
  "flappy-dash": {
    cta: "Tap to fly",
    hook: "Flap through gaps and restart with one tap after a crash.",
    badge: "One button",
  },
  "checkers-lite": {
    cta: "Play checkers",
    hook: "Challenge the computer or a friend with full American rules.",
    badge: "Board duel",
  },
};

function getCardCopy(game: GameRecord) {
  if (gameCardCopy[game.slug]) {
    return gameCardCopy[game.slug];
  }

  if (game.category === "brain") {
    return {
      cta: "Start puzzle",
      hook: "Warm up your focus with a short board challenge.",
      badge: "Brain break",
    };
  }

  return {
    cta: "Start run",
    hook: "Start a short round, learn the pattern, and try to beat your last attempt.",
    badge: "Quick arcade",
  };
}

function getCardFrame(game: GameRecord) {
  if (["2048", "number-rush", "memory-mosaic", "pattern-pulse", "four-in-a-row"].includes(game.slug)) {
    return {
      article: "rounded-[24px]",
      hero: "min-h-72",
      previewWrap: "self-end",
      stripe: "left-0 top-0 h-full w-1.5 bg-cyan-200/80",
    };
  }

  if (["breakout-blitz", "snake", "comet-loop", "signal-sweep"].includes(game.slug)) {
    return {
      article: "rounded-[18px]",
      hero: "min-h-72",
      previewWrap: "self-center",
      stripe: "inset-x-0 bottom-0 h-1.5 bg-orange-200/85",
    };
  }

  return {
    article: "rounded-[28px]",
    hero: "min-h-72",
    previewWrap: "self-start",
    stripe: "inset-x-6 top-0 h-1 rounded-full bg-white/55",
  };
}

function PreviewShell({
  game,
  children,
  className = "",
}: {
  game: GameRecord;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-game-preview={game.slug}
      aria-hidden="true"
      className={`mx-auto h-32 w-44 overflow-hidden rounded-[22px] border border-white/20 bg-slate-950/42 shadow-[0_18px_45px_rgba(2,6,23,0.34)] backdrop-blur-sm transition duration-300 group-hover:scale-[1.03] ${className}`}
    >
      {children}
    </div>
  );
}

function LanePreview({ game }: { game: GameRecord }) {
  return (
    <PreviewShell game={game} className="relative px-4 py-3">
      <div className="grid h-full grid-cols-3 gap-3">
        {[0, 1, 2].map((lane) => (
          <div
            key={lane}
            className="relative rounded-full bg-slate-950/18 ring-1 ring-white/12"
          >
            <span className="absolute inset-x-1 top-2 h-7 rounded-full bg-white/12" />
            {lane === 1 ? (
              <span className="absolute bottom-3 left-1/2 h-8 w-7 -translate-x-1/2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(165,243,252,0.55)]" />
            ) : null}
            {lane === 2 ? (
              <span className="absolute top-9 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-orange-200 shadow-[0_0_16px_rgba(254,215,170,0.55)]" />
            ) : null}
          </div>
        ))}
      </div>
    </PreviewShell>
  );
}

function TargetPreview({ game }: { game: GameRecord }) {
  return (
    <PreviewShell game={game} className="relative p-4">
      <div className="grid h-full grid-cols-3 gap-2">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <span
            key={index}
            className={`rounded-[18px] ring-1 ring-white/12 ${
              index === 4
                ? "bg-cyan-200 shadow-[0_0_20px_rgba(165,243,252,0.6)]"
                : "bg-white/12"
            }`}
          />
        ))}
      </div>
      <span className="absolute right-4 top-4 h-3 w-3 rounded-full bg-orange-200" />
    </PreviewShell>
  );
}

function MemoryPreview({ game }: { game: GameRecord }) {
  return (
    <PreviewShell game={game} className="p-4">
      <div className="grid h-full grid-cols-4 gap-2">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
          <span
            key={index}
            className={`rounded-[12px] ring-1 ring-white/12 ${
              index === 1 || index === 6
                ? "bg-cyan-200"
                : index === 3
                  ? "bg-orange-200"
                  : "bg-white/14"
            }`}
          />
        ))}
      </div>
    </PreviewShell>
  );
}

function PatternPreview({ game }: { game: GameRecord }) {
  return (
    <PreviewShell game={game} className="relative p-4">
      <div className="grid h-full grid-cols-2 gap-3">
        {["bg-cyan-200", "bg-white/14", "bg-orange-200", "bg-white/14"].map(
          (className, index) => (
            <span
              key={index}
              className={`rounded-full ring-1 ring-white/12 ${className} ${
                index === 0 ? "shadow-[0_0_22px_rgba(165,243,252,0.65)]" : ""
              }`}
            />
          ),
        )}
      </div>
      <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />
    </PreviewShell>
  );
}

function NumberPreview({ game }: { game: GameRecord }) {
  const numbers = ["3", "1", "4", "7", "8", "6", "2", "5", "9"];

  return (
    <PreviewShell game={game} className="p-3">
      <div className="grid h-full grid-cols-3 gap-2">
        {numbers.map((number) => (
          <span
            key={number}
            className={`flex items-center justify-center rounded-[14px] text-sm font-black ${
              number === "1"
                ? "bg-cyan-200 text-cyan-950"
                : "bg-white/14 text-white"
            }`}
          >
            {number}
          </span>
        ))}
      </div>
    </PreviewShell>
  );
}

function Tile2048Preview({ game }: { game: GameRecord }) {
  const numbers = ["2", "4", "8", "16", "4", "8", "32", "64"];

  return (
    <PreviewShell game={game} className="p-3">
      <div className="grid h-full grid-cols-4 gap-2">
        {numbers.map((number, index) => (
          <span
            key={`${number}-${index}`}
            className={`flex items-center justify-center rounded-[12px] text-xs font-black ${
              Number(number) >= 32
                ? "bg-orange-200 text-orange-950"
                : Number(number) >= 8
                  ? "bg-cyan-200 text-cyan-950"
                  : "bg-white/20 text-white"
            }`}
          >
            {number}
          </span>
        ))}
      </div>
    </PreviewShell>
  );
}

function MergeShotPreview({ game }: { game: GameRecord }) {
  return (
    <PreviewShell game={game} className="relative px-4 py-3">
      <div className="grid h-full grid-cols-5 gap-2">
        {[0, 1, 2, 3, 4].map((lane) => (
          <span
            key={lane}
            className={`rounded-full ring-1 ring-white/12 ${
              lane === 2 ? "bg-cyan-200/50" : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <span className="absolute bottom-3 left-1/2 flex h-9 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-orange-200 text-sm font-black text-orange-950">
        8
      </span>
      <span className="absolute left-1/2 top-4 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-100" />
    </PreviewShell>
  );
}

function SnakePreview({ game }: { game: GameRecord }) {
  return (
    <PreviewShell game={game} className="relative p-4">
      <div className="grid h-full grid-cols-6 gap-1.5">
        {Array.from({ length: 24 }).map((_, index) => {
          const isSnake = [8, 9, 10, 16].includes(index);
          const isFood = index === 5;

          return (
            <span
              key={index}
              className={`rounded-full ${
                isFood
                  ? "bg-orange-200 shadow-[0_0_16px_rgba(254,215,170,0.6)]"
                  : isSnake
                    ? "bg-lime-300"
                    : "bg-white/10"
              }`}
            />
          );
        })}
      </div>
    </PreviewShell>
  );
}

function FivePreview({ game }: { game: GameRecord }) {
  return (
    <PreviewShell game={game} className="relative p-4">
      <div className="absolute inset-5 grid grid-cols-5 grid-rows-5">
        {Array.from({ length: 25 }).map((_, index) => (
          <span key={index} className="border border-orange-100/22" />
        ))}
      </div>
      <span className="absolute left-[38%] top-[35%] h-5 w-5 rounded-full bg-slate-950 ring-2 ring-white/30" />
      <span className="absolute left-[50%] top-[35%] h-5 w-5 rounded-full bg-white ring-2 ring-slate-950/30" />
      <span className="absolute left-[50%] top-[50%] h-5 w-5 rounded-full bg-slate-950 ring-2 ring-white/30" />
      <span className="absolute left-[62%] top-[50%] h-5 w-5 rounded-full bg-white ring-2 ring-slate-950/30" />
    </PreviewShell>
  );
}

function BreakoutPreview({ game }: { game: GameRecord }) {
  return (
    <PreviewShell game={game} className="relative p-4">
      <div className="grid grid-cols-6 gap-1.5">
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            className={`h-2.5 rounded-full ${
              index % 3 === 0 ? "bg-orange-200" : "bg-amber-200"
            }`}
          />
        ))}
      </div>
      <span className="absolute bottom-8 right-9 h-4 w-4 rounded-full bg-cyan-200 shadow-[0_0_16px_rgba(165,243,252,0.65)]" />
      <span className="absolute bottom-4 left-9 h-3 w-16 rounded-full bg-fuchsia-200" />
    </PreviewShell>
  );
}

function SignalPreview({ game }: { game: GameRecord }) {
  return (
    <PreviewShell game={game} className="relative">
      <span className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/45" />
      <span className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/25" />
      <span className="absolute left-1/2 top-1/2 h-1 w-12 origin-left -rotate-45 rounded-full bg-cyan-200" />
      <span className="absolute right-8 top-8 h-3 w-3 rounded-full bg-orange-200" />
      <span className="absolute bottom-7 left-8 h-2.5 w-2.5 rounded-full bg-white/70" />
    </PreviewShell>
  );
}

function CometPreview({ game }: { game: GameRecord }) {
  return (
    <PreviewShell game={game} className="relative">
      <span className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-[10px] border-white/12" />
      <span className="absolute left-1/2 top-3 h-3 w-9 -translate-x-1/2 rounded-full bg-cyan-200" />
      <span className="absolute bottom-7 right-8 h-5 w-5 rounded-full bg-orange-200 shadow-[0_0_18px_rgba(254,215,170,0.6)]" />
      <span className="absolute bottom-8 right-12 h-3 w-3 rounded-full bg-cyan-100" />
    </PreviewShell>
  );
}



function BlockDropPreview({ game }: { game: GameRecord }) {
  const activeCells = new Set([2, 7, 12, 13, 18, 19, 20]);
  const floorCells = new Set([21, 22, 23]);
  return (
    <PreviewShell game={game} className="p-3">
      <div className="grid h-full grid-cols-5 gap-1.5">
        {Array.from({ length: 25 }).map((_, index) => {
          const className = ["rounded-md", activeCells.has(index) ? "bg-cyan-200" : floorCells.has(index) ? "bg-orange-200" : "bg-white/10"].join(" ");
          return <span key={index} className={className} />;
        })}
      </div>
    </PreviewShell>
  );
}

function MinePreview({ game }: { game: GameRecord }) {
  return (
    <PreviewShell game={game} className="p-3">
      <div className="grid h-full grid-cols-5 gap-1.5">
        {Array.from({ length: 25 }).map((_, index) => {
          const active = [1, 7, 18].includes(index);
          const numbered = [4, 9, 13].includes(index);
          const className = [
            "flex items-center justify-center rounded-md text-[10px] font-black",
            active ? "bg-orange-200 text-orange-950" : numbered ? "bg-cyan-200 text-cyan-950" : "bg-white/12 text-white/70",
          ].join(" ");
          return <span key={index} className={className}>{numbered ? "1" : ""}</span>;
        })}
      </div>
    </PreviewShell>
  );
}

function WordPreview({ game }: { game: GameRecord }) {
  const letters = game.slug === "hangman" ? ["_", "A", "_", "E", "_"] : ["P", "L", "A", "Y", "G", "A", "M", "E"];
  return (
    <PreviewShell game={game} className="p-4">
      <div className="grid h-full grid-cols-4 gap-2">
        {letters.map((letter, index) => {
          const className = ["flex items-center justify-center rounded-xl text-sm font-black", index % 3 === 0 ? "bg-cyan-200 text-cyan-950" : "bg-white/12 text-white"].join(" ");
          return <span key={letter + "-" + index} className={className}>{letter}</span>;
        })}
      </div>
    </PreviewShell>
  );
}

function SudokuPreview({ game }: { game: GameRecord }) {
  const clues: Record<number, string> = { 0: "5", 1: "3", 4: "7", 9: "6", 12: "1", 13: "9", 14: "5", 19: "9", 20: "8", 25: "6", 27: "8", 31: "6", 35: "3", 36: "4", 39: "8", 41: "3", 44: "1", 45: "7", 49: "2", 53: "6", 55: "6", 60: "2", 61: "8", 66: "4", 67: "1", 68: "9", 71: "5", 76: "8", 79: "7", 80: "9" };
  return <PreviewShell game={game} className="p-2"><div className="grid h-full grid-cols-9 overflow-hidden rounded border border-slate-500 bg-slate-100">
    {Array.from({ length: 81 }, (_, index) => <span key={index} className={["flex items-center justify-center border-b border-r border-slate-300 text-[8px] font-bold text-slate-900", index % 3 === 2 && index % 9 !== 8 ? "border-r-slate-700" : "", Math.floor(index / 9) % 3 === 2 ? "border-b-slate-700" : ""].join(" ")}>{clues[index] || ""}</span>)}
  </div></PreviewShell>;
}

function HangmanPreview({ game }: { game: GameRecord }) {
  return <PreviewShell game={game} className="flex flex-col items-center justify-center p-3">
    <svg viewBox="0 0 100 80" className="h-20 w-24 text-orange-200" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"><path d="M15 75H65M30 75V8H70V20" opacity=".5" /><circle cx="70" cy="30" r="10" /><path d="M70 40V60M70 45L57 55" /></g></svg>
    <div className="mt-2 flex gap-1">{["C", "", "B", "", "N"].map((letter, index) => <span key={index} className="h-6 w-4 border-b border-cyan-200 text-center text-xs font-bold text-white">{letter}</span>)}</div>
  </PreviewShell>;
}

function TubePreview({ game }: { game: GameRecord }) {
  const colors = ["bg-cyan-200", "bg-orange-200", "bg-lime-300", "bg-fuchsia-200"];
  return (
    <PreviewShell game={game} className="flex items-end justify-center gap-3 p-4">
      {colors.map((color, index) => (
        <span key={color} className="flex h-24 w-6 flex-col-reverse gap-1 rounded-b-full border border-white/15 p-1">
          {Array.from({ length: index === 3 ? 2 : 4 }).map((_, dotIndex) => <span key={dotIndex} className={["h-4 rounded-full", color].join(" ")} />)}
        </span>
      ))}
    </PreviewShell>
  );
}

function FlappyPreview({ game }: { game: GameRecord }) {
  return (
    <PreviewShell game={game} className="relative">
      <span className="absolute left-8 top-14 h-6 w-6 rounded-full bg-orange-200 shadow-[0_0_18px_rgba(254,215,170,0.6)]" />
      <span className="absolute right-10 top-0 h-12 w-8 rounded-b-xl bg-lime-300" />
      <span className="absolute right-10 bottom-0 h-12 w-8 rounded-t-xl bg-lime-300" />
      <span className="absolute inset-x-0 bottom-0 h-1 bg-cyan-200/70" />
    </PreviewShell>
  );
}

function CheckersPreview({ game }: { game: GameRecord }) {
  return (
    <PreviewShell game={game} className="p-3">
      <div className="grid h-full grid-cols-8">
        {Array.from({ length: 64 }).map((_, index) => {
          const row = Math.floor(index / 8);
          const col = index % 8;
          const piece = [8, 10, 17, 19, 42, 44, 49, 51].includes(index);
          const className = ["flex items-center justify-center", (row + col) % 2 ? "bg-slate-950" : "bg-white/10"].join(" ");
          const pieceClass = ["h-2.5 w-2.5 rounded-full", index < 32 ? "bg-cyan-200" : "bg-orange-200"].join(" ");
          return <span key={index} className={className}>{piece ? <span className={pieceClass} /> : null}</span>;
        })}
      </div>
    </PreviewShell>
  );
}

function GamePreview({ game }: { game: GameRecord }) {
  if (game.slug === "block-drop") return <BlockDropPreview game={game} />;
  if (game.slug === "minesweeper") return <MinePreview game={game} />;
  if (game.slug === "sudoku-sprint") return <SudokuPreview game={game} />;
  if (game.slug === "word-hunt") return <WordPreview game={game} />;
  if (game.slug === "hangman") return <HangmanPreview game={game} />;
  if (game.slug === "color-sort") return <TubePreview game={game} />;
  if (game.slug === "flappy-dash") return <FlappyPreview game={game} />;
  if (game.slug === "checkers-lite") return <CheckersPreview game={game} />;
  if (game.slug === "target-blitz") return <TargetPreview game={game} />;
  if (game.slug === "memory-mosaic") return <MemoryPreview game={game} />;
  if (game.slug === "pattern-pulse") return <PatternPreview game={game} />;
  if (game.slug === "number-rush") return <NumberPreview game={game} />;
  if (game.slug === "2048") return <Tile2048Preview game={game} />;
  if (game.slug === "merge-shot-2048") return <MergeShotPreview game={game} />;
  if (game.slug === "snake") return <SnakePreview game={game} />;
  if (game.slug === "four-in-a-row") return <FivePreview game={game} />;
  if (game.slug === "breakout-blitz") return <BreakoutPreview game={game} />;
  if (game.slug === "signal-sweep") return <SignalPreview game={game} />;
  if (game.slug === "comet-loop") return <CometPreview game={game} />;

  return <LanePreview game={game} />;
}

export function GameCard({ game }: GameCardProps) {
  const copy = getCardCopy(game);
  const frame = getCardFrame(game);

  return (
    <article
      className={`group overflow-hidden border border-cyan-100/12 bg-[#080b16]/92 shadow-[0_30px_80px_rgba(2,6,23,0.48)] transition duration-300 hover:-translate-y-1 hover:border-cyan-200/28 ${frame.article}`}
    >
      <div
        className={`relative overflow-hidden bg-gradient-to-br ${game.heroGradient} p-6 ${frame.hero}`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.1),rgba(2,6,23,0.36)_62%,rgba(2,6,23,0.68))]" />
        <div className={`absolute ${frame.stripe}`} />
        <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/15 blur-2xl transition group-hover:scale-125" />
        <div className="relative z-10 flex h-full min-h-60 flex-col justify-between gap-5">
          <div className="relative flex flex-wrap items-center justify-between gap-2 text-xs font-black uppercase tracking-[0.24em] text-white/82">
            <span>{game.category}</span>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <span>{game.estimatedSession}</span>
              <span className="rounded-full bg-slate-950/28 px-3 py-1 tracking-[0.16em] text-white ring-1 ring-white/12">
                {copy.badge}
              </span>
            </div>
          </div>
          <div className={`relative ${frame.previewWrap}`}>
            <GamePreview game={game} />
          </div>
          <div className="relative">
            <h3 className="text-3xl leading-none font-black tracking-tight text-white">{game.title}</h3>
            <p className="mt-2 line-clamp-2 max-w-xs text-sm text-white/80">
              {game.summary}
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-4 border-t border-cyan-100/10 p-6">
        <div className="flex items-center justify-between gap-4 text-sm text-slate-400">
          <p>{game.playersLabel}</p>
          <p className="text-right font-semibold text-cyan-100/75">
            {game.difficulty} · {game.estimatedSession}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {game.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1 text-xs font-semibold text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-slate-300">
            {copy.hook}
          </p>
          <Link
            href={`/games/${game.slug}`}
            className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-black whitespace-nowrap text-cyan-950 shadow-[0_12px_28px_rgba(34,211,238,0.22)] transition hover:bg-orange-300 hover:text-orange-950 active:translate-y-0.5"
          >
            {copy.cta}
          </Link>
        </div>
      </div>
    </article>
  );
}
