import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  EDITORIAL_POLICY_UPDATED_AT,
  EDITORIAL_TEAM_NAME,
} from "@/lib/editorial";
import { getSiteContent } from "@/lib/site-content";
import { buildSocialMetadata } from "@/lib/social-metadata";

export const metadata: Metadata = buildSocialMetadata({
  title: "Editorial Policy | TurboArcade",
  description:
    "Learn how the TurboArcade Editorial Team tests games, reviews guides, publishes updates, and handles corrections.",
  path: "/editorial-policy",
});

const sectionClass =
  "rounded-[28px] border border-white/10 bg-[#0a0d18]/88 p-6 sm:p-8";

export default async function EditorialPolicyPage() {
  const content = await getSiteContent();

  return (
    <div className="min-h-screen text-white">
      <SiteHeader brandName={content.site.brandName} />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        <header className="rounded-[34px] border border-cyan-100/12 bg-[#080b16]/92 p-7 shadow-[0_28px_80px_rgba(2,6,23,0.46)] sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-200/70">
            Publishing standards
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
            Editorial Policy
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            {EDITORIAL_TEAM_NAME} is the publishing byline used for game pages,
            play instructions, and strategy guides on TurboArcade. This page
            explains who that byline represents, how AI assists the work, what
            is checked before publication, and how readers can report a problem.
          </p>
          <p className="mt-5 text-xs font-semibold text-slate-500">
            Last updated {EDITORIAL_POLICY_UPDATED_AT}
          </p>
        </header>

        <div className="mt-8 space-y-6">
          <section className={sectionClass}>
            <h2 className="text-2xl font-black">Who the byline represents</h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              {EDITORIAL_TEAM_NAME} is a site-level publishing byline for the
              TurboArcade owner/operator and the workflow used to maintain the
              site. It gives readers one accountable identity for corrections
              and updates; it does not claim a particular staff size, a separate
              newsroom, or independent third-party review.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-2xl font-black">
              AI assistance and accountability
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              TurboArcade is built and maintained with substantial AI assistance.
              AI tools help draft and revise copy, write and refactor code,
              prepare test coverage, and flag quality issues. The site
              owner/operator decides what is published, checks the resulting
              pages and playable builds, verifies screenshot evidence, and is
              responsible for corrections.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-300">
              AI tools are not presented as players, users, independent reviewers,
              or human authors. We do not invent testimonials, audience figures,
              rankings, or gameplay results. Gameplay screenshots identified as
              evidence are captured from a running TurboArcade build rather than
              generated to resemble the games.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-2xl font-black">How we test games</h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              Before a game is listed as live, the publishing workflow checks that
              it loads, starts, restarts, and reaches its main success or
              failure state. Controls are checked with the input methods the
              page claims to support. We also review the playable area on
              desktop and common mobile widths so instructions and controls do
              not crowd out the game.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-2xl font-black">
              How guides are written and reviewed
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              Guides are based on the version of the game available on
              TurboArcade. The publishing workflow checks controls, rules, scoring behavior,
              and repeatable strategies against the playable page before
              publication. Each guide now records a gameplay-check date and a
              specific note describing the implementation, level data, or board
              states used for that check.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-2xl font-black">Corrections and updates</h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              An updated date changes when the instructions, recommendations,
              or other meaningful content on a page is reviewed and revised.
              Typographical fixes may not receive a new date. To report an
              error, email{" "}
              <a
                className="font-bold text-cyan-200 hover:text-cyan-100"
                href={`mailto:${content.site.supportEmail}`}
              >
                {content.site.supportEmail}
              </a>{" "}
              with the page URL, the incorrect statement, and any screenshot
              or steps that help reproduce the issue.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className="text-2xl font-black">
              Advertising and editorial independence
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              Advertising placement does not determine which games receive
              favorable descriptions, strategy advice, or placement in a
              guide. Ads are kept separate from game controls and editorial
              conclusions. A game can be corrected, updated, or removed when
              it no longer meets the site&apos;s playability standard.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter
        brandName={content.site.brandName}
        supportEmail={content.site.supportEmail}
      />
    </div>
  );
}
