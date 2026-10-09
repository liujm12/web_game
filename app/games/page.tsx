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



        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          {[
            ["Keyboard-friendly picks", "2048, Snake, Breakout Blitz, and Meteor Sprint are good starting points if you are playing on a laptop or desktop."],
            ["Best on a phone", "Target Blitz, Number Rush, Memory Mosaic, and Pattern Pulse use large tap targets and simple actions."],
            ["Slower brain breaks", "Choose 2048, five-in-a-row, or Memory Mosaic when you want a calmer session with fewer reflex demands."],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-[26px] border border-cyan-100/12 bg-[#0a0d18]/88 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.38)]"
            >
              <h2 className="text-xl font-black text-white">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">{body}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-[30px] border border-orange-200/12 bg-[#0a0d18]/88 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200/70">
            Catalog notes
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <p className="text-sm leading-7 text-slate-300">
              We keep this list intentionally small while the site is in its early stage. New games are added only after the controls, mobile layout, and retry flow are checked.
            </p>
            <p className="text-sm leading-7 text-slate-300">
              If a game uses an embedded HTML5 source, its page still includes TurboArcade notes, controls, and practical context so visitors are not landing on a blank frame.
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
