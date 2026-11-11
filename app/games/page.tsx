import type { Metadata } from "next";

import { AdSlot } from "@/components/ad-slot";
import { GameCard } from "@/components/game-card";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getCoreGames,
  getPublicGames,
  getSiteContent,
} from "@/lib/site-content";
import { buildSocialMetadata } from "@/lib/social-metadata";
import { buildGameCollectionStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = buildSocialMetadata({
  title: "All Games | TurboArcade",
  description:
    "Browse TurboArcade's editorial core and tested browser-game collections, organized by play style instead of one endless shelf.",
  path: "/games",
});

export default async function AllGamesPage() {
  const content = await getSiteContent();
  const publicGames = getPublicGames(content);
  const coreGames = getCoreGames(content);
  const secondaryGames = publicGames.filter((game) => game.editorialTier === "B");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <JsonLd
        data={buildGameCollectionStructuredData({
          title: "All Games | TurboArcade",
          description:
            "Browse TurboArcade's editorial core and tested browser-game collections.",
          path: "/games",
          games: publicGames,
        })}
      />
      <SiteHeader brandName={content.site.brandName} />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <section className="rounded-[36px] border border-white/10 bg-slate-900/75 p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/70">
                All games
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                A curated catalog of playable browser games
              </h1>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-400">
              Start with eight games that have the strongest original mechanics,
              guides, screenshots, and practical play guidance. The remaining games
              are grouped by play style instead of mixed into one oversized grid.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-orange-200/70">
                Core games
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">{coreGames.length}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">
                More tested games
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {secondaryGames.length}
              </p>
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
                Editorial core
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Start with our eight core games
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-400">
              These pages have the deepest game-specific instructions, tested
              strategies, mistake analysis, related guides, real gameplay images,
              and verified play observations.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {coreGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </section>

        <AdSlot
          label="All games inline placement"
          slot={content.site.adSlots?.allGamesInline}
          className="mt-10"
        />

        {content.categories.map((category) => {
          const categoryGames = secondaryGames.filter(
            (game) => game.category === category.slug,
          );

          if (!categoryGames.length) return null;

          return (
            <section key={category.slug} className="mt-12">
              <div className="rounded-[28px] border border-cyan-100/12 bg-[#0a0d18]/88 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.38)]">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/70">
                  Tested secondary catalog
                </p>
                <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <h2 className="text-3xl font-semibold text-white">
                    More {category.name} games
                  </h2>
                  <p className="max-w-xl text-sm leading-7 text-slate-400">
                    {category.description}
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {categoryGames.map((game) => (
                  <GameCard key={game.slug} game={game} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
      <SiteFooter
        brandName={content.site.brandName}
        supportEmail={content.site.supportEmail}
      />
    </div>
  );
}
