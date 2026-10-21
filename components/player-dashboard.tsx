"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";

import {
  type BestScore,
  getDailyChallenge,
  getUtcDateKey,
  parsePlayerProfile,
  PLAYER_PROFILE_EVENT,
  readPlayerProfileSnapshot,
  wasPlayedOnDate,
} from "@/lib/player-profile";
import type { GameRecord } from "@/lib/site-content";

type PlayerDashboardProps = {
  games: GameRecord[];
  compact?: boolean;
};

const dailyChallengeSlugs = [
  "2048",
  "patrol-escape",
  "snake",
  "target-blitz",
  "number-rush",
  "breakout-blitz",
  "block-drop",
  "minesweeper",
  "word-hunt",
];

function subscribe(callback: () => void) {
  window.addEventListener(PLAYER_PROFILE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(PLAYER_PROFILE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  return readPlayerProfileSnapshot();
}

function getServerSnapshot() {
  return "";
}

export function PlayerDashboard({ games, compact = false }: PlayerDashboardProps) {
  const rawProfile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const profile = useMemo(() => parsePlayerProfile(rawProfile), [rawProfile]);
  const gamesBySlug = useMemo(
    () => new Map(games.map((game) => [game.slug, game])),
    [games],
  );
  const challengePool = dailyChallengeSlugs.filter((slug) => gamesBySlug.has(slug));
  const dateKey = getUtcDateKey();
  const dailySlug = getDailyChallenge(challengePool, dateKey);
  const dailyGame = dailySlug ? gamesBySlug.get(dailySlug) : null;
  const dailyComplete = dailySlug
    ? wasPlayedOnDate(profile, dailySlug, dateKey)
    : false;
  const favoriteGames = profile.favorites
    .map((slug) => gamesBySlug.get(slug))
    .filter((game): game is GameRecord => Boolean(game));
  const recentGames = profile.recent
    .map((item) => gamesBySlug.get(item.slug))
    .filter((game): game is GameRecord => Boolean(game));
  const bestScores = Object.entries(profile.bestScores)
    .map(([slug, score]) => ({ game: gamesBySlug.get(slug), score }))
    .filter((entry): entry is { game: GameRecord; score: BestScore } =>
      Boolean(entry.game),
    )
    .sort((left, right) => right.score.updatedAt - left.score.updatedAt);

  const cardClass =
    "rounded-[24px] border border-white/10 bg-white/[0.045] p-5";

  return (
    <section
      aria-label="Your TurboArcade games"
      className="rounded-[32px] border border-cyan-100/12 bg-[#080b16]/92 p-5 shadow-[0_28px_80px_rgba(2,6,23,0.46)] sm:p-7"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200/70">
            Your games, on this device
          </p>
          <h2 className="mt-3 text-3xl font-black text-white">
            Pick up where you left off
          </h2>
        </div>
        {compact ? (
          <Link href="/my-games" className="text-sm font-black text-orange-200 hover:text-orange-100">
            Open My Games
          </Link>
        ) : null}
      </div>

      {dailyGame ? (
        <div className="mt-6 overflow-hidden rounded-[26px] border border-cyan-200/18 bg-gradient-to-r from-cyan-400/15 via-sky-400/8 to-orange-300/12 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-100/75">
                Daily challenge
              </p>
              <h3 className="mt-2 text-2xl font-black text-white">{dailyGame.title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
                {dailyComplete
                  ? "Challenge visited today. Return for a cleaner run or a stronger score."
                  : `${dailyGame.summary} Play it today to complete your daily pick.`}
              </p>
            </div>
            <Link
              href={`/games/${dailyGame.slug}`}
              className="shrink-0 rounded-full bg-cyan-300 px-5 py-3 text-center text-sm font-black text-cyan-950 transition hover:bg-orange-300 hover:text-orange-950"
            >
              {dailyComplete ? "Play again" : "Start challenge"}
            </Link>
          </div>
        </div>
      ) : null}

      <div className={`mt-6 grid gap-4 ${compact ? "lg:grid-cols-3" : "lg:grid-cols-3"}`}>
        <div className={cardClass}>
          <h3 className="font-black text-white">Recently played</h3>
          {recentGames.length > 0 ? (
            <div className="mt-4 space-y-2">
              {recentGames.slice(0, compact ? 3 : 6).map((game) => (
                <Link key={game.slug} href={`/games/${game.slug}`} className="block rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-cyan-300/10 hover:text-cyan-100">
                  {game.title}
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Play a game to build your recent list.
            </p>
          )}
        </div>

        <div className={cardClass}>
          <h3 className="font-black text-white">Saved games</h3>
          {favoriteGames.length > 0 ? (
            <div className="mt-4 space-y-2">
              {favoriteGames.slice(0, compact ? 3 : 6).map((game) => (
                <Link key={game.slug} href={`/games/${game.slug}`} className="block rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-orange-300/10 hover:text-orange-100">
                  {game.title}
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Save a favorite from any game page.
            </p>
          )}
        </div>

        <div className={cardClass}>
          <h3 className="font-black text-white">Personal bests</h3>
          {bestScores.length > 0 ? (
            <div className="mt-4 space-y-2">
              {bestScores.slice(0, compact ? 3 : 8).map(({ game, score }) => (
                <Link key={game.slug} href={`/games/${game.slug}`} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2 text-sm hover:bg-lime-300/10">
                  <span className="text-slate-200">{game.title}</span>
                  <span className="font-black text-lime-200">{score.label}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Finish a supported game to save your first best.
            </p>
          )}
        </div>
      </div>
      <p className="mt-5 text-xs leading-6 text-slate-500">
        Your library and scores stay in this browser. TurboArcade does not require an account.
      </p>
    </section>
  );
}
