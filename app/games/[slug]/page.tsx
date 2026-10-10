import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/ad-slot";
import { GameCard } from "@/components/game-card";
import { GamePageIntro } from "@/components/game-page-intro";
import { GameSurface } from "@/components/game-surface";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getGameBySlug, getSiteContent } from "@/lib/site-content";

const sectionCardClass =
  "rounded-[28px] border border-cyan-100/12 bg-[#0a0d18]/88 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.38)]";

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

  const category = content.categories.find((entry) => entry.slug === game.category);
  const relatedGames = content.games
    .filter((entry) => entry.slug !== game.slug && entry.status === "live")
    .sort((left, right) => {
      if (left.category === game.category && right.category !== game.category) return -1;
      if (right.category === game.category && left.category !== game.category) return 1;
      return right.trendingScore - left.trendingScore;
    })
    .slice(0, 6);

  const controls = game.controls ?? game.instructions;
  const difficultyArticle = /^[aeiou]/i.test(game.difficulty) ? "an" : "a";
  const bestFor = game.bestFor ?? [
    `${game.estimatedSession} sessions when you want a fast browser game.`,
    `Players looking for ${difficultyArticle} ${game.difficulty.toLowerCase()} ${game.category} pick.`,
    "Anyone who wants to understand the controls before starting.",
  ];
  const strategyTips = game.strategyTips ?? game.instructions;
  const commonMistakes = game.commonMistakes ?? [
    "Starting before reading the first control prompt.",
    "Trying to play too quickly before the rhythm is clear.",
  ];
  const faq = game.faq ?? [
    {
      question: `Is ${game.title} free to play?`,
      answer: "Yes. The game runs in the browser and can be started from this page.",
    },
  ];

  return (
    <div className="min-h-screen text-white">
      <SiteHeader brandName={content.site.brandName} compactGameHeader />
      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-10">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
          <div className="space-y-5 sm:space-y-6">
            <GameSurface game={game} />
            <AdSlot
              label="Gameplay footer placement"
              slot={content.site.adSlots?.gameInline}
            />
            <GamePageIntro game={game} />
          </div>
          <aside className="space-y-6">
            <AdSlot
              label="In-game sidebar placement"
              slot={content.site.adSlots?.gameSidebar}
            />
            <div className={sectionCardClass}>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/70">
                How to play
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                {game.instructions.map((item) => (
                  <li key={item} className="rounded-2xl bg-white/[0.045] px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[28px] border border-orange-200/12 bg-[#0a0d18]/88 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.38)]">
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
                  Session: {game.estimatedSession}
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  Format: {game.playMode === "embed" ? "Hosted HTML5 game" : "Built into TurboArcade"}
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  Last checked: {game.lastChecked ?? "October 2026"}
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={sectionCardClass}>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/70">
              What this game is good for
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">
              {game.title} fits a {game.estimatedSession.toLowerCase()} break
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {game.description}
            </p>
            <div className="mt-5 grid gap-3">
              {bestFor.map((item) => (
                <p key={item} className="rounded-2xl bg-white/[0.045] px-4 py-3 text-sm leading-7 text-slate-300">
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div className={sectionCardClass}>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-200/70">
              Controls
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
              {controls.map((item) => (
                <li key={item} className="rounded-2xl bg-white/[0.045] px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {(game.testedOn ?? ["Desktop browser", "Mobile browser"]).map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className={sectionCardClass}>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-lime-200/70">
              Better-score tips
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
              {strategyTips.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={sectionCardClass}>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-200/70">
              Mistakes to avoid
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
              {commonMistakes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className={sectionCardClass}>
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
              {category
                ? `${category.name} games on TurboArcade are selected for quick starts, readable rules, and repeatable sessions.`
                : "TurboArcade keeps game pages practical, with controls and notes written for real play."}
            </p>
          </div>
          <div className={sectionCardClass}>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/70">
              Player questions
            </p>
            <div className="mt-5 space-y-4">
              {faq.map((item) => (
                <div key={item.question} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                  <h3 className="font-semibold text-white">{item.question}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/70">
                Up next
              </p>
              <h2 className="mt-3 text-3xl font-semibold">More quick games</h2>
            </div>
            <p className="hidden max-w-lg text-sm leading-7 text-slate-400 md:block">
              Start with a similar game, or switch pace for your next round.
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
