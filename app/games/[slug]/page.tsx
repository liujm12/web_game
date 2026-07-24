import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/ad-slot";
import { GameCard } from "@/components/game-card";
import { GamePageIntro } from "@/components/game-page-intro";
import { GameSurface } from "@/components/game-surface";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getGameBySlug, getSiteContent } from "@/lib/site-content";

type GamePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const game = getGameBySlug(content, slug);

  if (!game) {
    return {
      title: "Game not found | TurboArcade",
    };
  }

  return {
    title: game.seoTitle,
    description: game.seoDescription,
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const content = await getSiteContent();
  const game = getGameBySlug(content, slug);

  if (!game || game.status !== "live") {
    notFound();
  }

  const relatedGames = content.games.filter(
    (entry) => entry.slug !== game.slug && entry.status === "live",
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader brandName={content.site.brandName} />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.45fr]">
          <div className="space-y-6">
            <GamePageIntro game={game} />
            <GameSurface game={game} />
            <AdSlot
              label="Gameplay footer placement"
              slot={content.site.adSlots?.gameInline}
            />
          </div>
          <div className="space-y-6">
            <AdSlot
              label="In-game sidebar placement"
              slot={content.site.adSlots?.gameSidebar}
            />
            <div className="rounded-[30px] border border-white/10 bg-slate-900/75 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/70">
                Start in seconds
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                {game.instructions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[30px] border border-white/10 bg-slate-900/75 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200/70">
                Quick facts
              </p>
              <div className="mt-5 grid gap-3 text-sm text-slate-300">
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  Difficulty: {game.difficulty}
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  Players: {game.playersLabel}
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  Format: {game.playMode === "embed" ? "Hosted game page" : "Built into TurboArcade"}
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  Best for: quick repeat sessions after work, school, or lunch
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  Why start here: the hook is obvious in your first round
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[30px] border border-white/10 bg-slate-900/75 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/70">
              Why players keep coming back
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {game.title} works because the rules click quickly, the first round
              starts fast, and every retry feels short enough to fit into a real
              break. That is the rhythm most American casual-browser players
              expect.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              This page adds instructions, fast context, and related picks so
              each game screen keeps real publisher content around the play area.
            </p>
          </div>
          <div className="rounded-[30px] border border-white/10 bg-slate-900/75 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200/70">
              Good if you like
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {game.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-400">
              If those tags feel right, this is the kind of game most American
              casual players will try immediately without needing a tutorial.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/70">
                Up next
              </p>
              <h2 className="mt-3 text-3xl font-semibold">Keep the session going</h2>
            </div>
            <p className="hidden max-w-lg text-sm leading-7 text-slate-400 md:block">
              The next click should feel easy: another quick round, a different
              pace, or a lighter challenge.
            </p>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {relatedGames.map((entry) => (
              <GameCard key={entry.slug} game={entry} />
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
