import { EmbedGameFrame } from "@/components/embed-game-frame";
import { GamePlayer } from "@/components/game-player";
import type { GameRecord } from "@/lib/site-content";

type GameSurfaceProps = {
  game: GameRecord;
};

export function GameSurface({ game }: GameSurfaceProps) {
  if (game.playMode === "embed" && game.gameUrl) {
    return <EmbedGameFrame title={game.title} gameUrl={game.gameUrl} />;
  }

  return <GamePlayer componentKey={game.componentKey} />;
}
