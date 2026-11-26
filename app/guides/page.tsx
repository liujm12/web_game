import type { Metadata } from "next";
import { GuideBrowser, type GuideBrowserItem, type GuideTopic } from "@/components/guide-browser";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { guides } from "@/data/guides";
import { getGuideLinkLabel } from "@/lib/content-cluster-links";
import { getSiteContent } from "@/lib/site-content";
import { buildSocialMetadata } from "@/lib/social-metadata";
import { buildGuideCollectionStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = buildSocialMetadata({
  title: "Browser Game Guides | TurboArcade",
  description:
    "Original TurboArcade strategy guides for 2048, Snake, Breakout, Number Rush, and other quick browser games.",
  path: "/guides",
});

export default async function GuidesPage() {
  const content = await getSiteContent();
  const guideItems: GuideBrowserItem[] = guides.map((guide) => {
    const relatedGames = guide.relatedGameSlugs
      .map((slug) => content.games.find((game) => game.slug === slug))
      .filter((game) => Boolean(game));
    const topics = new Set<GuideTopic>();

    if (guide.relatedHub?.href === "/traffic-puzzle-games") topics.add("Traffic puzzles");
    if (guide.relatedGameSlugs.some((slug) => slug.includes("2048"))) topics.add("2048");
    for (const game of relatedGames) {
      if (game?.category === "arcade") topics.add("Arcade");
      if (game?.category === "brain") topics.add("Brain");
    }

    return {
      slug: guide.slug,
      title: guide.title,
      eyebrow: guide.eyebrow,
      summary: guide.summary,
      readTime: guide.readTime,
      linkLabel: getGuideLinkLabel(guide),
      topics: Array.from(topics),
      searchText: [
        guide.title,
        guide.eyebrow,
        guide.summary,
        ...relatedGames.map((game) => game?.title ?? ""),
        ...topics,
      ].join(" ").toLocaleLowerCase(),
    };
  });

  return (
    <div className="min-h-screen text-white">
      <JsonLd data={buildGuideCollectionStructuredData(guides)} />
      <SiteHeader brandName={content.site.brandName} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        <section className="rounded-[34px] border border-cyan-100/12 bg-[#080b16]/92 p-7 shadow-[0_28px_80px_rgba(2,6,23,0.46)] sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-200/75">
            TurboArcade field notes
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Play smarter, one game at a time
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            These guides come from playing the games on TurboArcade and breaking down the decisions that make a run last longer. Each one focuses on a specific board, control pattern, or recovery problem.
          </p>
        </section>

        <GuideBrowser guides={guideItems} />
      </main>
      <SiteFooter brandName={content.site.brandName} supportEmail={content.site.supportEmail} />
    </div>
  );
}
