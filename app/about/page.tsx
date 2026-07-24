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
          <h1 className="text-4xl font-semibold">About TurboArcade</h1>
          <div className="mt-6 space-y-8 text-base leading-8 text-slate-300">
            <p>
              TurboArcade is a browser game site built for quick sessions,
              mobile-friendly play, and repeat visits from casual players in the
              United States. The catalog focuses on games that explain
              themselves quickly, load fast, and fit into short breaks.
            </p>
            <section>
              <h2 className="text-2xl font-semibold text-white">What we publish</h2>
              <p className="mt-3">
                The site mixes lightweight original browser games with embedded
                HTML5 games that match the same quick-play standard. Every game
                page includes context, instructions, related picks, and SEO copy
                so the page works as more than just a blank play container.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-white">How the catalog grows</h2>
              <p className="mt-3">
                We intentionally keep the launch catalog small and improve it in
                batches. That helps us monitor quality, tune ad placements
                responsibly, and make sure new games still meet performance and
                usability expectations.
              </p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold text-white">Contact</h2>
              <p className="mt-3">
                For site questions, partnerships, or content issues, email
                {` ${content.site.supportEmail}`}.
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
