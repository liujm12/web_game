import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/ad-slot";
import { CategoryHero } from "@/components/category-hero";
import { GameCard } from "@/components/game-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getCategoryBySlug,
  getGamesByCategory,
  getSiteContent,
} from "@/lib/site-content";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const category = getCategoryBySlug(content, slug);

  return {
    title: category
      ? `${category.name} Games | TurboArcade`
      : "Category not found | TurboArcade",
    description:
      category?.description ??
      "Explore free browser games at TurboArcade.",
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const content = await getSiteContent();
  const category = getCategoryBySlug(content, slug);

  if (!category) {
    notFound();
  }

  const games = getGamesByCategory(content, slug);
  const otherGames = content.games.filter(
    (game) => game.category !== slug && game.status === "live",
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader brandName={content.site.brandName} />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <CategoryHero category={category} gameCount={games.length} />

        <section className="mt-8 rounded-[30px] border border-white/10 bg-slate-900/65 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-200/70">
                How to use this shelf
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Pick the pace that matches your break
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-400">
              Some players want instant reactions, some want a slower warm-up.
              This page makes that choice clearer before the click.
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </section>

        <AdSlot
          label="Category page inline placement"
          slot={content.site.adSlots?.categoryInline}
          className="mt-10"
        />

        <section className="mt-10 rounded-[30px] border border-white/10 bg-slate-900/65 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/70">
                Want a different pace?
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                Players also bounce into these
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-400">
              Strong game portals do not trap people in one shelf. They make the
              next good click obvious.
            </p>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {otherGames.slice(0, 3).map((game) => (
              <GameCard key={game.slug} game={game} />
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
