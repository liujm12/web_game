import Link from "next/link";

import type { GameRecord } from "@/lib/site-content";

type GameCardProps = {
  game: GameRecord;
};

export function GameCard({ game }: GameCardProps) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/75 shadow-[0_30px_70px_rgba(15,23,42,0.35)]">
      <div
        className={`h-48 bg-gradient-to-br ${game.heroGradient} p-6 transition duration-300 group-hover:scale-[1.02]`}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/75">
            <span>{game.category}</span>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <span>{game.estimatedSession}</span>
              <span className="rounded-full bg-slate-950/20 px-3 py-1 tracking-[0.18em] text-white">
                Tap to play
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-white">{game.title}</h3>
            <p className="mt-2 max-w-xs text-sm text-white/80">{game.summary}</p>
          </div>
        </div>
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <p>{game.playersLabel}</p>
          <p>{`Hot score ${game.trendingScore}`}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {game.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-slate-300">
            {`Best if you want a ${game.difficulty.toLowerCase()} start.`}
          </p>
          <Link
            href={`/games/${game.slug}`}
            className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold whitespace-nowrap text-slate-950 transition hover:bg-cyan-200"
          >
            Play
          </Link>
        </div>
      </div>
    </article>
  );
}
