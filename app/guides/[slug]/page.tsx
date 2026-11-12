import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { PatrolEscapeBoardDiagram } from "@/components/patrol-escape-board-diagram";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { GAMEPLAY_SCREENSHOT_PROVENANCE } from "@/data/game-screenshots";
import { getGuideBySlug, guides } from "@/data/guides";
import { getGuideLinkLabel } from "@/lib/content-cluster-links";
import {
  EDITORIAL_POLICY_PATH,
  EDITORIAL_TEAM_NAME,
} from "@/lib/editorial";
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
  const relatedGuides = (guide.relatedGuideSlugs ?? [])
    .map((guideSlug) => guides.find((candidate) => candidate.slug === guideSlug))
    .filter((candidate) => Boolean(candidate))
    .slice(0, 1);
  const correctionHref = `mailto:${content.site.supportEmail}?subject=${encodeURIComponent(
    `Correction for ${guide.title}`,
  )}`;

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
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-400">
              <span>Published by {EDITORIAL_TEAM_NAME}</span>
              <span>Updated {guide.updatedAt}</span>
              <span>Gameplay checked {guide.verifiedAt}</span>
              <Link
                href={EDITORIAL_POLICY_PATH}
                className="text-cyan-200 hover:text-cyan-100"
              >
                Editorial Policy
              </Link>
              <a
                href={correctionHref}
                className="text-cyan-200 hover:text-cyan-100"
              >
                Report a correction
              </a>
            </div>
          </header>

          <section
            className="mt-6 rounded-[24px] border border-cyan-200/14 bg-cyan-300/[0.055] p-5 sm:p-6"
            aria-labelledby="guide-verification-heading"
          >
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200/75">
              Verification record
            </p>
            <h2 id="guide-verification-heading" className="mt-2 text-xl font-black text-white">
              How this guide was checked
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {guide.verificationNote}
            </p>
          </section>

          <div className="mt-8 space-y-6">
            {guide.images?.length ? <section aria-label={`${guide.title} examples`} className="rounded-[28px] border border-white/10 bg-[#0a0d18]/88 p-6 sm:p-8"><h2 className="text-2xl font-black">Board examples from the game</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400"><span className="font-bold text-slate-200">Gameplay screenshot source:</span> {GAMEPLAY_SCREENSHOT_PROVENANCE.disclosure}</p><div className="mt-5 grid gap-5 sm:grid-cols-2">{guide.images.map((image) => <figure key={image.src} className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"><Image src={image.src} alt={image.alt} width={image.width} height={image.height} className="h-auto w-full" /><figcaption className="p-4 text-sm leading-6 text-slate-300">{image.caption}</figcaption></figure>)}</div></section> : null}
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

          {guide.caseStudies?.length ? (
            <section className="mt-10" aria-labelledby="case-studies-heading">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200/75">Verified board analysis</p>
              <h2 id="case-studies-heading" className="mt-3 text-3xl font-black text-white">Three real levels, three blocker chains</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">Each route below starts from the published level data and finishes at the solver-verified par. The board diagram shows the untouched initial position.</p>
              <div className="mt-7 space-y-8">
                {guide.caseStudies.map((caseStudy) => (
                  <article key={caseStudy.levelId} className="rounded-[30px] border border-white/10 bg-[#0a0d18]/90 p-5 sm:p-8">
                    <div className="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                      <PatrolEscapeBoardDiagram levelId={caseStudy.levelId} />
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-200">{caseStudy.difficulty} case study · Level {caseStudy.levelId}</p>
                        <div className="mt-5 space-y-5 text-sm leading-7 text-slate-300">
                          <div><h3 className="font-black text-white">Initial layout</h3><p className="mt-1">{caseStudy.initialLayout}</p></div>
                          <div><h3 className="font-black text-white">Main blocker relationship</h3><p className="mt-1">{caseStudy.blockerRelationship}</p></div>
                          <div><h3 className="font-black text-white">Common wrong move</h3><p className="mt-1">{caseStudy.commonMistake}</p></div>
                          <div><h3 className="font-black text-white">Correct analysis</h3><p className="mt-1">{caseStudy.analysis}</p></div>
                          {caseStudy.complexitySource ? <div><h3 className="font-black text-white">Where the 20+ steps come from</h3><p className="mt-1">{caseStudy.complexitySource}</p></div> : null}
                        </div>
                        <div className="mt-6 rounded-[22px] border border-cyan-200/12 bg-cyan-300/[0.05] p-5">
                          <h3 className="font-black text-white">Par solution</h3>
                          <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
                            {caseStudy.solution.map((step, index) => <li key={`${step.vehicleId}-${index}`}><span className="mr-2 font-black text-cyan-200">{index + 1}.</span>{step.instruction}</li>)}
                          </ol>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <section
            className="mt-8 rounded-[28px] border border-orange-200/14 bg-orange-300/[0.055] p-6 sm:p-8"
            aria-labelledby="continue-topic-heading"
          >
            <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-200/75">Practice the ideas</p>
            <h2 id="continue-topic-heading" className="mt-3 text-2xl font-black text-white">
              Continue this topic
            </h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {relatedGames.map((game) => game ? (
                <Link key={game.slug} href={`/games/${game.slug}`} className="rounded-full bg-orange-300 px-5 py-2.5 text-sm font-black text-orange-950 hover:bg-cyan-300 hover:text-cyan-950">
                  Play {game.title}
                </Link>
              ) : null)}
              {relatedGuides.map((relatedGuide) => relatedGuide ? (
                <Link key={relatedGuide.slug} href={`/guides/${relatedGuide.slug}`} className="rounded-full border border-orange-200/20 px-5 py-2.5 text-sm font-black text-orange-100 hover:border-cyan-200/30 hover:text-cyan-100">
                  {getGuideLinkLabel(relatedGuide)}
                </Link>
              ) : null)}
              {guide.relatedHub ? (
                <Link href={guide.relatedHub.href} className="rounded-full border border-cyan-200/20 px-5 py-2.5 text-sm font-black text-cyan-100 hover:border-cyan-200/40 hover:bg-cyan-300/10">
                  Explore {guide.relatedHub.label}
                </Link>
              ) : null}
            </div>
          </section>
        </article>
      </main>
      <SiteFooter brandName={content.site.brandName} supportEmail={content.site.supportEmail} />
    </div>
  );
}
