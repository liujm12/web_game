import Link from "next/link";

import { AdSlot } from "@/components/ad-slot";
import { GameCard } from "@/components/game-card";
import { HomeHero } from "@/components/home-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getFeaturedGames,
  getSiteContent,
  getTrendingGames,
} from "@/lib/site-content";

export default async function Home() {
  const content = await getSiteContent();
  const featuredGames = getFeaturedGames(content);
  const trendingGames = getTrendingGames(content);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader brandName={content.site.brandName} />
      <main>
        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-18">
          <HomeHero
            site={content.site}
            featuredGame={featuredGames[0] ?? trendingGames[0]}
          />
          <div className="grid gap-6">
            <AdSlot label="Homepage leaderboard placement" />
            <div className="rounded-[32px] border border-white/10 bg-slate-900/75 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200/70">
                Why players click back in
              </p>
              <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
                <li>Rules are easy to understand in a few seconds.</li>
                <li>Game pages load fast and feel made for quick breaks.</li>
                <li>Every game has its own landing page, so finding the next one is easy.</li>
              </ul>
            </div>
            <div className="rounded-[32px] border border-white/10 bg-slate-900/75 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/70">
                Start here
              </p>
              <div className="mt-5 grid gap-3">
                {trendingGames.slice(0, 3).map((game) => (
                  <Link
                    key={game.slug}
                    href={`/games/${game.slug}`}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition hover:bg-white/8"
                  >
                    <div>
                      <p className="text-base font-semibold text-white">{game.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">
                        {game.estimatedSession} / {game.difficulty}
                      </p>
                    </div>
                    <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-semibold text-slate-950">
                      Play
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-4 lg:px-10">
          <div className="rounded-[30px] border border-white/10 bg-slate-900/65 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200/70">
                  Popular right now
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white">
                  Quick picks for your next two minutes
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-slate-400">
                Pick a reflex game, a memory round, or a light sequence challenge
                without leaving the browser.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {trendingGames.slice(0, 3).map((game, index) => (
                <Link
                  key={game.slug}
                  href={`/games/${game.slug}`}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-5 transition hover:bg-white/8"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/70">
                    {index === 0 ? "Most played" : index === 1 ? "Quick favorite" : "Worth a try"}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{game.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{game.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section
          id="featured-games"
          className="mx-auto max-w-7xl px-6 py-8 lg:px-10"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200/70">
                Featured
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Pick a lane, then hit play
              </h2>
            </div>
            <p className="hidden max-w-lg text-sm leading-7 text-slate-400 md:block">
              These cards should feel like quick decisions, not homework. Every
              one opens straight into a playable game page.
            </p>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {featuredGames.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-2">
            {content.categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="rounded-[32px] border border-white/10 bg-slate-900/75 p-7 transition hover:-translate-y-0.5 hover:border-cyan-300/30"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/70">
                  {category.highlight}
                </p>
                <h3 className="mt-4 text-3xl font-semibold text-white">
                  {category.name}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                  {category.description}
                </p>
                <p className="mt-5 text-sm font-semibold text-cyan-200">
                  {`See ${category.name.toLowerCase()} games`}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <div className="rounded-[36px] border border-white/10 bg-slate-900/75 p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-200/70">
                  Trending now
                </p>
                <h2 className="mt-3 text-3xl font-semibold">What players jump into first</h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-slate-400">
                The goal here is instant clarity: see the game, understand the
                hook, and know whether it fits your next break.
              </p>
            </div>
            <div className="mt-8 grid gap-4">
              {trendingGames.map((game, index) => (
                <Link
                  key={game.slug}
                  href={`/games/${game.slug}`}
                  className="grid gap-4 rounded-[26px] border border-white/10 bg-white/5 p-5 transition hover:bg-white/7 md:grid-cols-[80px_1fr_auto]"
                >
                  <div className="text-3xl font-semibold text-cyan-200">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-white">{game.title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      {game.summary}
                    </p>
                  </div>
                  <div className="text-sm text-slate-400">
                    {`${game.estimatedSession} / score ${game.trendingScore}`}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter
        brandName={content.site.brandName}
        supportEmail={content.site.supportEmail}
      />
    </div>
  );
}
