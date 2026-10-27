import type { SiteContent } from "@/lib/site-content";

export type SocialCardPalette = {
  background: string;
  panel: string;
  accent: string;
  accentSecondary: string;
};

export type SocialCardData = {
  title: string;
  description: string;
  eyebrow: string;
  motif: string;
  palette: SocialCardPalette;
};

const fallbackCard: SocialCardData = {
  title: "TurboArcade",
  description: "Free browser games for quick breaks. No downloads required.",
  eyebrow: "FREE BROWSER GAMES",
  motif: "turboarcade",
  palette: {
    background: "#020617",
    panel: "#0f172a",
    accent: "#22d3ee",
    accentSecondary: "#fb923c",
  },
};

function hashSlug(slug: string) {
  return [...slug].reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
    7,
  );
}

function paletteForSlug(slug: string): SocialCardPalette {
  const hue = hashSlug(slug) % 360;
  const secondaryHue = (hue + 82) % 360;

  return {
    background: "#020617",
    panel: `hsl(${hue}, 42%, 17%)`,
    accent: `hsl(${hue}, 84%, 62%)`,
    accentSecondary: `hsl(${secondaryHue}, 86%, 64%)`,
  };
}

export function getSiteSocialCardData(): SocialCardData {
  return fallbackCard;
}

export function getGameSocialCardData(
  content: SiteContent,
  slug: string,
): SocialCardData {
  const game = content.games.find(
    (entry) => entry.slug === slug && entry.status === "live",
  );

  if (!game) {
    return fallbackCard;
  }

  return {
    title: game.title,
    description: game.summary,
    eyebrow: `${game.category.toUpperCase()} GAME`,
    motif: game.slug,
    palette: paletteForSlug(game.slug),
  };
}
