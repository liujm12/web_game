import type { Metadata } from "next";

import { isPublicGame, type GameRecord } from "@/lib/site-content";
import { buildSocialMetadata } from "@/lib/social-metadata";

export function buildGamePageMetadata(game: GameRecord | null): Metadata {
  if (!game || !isPublicGame(game)) {
    return {
      title: "Game not found | TurboArcade",
    };
  }

  return buildSocialMetadata({
    title: game.seoTitle,
    description: game.seoDescription,
    path: `/games/${game.slug}`,
    image: `/games/${game.slug}/opengraph-image`,
    imageAlt: `${game.title} free browser game social card`,
  });
}
