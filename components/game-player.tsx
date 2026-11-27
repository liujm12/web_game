"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

function GameLoadingFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[360px] items-center justify-center rounded-[30px] border border-white/10 bg-slate-950/90 p-8 text-sm font-medium text-slate-300"
    >
      Loading game...
    </div>
  );
}

const MeteorSprintGame = dynamic(
  () =>
    import("@/components/games/meteor-sprint-game").then(
      (mod) => mod.MeteorSprintGame,
    ),
  { loading: GameLoadingFallback },
);
const MemoryMosaicGame = dynamic(
  () =>
    import("@/components/games/memory-mosaic-game").then(
      (mod) => mod.MemoryMosaicGame,
    ),
  { loading: GameLoadingFallback },
);
const PatternPulseGame = dynamic(
  () =>
    import("@/components/games/pattern-pulse-game").then(
      (mod) => mod.PatternPulseGame,
    ),
  { loading: GameLoadingFallback },
);
const TargetBlitzGame = dynamic(
  () =>
    import("@/components/games/target-blitz-game").then(
      (mod) => mod.TargetBlitzGame,
    ),
  { loading: GameLoadingFallback },
);
const NumberRushGame = dynamic(
  () =>
    import("@/components/games/number-rush-game").then(
      (mod) => mod.NumberRushGame,
    ),
  { loading: GameLoadingFallback },
);
const TileMerge2048Game = dynamic(
  () =>
    import("@/components/games/tile-merge-2048-game").then(
      (mod) => mod.TileMerge2048Game,
    ),
  { loading: GameLoadingFallback },
);
const MergeShot2048Game = dynamic(
  () =>
    import("@/components/games/merge-shot-2048-game").then(
      (mod) => mod.MergeShot2048Game,
    ),
  { loading: GameLoadingFallback },
);
const NeonSnakeGame = dynamic(
  () =>
    import("@/components/games/neon-snake-game").then(
      (mod) => mod.NeonSnakeGame,
    ),
  { loading: GameLoadingFallback },
);
const GomokuBoardGame = dynamic(
  () =>
    import("@/components/games/gomoku-board-game").then(
      (mod) => mod.GomokuBoardGame,
    ),
  { loading: GameLoadingFallback },
);
const BreakoutBlitzGame = dynamic(
  () =>
    import("@/components/games/breakout-blitz-game").then(
      (mod) => mod.BreakoutBlitzGame,
    ),
  { loading: GameLoadingFallback },
);
const BlockDropGame = dynamic(
  () =>
    import("@/components/games/classic-arcade").then(
      (mod) => mod.BlockDropGame,
    ),
  { loading: GameLoadingFallback },
);
const FlappyDashGame = dynamic(
  () =>
    import("@/components/games/classic-arcade").then(
      (mod) => mod.FlappyDashGame,
    ),
  { loading: GameLoadingFallback },
);
const MinesweeperGame = dynamic(
  () =>
    import("@/components/games/classic-logic").then(
      (mod) => mod.MinesweeperGame,
    ),
  { loading: GameLoadingFallback },
);
const SudokuSprintGame = dynamic(
  () =>
    import("@/components/games/classic-logic").then(
      (mod) => mod.SudokuSprintGame,
    ),
  { loading: GameLoadingFallback },
);
const ColorSortGame = dynamic(
  () =>
    import("@/components/games/classic-logic").then(
      (mod) => mod.ColorSortGame,
    ),
  { loading: GameLoadingFallback },
);
const WordHuntGame = dynamic(
  () =>
    import("@/components/games/classic-words").then(
      (mod) => mod.WordHuntGame,
    ),
  { loading: GameLoadingFallback },
);
const HangmanGame = dynamic(
  () =>
    import("@/components/games/classic-words").then(
      (mod) => mod.HangmanGame,
    ),
  { loading: GameLoadingFallback },
);
const CheckersLiteGame = dynamic(
  () =>
    import("@/components/games/classic-checkers").then(
      (mod) => mod.CheckersLiteGame,
    ),
  { loading: GameLoadingFallback },
);
const PatrolEscapeGame = dynamic(
  () =>
    import("@/components/games/patrol-escape-game").then(
      (mod) => mod.PatrolEscapeGame,
    ),
  { loading: GameLoadingFallback },
);

const GAME_COMPONENTS: Record<string, ComponentType> = {
  "meteor-sprint": MeteorSprintGame,
  "memory-mosaic": MemoryMosaicGame,
  "pattern-pulse": PatternPulseGame,
  "target-blitz": TargetBlitzGame,
  "number-rush": NumberRushGame,
  "tile-merge-2048": TileMerge2048Game,
  "merge-shot-2048": MergeShot2048Game,
  "neon-snake": NeonSnakeGame,
  "gomoku-board": GomokuBoardGame,
  "breakout-blitz": BreakoutBlitzGame,
  "block-drop": BlockDropGame,
  "minesweeper": MinesweeperGame,
  "sudoku-sprint": SudokuSprintGame,
  "word-hunt": WordHuntGame,
  "hangman": HangmanGame,
  "color-sort": ColorSortGame,
  "flappy-dash": FlappyDashGame,
  "checkers-lite": CheckersLiteGame,
  "patrol-escape": PatrolEscapeGame,
};

type GamePlayerProps = {
  componentKey: string;
};

export function GamePlayer({ componentKey }: GamePlayerProps) {
  const SelectedGame = GAME_COMPONENTS[componentKey];

  if (!SelectedGame) {
    return (
      <div className="rounded-[30px] border border-white/10 bg-slate-950 p-8 text-slate-200">
        This game is not available yet.
      </div>
    );
  }

  return <SelectedGame />;
}
