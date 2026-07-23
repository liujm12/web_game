"use client";

import { BreakoutBlitzGame } from "@/components/games/breakout-blitz-game";
import { ConnectFourGame } from "@/components/games/connect-four-game";
import { GomokuBoardGame } from "@/components/games/gomoku-board-game";
import { MemoryMosaicGame } from "@/components/games/memory-mosaic-game";
import { MeteorSprintGame } from "@/components/games/meteor-sprint-game";
import { NeonSnakeGame } from "@/components/games/neon-snake-game";
import { NumberRushGame } from "@/components/games/number-rush-game";
import { PatternPulseGame } from "@/components/games/pattern-pulse-game";
import { TargetBlitzGame } from "@/components/games/target-blitz-game";
import { TileMerge2048Game } from "@/components/games/tile-merge-2048-game";

type GamePlayerProps = {
  componentKey: string;
};

export function GamePlayer({ componentKey }: GamePlayerProps) {
  switch (componentKey) {
    case "meteor-sprint":
      return <MeteorSprintGame />;
    case "memory-mosaic":
      return <MemoryMosaicGame />;
    case "pattern-pulse":
      return <PatternPulseGame />;
    case "target-blitz":
      return <TargetBlitzGame />;
    case "number-rush":
      return <NumberRushGame />;
    case "tile-merge-2048":
      return <TileMerge2048Game />;
    case "neon-snake":
      return <NeonSnakeGame />;
    case "connect-four":
      return <ConnectFourGame />;
    case "gomoku-board":
      return <GomokuBoardGame />;
    case "breakout-blitz":
      return <BreakoutBlitzGame />;
    default:
      return (
        <div className="rounded-[30px] border border-white/10 bg-slate-950 p-8 text-slate-200">
          This game is not available yet.
        </div>
      );
  }
}
