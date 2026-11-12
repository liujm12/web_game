import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/ad-slot";
import { CategoryHero } from "@/components/category-hero";
import { GameCard } from "@/components/game-card";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { guides } from "@/data/guides";
import { getGuideLinkLabel } from "@/lib/content-cluster-links";
import {
  getCategoryBySlug,
  getGamesByCategory,
  getPublicGames,
  getSiteContent,
} from "@/lib/site-content";
import { buildSocialMetadata } from "@/lib/social-metadata";
import { buildGameCollectionStructuredData } from "@/lib/structured-data";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const category = getCategoryBySlug(content, slug);

  if (!category) {
    return {
      title: "Category not found | TurboArcade",
      description: "Explore free browser games at TurboArcade.",
    };
  }

  return buildSocialMetadata({
    title: `${category.name} Games | TurboArcade`,
    description: category.description,
    path: `/categories/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const content = await getSiteContent();
  const category = getCategoryBySlug(content, slug);

  if (!category) {
    notFound();
  }

  const games = getGamesByCategory(content, slug);
  const otherGames = getPublicGames(content).filter(
    (game) => game.category !== slug,
  );
  const relatedGuides = guides.filter(
    (guide) => guide.relatedHub?.href === `/categories/${slug}`,
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <JsonLd
        data={buildGameCollectionStructuredData({
          title: `${category.name} Games | TurboArcade`,
          description: category.description,
          path: `/categories/${category.slug}`,
          games,
        })}
      />
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

        {relatedGuides.length ? (
          <section
            className="mt-10 rounded-[30px] border border-cyan-200/12 bg-cyan-300/[0.045] p-6 sm:p-8"
            aria-labelledby="collection-guides-heading"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/70">
              Field-tested guides
            </p>
            <h2 id="collection-guides-heading" className="mt-3 text-3xl font-semibold text-white">
              Guides for this collection
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
              Continue with a specific board problem, control technique, or recovery plan from the games on this shelf.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {relatedGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-5 py-3 text-sm font-black text-cyan-100 transition hover:border-cyan-200/40 hover:bg-cyan-300/20"
                >
                  {getGuideLinkLabel(guide)}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

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
