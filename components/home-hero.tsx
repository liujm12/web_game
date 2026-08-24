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
    <div className="relative w-full min-w-0 overflow-hidden rounded-[30px] border border-cyan-100/15 bg-[#070a16] p-5 shadow-[0_34px_100px_rgba(2,6,23,0.62)] sm:p-8 lg:p-10">
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#22d3ee,#fb923c,#22d3ee)]" />
      <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cyan-300/14 blur-3xl" />
      <div className="absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-orange-400/12 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1fr_320px] lg:items-center">
        <div>
          <p className="inline-flex rounded-full border border-cyan-100/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">
            Free browser games for quick breaks
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl leading-[0.95] font-black tracking-tight text-balance text-white sm:text-6xl">
            Play in your browser. No waiting around.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">
            {site.brandName} keeps it simple: fast-loading games, easy rules, and
            just enough challenge to make one more round feel worth it.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
            <Link
              href={`/games/${featuredGame.slug}`}
              className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-black text-cyan-950 shadow-[0_14px_34px_rgba(34,211,238,0.28)] transition hover:-translate-y-0.5 hover:bg-cyan-200 active:translate-y-0 sm:px-6"
            >
              {`Play ${featuredGame.title} now`}
            </Link>
            <Link
              href="#featured-games"
              className="rounded-full border border-orange-200/20 bg-orange-300/10 px-5 py-3 text-sm font-semibold text-orange-100 transition hover:-translate-y-0.5 hover:bg-orange-300/15 active:translate-y-0 sm:px-6"
            >
              Browse quick games
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xs rounded-[28px] border border-white/12 bg-slate-950/72 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_26px_70px_rgba(0,0,0,0.45)]">
          <div className="rounded-[22px] border border-cyan-100/15 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.22),transparent_44%),#020617] p-4">
            <div className="mb-4 flex items-center justify-between text-xs font-black uppercase tracking-[0.24em] text-cyan-100/80">
              <span>Turbo</span>
              <span className="text-orange-200">Ready</span>
            </div>
            <div className="grid h-40 grid-cols-3 gap-3">
              {[0, 1, 2].map((lane) => (
                <div
                  key={lane}
                  className="relative overflow-hidden rounded-full bg-white/7 ring-1 ring-white/10"
                >
                  <span className="absolute inset-x-1 top-3 h-10 rounded-full bg-white/8" />
                  {lane === 1 ? (
                    <span className="absolute bottom-5 left-1/2 h-11 w-8 -translate-x-1/2 rounded-full bg-cyan-200 shadow-[0_0_24px_rgba(165,243,252,0.65)]" />
                  ) : null}
                  {lane === 2 ? (
                    <span className="absolute top-16 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-orange-200 shadow-[0_0_22px_rgba(254,215,170,0.58)]" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <span className="h-3 rounded-full bg-cyan-300" />
            <span className="h-3 rounded-full bg-orange-300" />
            <span className="h-3 rounded-full bg-white/18" />
          </div>
        </div>
      </div>

      <div className="relative mt-8 grid gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4">
        {playerValueItems.map((item) => (
          <div
            key={item.value}
            className="rounded-[20px] border border-cyan-100/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
          >
            <p className="text-xl font-black text-white sm:text-2xl">{item.value}</p>
            <p className="mt-2 text-sm text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
