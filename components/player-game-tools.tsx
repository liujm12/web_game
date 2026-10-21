"use client";

import Link from "next/link";
import { useEffect, useMemo, useSyncExternalStore } from "react";

import {
  parsePlayerProfile,
  PLAYER_PROFILE_EVENT,
  readPlayerProfileSnapshot,
  readPlayerProfile,
  saveGameVisit,
  toggleFavorite,
  writePlayerProfile,
} from "@/lib/player-profile";

type PlayerGameToolsProps = {
  slug: string;
  title: string;
};

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

export function PlayerGameTools({ slug, title }: PlayerGameToolsProps) {
  const rawProfile = useSyncExternalStore(subscribe, getSnapshot, () => "");
  const profile = useMemo(() => parsePlayerProfile(rawProfile), [rawProfile]);
  const isFavorite = profile.favorites.includes(slug);
  const bestScore = profile.bestScores[slug];

  useEffect(() => {
    saveGameVisit(slug);
  }, [slug]);

  function handleFavorite() {
    writePlayerProfile(toggleFavorite(readPlayerProfile(), slug));
  }

  return (
    <div className="rounded-[24px] border border-cyan-100/12 bg-[#0a0d18]/88 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200/70">
            Your progress
          </p>
          <p className="mt-1 text-sm text-slate-300">
            {bestScore ? `Personal best: ${bestScore.label}` : `Play ${title} to set a personal best.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleFavorite}
            aria-pressed={isFavorite}
            className={`rounded-full px-4 py-2 text-sm font-black transition ${
              isFavorite
                ? "bg-orange-300 text-orange-950"
                : "border border-white/10 bg-white/5 text-white hover:bg-orange-300/15"
            }`}
          >
            {isFavorite ? "Saved" : "Save game"}
          </button>
          <Link href="/my-games" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-cyan-100 hover:bg-cyan-300/10">
            My Games
          </Link>
        </div>
      </div>
    </div>
  );
}
