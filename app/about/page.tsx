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
              TurboArcade is a small browser game site for quick breaks. The goal is not to
              publish hundreds of untouched games. We would rather keep a smaller catalog,
              test the play pages, and write enough context so visitors know what they are
              opening before they press play.
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
              <h2 className="text-2xl font-semibold text-white">How we test pages</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>We check whether the first playable area appears before long blocks of text.</li>
                <li>We test keyboard controls and touch controls separately when a game supports both.</li>
                <li>We look for mobile problems such as hidden buttons, cramped boards, or controls placed above the play field.</li>
                <li>We add practical notes, common mistakes, and FAQs to make game pages useful beyond the embedded game itself.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-white">How the catalog grows</h2>
              <p className="mt-3">
                New games are added in batches instead of all at once. That gives us time to
                tune the layout, improve weak pages, and remove games that do not feel good on
                desktop and mobile. We avoid fake author bios, fake community claims, and
                inflated popularity numbers; the site should earn trust through clear pages and
                playable experiences.
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
                For site questions, partnerships, or content issues, email
                { }. Include the page URL if your message is
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
