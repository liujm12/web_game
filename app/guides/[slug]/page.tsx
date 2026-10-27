import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getGuideBySlug, guides } from "@/data/guides";
import { getSiteContent } from "@/lib/site-content";
import { buildSocialMetadata } from "@/lib/social-metadata";
import { buildGuideStructuredData } from "@/lib/structured-data";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return { title: "Guide not found | TurboArcade" };
  }

  return buildSocialMetadata({
    title: `${guide.title} | TurboArcade Guides`,
    description: guide.summary,
    path: `/guides/${guide.slug}`,
    type: "article",
  });
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  const content = await getSiteContent();

  if (!guide) {
    notFound();
  }

  const relatedGames = guide.relatedGameSlugs
    .map((gameSlug) => content.games.find((game) => game.slug === gameSlug))
    .filter((game) => Boolean(game));

  return (
    <div className="min-h-screen text-white">
      <JsonLd data={buildGuideStructuredData(guide)} />
      <SiteHeader brandName={content.site.brandName} />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        <article>
          <header className="rounded-[34px] border border-cyan-100/12 bg-[#080b16]/92 p-7 shadow-[0_28px_80px_rgba(2,6,23,0.46)] sm:p-10">
            <Link href="/guides" className="text-sm font-black text-cyan-200 hover:text-cyan-100">
              ← All guides
            </Link>
            <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-orange-200/75">
              {guide.eyebrow} · {guide.readTime}
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">{guide.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">{guide.summary}</p>
            <p className="mt-5 text-xs text-slate-500">Updated {guide.updatedAt}</p>
          </header>

          <div className="mt-8 space-y-6">
            {guide.sections.map((section, index) => (
              <section key={section.heading} className="rounded-[28px] border border-white/10 bg-[#0a0d18]/88 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <span className="text-3xl font-black text-cyan-200/25">{index + 1}</span>
                  <div>
                    <h2 className="text-2xl font-black text-white">{section.heading}</h2>
                    <div className="mt-5 space-y-4 text-base leading-8 text-slate-300">
                      {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    </div>
                    {section.tips ? (
                      <ul className="mt-6 space-y-3 rounded-[22px] border border-cyan-200/10 bg-cyan-300/[0.055] p-5 text-sm leading-7 text-slate-200">
                        {section.tips.map((tip) => <li key={tip}>• {tip}</li>)}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </section>
            ))}
          </div>

          <section className="mt-8 rounded-[28px] border border-orange-200/14 bg-orange-300/[0.055] p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-200/75">Practice the ideas</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {relatedGames.map((game) => game ? (
                <Link key={game.slug} href={`/games/${game.slug}`} className="rounded-full bg-orange-300 px-5 py-2.5 text-sm font-black text-orange-950 hover:bg-cyan-300 hover:text-cyan-950">
                  Play {game.title}
                </Link>
              ) : null)}
            </div>
          </section>
        </article>
      </main>
      <SiteFooter brandName={content.site.brandName} supportEmail={content.site.supportEmail} />
    </div>
  );
}
