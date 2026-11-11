import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type SiteSettings = {
  brandName: string;
  tagline: string;
  description: string;
  adsenseClient: string;
  supportEmail: string;
  launchedAt: string;
  contentUpdatedAt?: string;
  adSlots?: {
    homeHero?: string;
    homepageFeatured?: string;
    gameSidebar?: string;
    gameInline?: string;
    allGamesInline?: string;
    categoryInline?: string;
  };
};

export type CategoryRecord = {
  slug: string;
  name: string;
  description: string;
  highlight: string;
};

export type GameRecord = {
  slug: string;
  editorialTier?: "A" | "B" | "C";
  title: string;
  category: string;
  summary: string;
  description: string;
  instructions: string[];
  tags: string[];
  featured: boolean;
  featuredPriority?: number;
  trendingScore: number;
  difficulty: string;
  playersLabel: string;
  status: "draft" | "live";
  estimatedSession: string;
  componentKey: string;
  playMode?: "internal" | "embed";
  gameUrl?: string;
  heroGradient: string;
  seoTitle: string;
  seoDescription: string;
  controls?: string[];
  bestFor?: string[];
  playNotes?: string[];
  strategyTips?: string[];
  commonMistakes?: string[];
  faq?: {
    question: string;
    answer: string;
  }[];
  testedOn?: string[];
  lastChecked?: string;
  relatedHub?: {
    href: string;
    label: string;
    description?: string;
  };
};

export type SiteContent = {
  site: SiteSettings;
  categories: CategoryRecord[];
  games: GameRecord[];
};

const CONTENT_PATH = path.join(process.cwd(), "data", "site-content.json");

export async function getSiteContent(
  filePath = CONTENT_PATH,
): Promise<SiteContent> {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as SiteContent;
}

export async function saveSiteContent(
  content: SiteContent,
  filePath = CONTENT_PATH,
) {
  await writeFile(filePath, JSON.stringify(content, null, 2), "utf8");
}

export function isPublicGame(game: GameRecord) {
  return game.status === "live" && game.editorialTier !== "C";
}

export function getPublicGames(content: SiteContent) {
  return content.games.filter(isPublicGame);
}

export function getCoreGames(content: SiteContent) {
  return getPublicGames(content).filter((game) => game.editorialTier === "A");
}

export function getFeaturedGames(content: SiteContent) {
  return [...content.games]
    .filter(
      (game) =>
        game.featured && game.editorialTier === "A" && isPublicGame(game),
    )
    .sort((left, right) => {
      const priorityDelta = (right.featuredPriority ?? 0) - (left.featuredPriority ?? 0);

      if (priorityDelta !== 0) {
        return priorityDelta;
      }

      return right.trendingScore - left.trendingScore;
    });
}

export function getTrendingGames(content: SiteContent) {
  return [...content.games]
    .filter(isPublicGame)
    .sort((left, right) => right.trendingScore - left.trendingScore);
}

export function getGameBySlug(content: SiteContent, slug: string) {
  return content.games.find((game) => game.slug === slug) ?? null;
}

export function getCategoryBySlug(content: SiteContent, slug: string) {
  return content.categories.find((category) => category.slug === slug) ?? null;
}

export function getGamesByCategory(content: SiteContent, slug: string) {
  return content.games.filter(
    (game) => game.category === slug && isPublicGame(game),
  );
}

export async function updateGameRecord(
  filePath: string | undefined,
  slug: string,
  patch: Partial<GameRecord>,
) {
  const content = await getSiteContent(filePath);
  const nextGames = content.games.map((game) =>
    game.slug === slug ? { ...game, ...patch } : game,
  );

  await saveSiteContent({ ...content, games: nextGames }, filePath);
}
