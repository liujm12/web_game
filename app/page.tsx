import Link from "next/link";

import { GameCard } from "@/components/game-card";
import { HomeHero } from "@/components/home-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getFeaturedGames,
  getSiteContent,
  getTrendingGames,
} from "@/lib/site-content";

const quickChoiceChips = [
  "20 sec rush",
  "Brain warm-up",
  "Arcade run",
  "Keyboard ready",
  "Thumb friendly",
];

export default async function Home() {
  const content = await getSiteContent();
  const featuredGames = getFeaturedGames(content);
  const trendingGames = getTrendingGames(content);

  return (
    <div className="min-h-screen text-white">
      <SiteHeader brandName={content.site.brandName} />
      <main>
        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:py-12 lg:grid-cols-[1.12fr_0.88fr] lg:px-10 lg:py-16">
          <HomeHero
            site={content.site}
            featuredGame={featuredGames[0] ?? trendingGames[0]}
          />
          <div className="grid gap-6">
            <div className="relative overflow-hidden rounded-[28px] border border-orange-200/15 bg-[#0a0d18]/88 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.42)]">
              <div className="absolute right-4 top-4 h-16 w-16 rounded-full border border-orange-200/20" />
              <h2 className="text-2xl font-black text-white">
                Pick your break
              </h2>
              <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
                <li><span className="font-semibold text-cyan-100">Short run:</span> jump into a score chase before your coffee cools.</li>
                <li><span className="font-semibold text-cyan-100">Brain tap:</span> clear a board when you want something calmer.</li>
                <li><span className="font-semibold text-cyan-100">Classic hit:</span> grab a familiar arcade loop and try again fast.</li>
              </ul>
            </div>
            <div className="rounded-[28px] border border-cyan-100/15 bg-[#0a0d18]/88 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.42)]">
              <h2 className="text-2xl font-black text-white">
                Turbo queue
              </h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {quickChoiceChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <div className="mt-5 grid gap-3">
                {trendingGames.slice(0, 3).map((game) => (
                  <Link
                    key={game.slug}
                    href={`/games/${game.slug}`}
                    className="group flex items-center justify-between rounded-[18px] border border-white/10 bg-white/[0.045] px-4 py-4 transition hover:-translate-y-0.5 hover:border-cyan-200/25 hover:bg-cyan-300/8"
                  >
                    <div>
                      <p className="text-base font-black text-white">{game.title}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {game.estimatedSession} / {game.category}
                      </p>
                    </div>
                    <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-black text-cyan-950 transition group-hover:bg-orange-300 group-hover:text-orange-950">
                      Go
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="featured-games"
          className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Choose your next run
              </h2>
            </div>
            <p className="hidden max-w-lg text-sm leading-7 text-slate-400 md:block">
              These cards should feel like quick decisions, not homework. Every
              one opens straight into a playable game page.
            </p>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {featuredGames.slice(0, 6).map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-2">
            {content.categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group relative overflow-hidden rounded-[28px] border border-cyan-100/12 bg-[#0a0d18]/88 p-7 shadow-[0_24px_70px_rgba(2,6,23,0.42)] transition hover:-translate-y-1 hover:border-cyan-300/30"
              >
                <div className="absolute right-0 top-0 h-full w-32 bg-[linear-gradient(135deg,rgba(34,211,238,0.14),rgba(251,146,60,0.16))] opacity-70 transition group-hover:opacity-100" />
                <p className="relative text-xs font-black uppercase tracking-[0.24em] text-cyan-100/75">
                  {category.highlight}
                </p>
                <h3 className="relative mt-4 text-3xl font-black text-white">
                  {category.name}
                </h3>
                <p className="relative mt-3 max-w-xl text-sm leading-7 text-slate-300">
                  {category.description}
                </p>
                <p className="relative mt-5 text-sm font-black text-orange-200">
                  {`See ${category.name.toLowerCase()} games`}
                </p>
              </Link>
            ))}
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
