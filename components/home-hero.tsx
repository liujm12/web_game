import Link from "next/link";

import type { GameRecord, SiteSettings } from "@/lib/site-content";

type HomeHeroProps = {
  site: SiteSettings;
  featuredGame: GameRecord;
};

const playerValueItems = [
  { value: "No download", label: "Open a tab and go" },
  { value: "Phone friendly", label: "Built for quick thumb play" },
  { value: "Quick sessions", label: "Most runs finish in under 2 minutes" },
];

export function HomeHero({ site, featuredGame }: HomeHeroProps) {
  return (
    <div className="rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.22),_transparent_42%),linear-gradient(135deg,rgba(15,23,42,1),rgba(30,41,59,0.96),rgba(15,23,42,1))] p-8 shadow-[0_40px_100px_rgba(8,15,35,0.5)] lg:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/75">
        Free browser games for quick breaks
      </p>
      <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
        Play in your browser. No waiting around.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
        {site.brandName} keeps it simple: fast-loading games, easy rules, and
        just enough challenge to make one more round feel worth it.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href={`/games/${featuredGame.slug}`}
          className="rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
        >
          {`Play ${featuredGame.title} now`}
        </Link>
        <Link
          href="#featured-games"
          className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Browse quick games
        </Link>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {playerValueItems.map((item) => (
          <div
            key={item.value}
            className="rounded-[24px] border border-white/10 bg-white/5 p-4"
          >
            <p className="text-2xl font-semibold text-white">{item.value}</p>
            <p className="mt-2 text-sm text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
