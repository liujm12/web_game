export const PLAYER_PROFILE_KEY = "turboarcade-player-v1";
export const PLAYER_PROFILE_EVENT = "turboarcade-profile-change";

export type RecentGame = {
  slug: string;
  playedAt: number;
};

export type BestScore = {
  score: number;
  label: string;
  updatedAt: number;
};

export type PlayerProfile = {
  favorites: string[];
  recent: RecentGame[];
  bestScores: Record<string, BestScore>;
};

export function createEmptyPlayerProfile(): PlayerProfile {
  return {
    favorites: [],
    recent: [],
    bestScores: {},
  };
}

function parseBestScores(value: unknown): Record<string, BestScore> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, BestScore] =>
        Boolean(entry[1]) &&
        typeof entry[1] === "object" &&
        typeof (entry[1] as BestScore).score === "number" &&
        typeof (entry[1] as BestScore).label === "string" &&
        typeof (entry[1] as BestScore).updatedAt === "number",
    ),
  );
}

export function parsePlayerProfile(raw: string | null): PlayerProfile {
  if (!raw) {
    return createEmptyPlayerProfile();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PlayerProfile>;

    return {
      favorites: Array.isArray(parsed.favorites)
        ? parsed.favorites.filter((slug): slug is string => typeof slug === "string")
        : [],
      recent: Array.isArray(parsed.recent)
        ? parsed.recent
            .filter(
              (item): item is RecentGame =>
                typeof item?.slug === "string" && typeof item?.playedAt === "number",
            )
            .slice(0, 12)
        : [],
      bestScores: parseBestScores(parsed.bestScores),
    };
  } catch {
    return createEmptyPlayerProfile();
  }
}

export function toggleFavorite(profile: PlayerProfile, slug: string): PlayerProfile {
  const isFavorite = profile.favorites.includes(slug);

  return {
    ...profile,
    favorites: isFavorite
      ? profile.favorites.filter((favorite) => favorite !== slug)
      : [slug, ...profile.favorites],
  };
}

export function recordGameVisit(
  profile: PlayerProfile,
  slug: string,
  playedAt = Date.now(),
): PlayerProfile {
  return {
    ...profile,
    recent: [
      { slug, playedAt },
      ...profile.recent.filter((item) => item.slug !== slug),
    ].slice(0, 12),
  };
}

export function recordBestScore(
  profile: PlayerProfile,
  slug: string,
  score: number,
  label: string,
  updatedAt = Date.now(),
): PlayerProfile {
  const currentBest = profile.bestScores[slug];

  if (currentBest && currentBest.score >= score) {
    return profile;
  }

  return {
    ...profile,
    bestScores: {
      ...profile.bestScores,
      [slug]: { score, label, updatedAt },
    },
  };
}

export function getDailyChallenge(slugs: string[], dateKey: string) {
  if (slugs.length === 0) {
    return null;
  }

  const seed = Array.from(dateKey).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );

  return slugs[seed % slugs.length];
}

export function getUtcDateKey(date = new Date()) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function wasPlayedOnDate(
  profile: PlayerProfile,
  slug: string,
  dateKey: string,
) {
  return profile.recent.some(
    (item) => item.slug === slug && getUtcDateKey(new Date(item.playedAt)) === dateKey,
  );
}

export function readPlayerProfile() {
  if (typeof window === "undefined") {
    return createEmptyPlayerProfile();
  }

  try {
    if (typeof window.localStorage?.getItem !== "function") {
      return createEmptyPlayerProfile();
    }

    return parsePlayerProfile(window.localStorage.getItem(PLAYER_PROFILE_KEY));
  } catch {
    return createEmptyPlayerProfile();
  }
}

export function writePlayerProfile(profile: PlayerProfile) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (typeof window.localStorage?.setItem !== "function") {
      return;
    }

    window.localStorage.setItem(PLAYER_PROFILE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new Event(PLAYER_PROFILE_EVENT));
  } catch {
    return;
  }
}

export function readPlayerProfileSnapshot() {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    return typeof window.localStorage?.getItem === "function"
      ? window.localStorage.getItem(PLAYER_PROFILE_KEY) ?? ""
      : "";
  } catch {
    return "";
  }
}

export function saveGameVisit(slug: string) {
  writePlayerProfile(recordGameVisit(readPlayerProfile(), slug));
}

export function saveBestScore(slug: string, score: number, label: string) {
  writePlayerProfile(recordBestScore(readPlayerProfile(), slug, score, label));
}
