import type { GameRecord } from "@/lib/site-content";

export function getGameDifficultyDisplay(
  game: Pick<GameRecord, "difficulty" | "difficultyRange">,
) {
  return game.difficultyRange ?? game.difficulty;
}
