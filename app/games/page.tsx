import type { Metadata } from "next";

import { AdSlot } from "@/components/ad-slot";
import { GameCard } from "@/components/game-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "All Games | TurboArcade",
  description:
    "Browse every live browser game on TurboArcade in one place.",
};

export default async function AllGamesPage() {
  const content = await getSiteContent();
  const liveGames = content.games.filter((game) => game.status === "live");
  const featuredCount = liveGames.filter((game) => game.featured).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader brandName={content.site.brandName} />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <section className="rounded-[36px] border border-white/10 bg-slate-900/75 p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/70">
                All games
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                All browser games, one quick shelf
              </h1>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-400">
              Browse every live game without hopping between sections first.
              Pick by mood, by pace, or just open the next thing that looks fun.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-orange-200/70">
                Live now
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">{liveGames.length}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">
                Featured picks
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">{featuredCount}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-fuchsia-200/70">
                Categories
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {content.categories.length}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[30px] border border-white/10 bg-slate-900/65 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200/70">
                Browse everything
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Every live game in the catalog
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-400">
              This page is the fastest way for players to see the full lineup at
              once, especially as the catalog grows beyond the homepage shelves.
            </p>
          </div>
        </section>

        <AdSlot
          label="All games inline placement"
          slot={content.site.adSlots?.allGamesInline}
          className="mt-10"
        />

        <section className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {liveGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </section>
      </main>
      <SiteFooter
        brandName={content.site.brandName}
        supportEmail={content.site.supportEmail}
      />
    </div>
  );
}
