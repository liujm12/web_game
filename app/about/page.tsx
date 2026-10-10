import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteContent } from "@/lib/site-content";

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader brandName={content.site.brandName} />
      <main className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
        <div className="rounded-[36px] border border-white/10 bg-slate-900/75 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/70">
            About the site
          </p>
          <h1 className="mt-3 text-4xl font-semibold">About TurboArcade</h1>
          <div className="mt-6 space-y-8 text-base leading-8 text-slate-300">
            <p>
              TurboArcade is a browser game site for quick breaks. The collection focuses on
              games that start quickly, explain themselves clearly, and feel comfortable on
              both phones and desktop browsers.
            </p>
            <section>
              <h2 className="text-2xl font-semibold text-white">What we publish</h2>
              <p className="mt-3">
                The catalog mixes original browser games with selected HTML5-style games that
                match the same quick-play standard. A game should load quickly, explain itself
                within a few seconds, work on common phone sizes, and have controls that are
                close enough to the action to feel playable.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-white">What players can expect</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>The playable area appears before long explanations.</li>
                <li>Keyboard and touch instructions are listed when a game supports them.</li>
                <li>Start, restart, and movement controls stay close to the play area.</li>
                <li>Rules, practical tips, and common mistakes are available on each game page.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-white">How the catalog grows</h2>
              <p className="mt-3">
                New games are added in batches instead of all at once. That gives us time to
                improve controls, refine instructions, and remove games that do not feel good on
                desktop and mobile. The collection grows around clear pages and playable experiences.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-white">Advertising approach</h2>
              <p className="mt-3">
                TurboArcade is designed to support advertising, but ads should not block the
                game or force players to scroll past excessive placements before starting. We
                keep ad spaces separate from the play area and continue adjusting layouts as the
                catalog grows.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-white">Contact</h2>
              <p className="mt-3">
                For site questions, partnerships, or content issues, email{" "}
                <a
                  href={`mailto:${content.site.supportEmail}`}
                  className="font-semibold text-cyan-200 hover:text-cyan-100"
                >
                  {content.site.supportEmail}
                </a>
                . Include the page URL if your message is
                about a specific game.
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter
        brandName={content.site.brandName}
        supportEmail={content.site.supportEmail}
      />
    </div>
  );
}
