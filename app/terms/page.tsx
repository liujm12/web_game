import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteContent } from "@/lib/site-content";

export default async function TermsPage() {
  const content = await getSiteContent();
  const updatedAt = "July 24, 2026";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader brandName={content.site.brandName} />
      <main className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
        <div className="rounded-[36px] border border-white/10 bg-slate-900/75 p-8">
          <h1 className="text-4xl font-semibold">Terms of Service</h1>
          <p className="mt-4 text-sm uppercase tracking-[0.24em] text-cyan-200/70">
            Last updated {updatedAt}
          </p>
          <div className="mt-6 space-y-8 text-sm leading-8 text-slate-300">
            <section>
              <h2 className="text-xl font-semibold text-white">Use of the site</h2>
              <p className="mt-3">
                TurboArcade is provided for personal, non-commercial
                entertainment. You may browse pages, play games, and share links
                to public pages, but you may not copy, scrape, rehost, or
                republish site content or game assets without permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Gameplay and availability</h2>
              <p className="mt-3">
                Game pages, rankings, featured placements, category shelves, and
                advertising layouts may change at any time as the catalog grows
                or as we test better page experiences. We do not guarantee that
                every game or page will remain available indefinitely.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Acceptable behavior</h2>
              <p className="mt-3">
                You agree not to interfere with site operations, attempt to gain
                unauthorized access, send harmful code, abuse ad placements,
                generate fake engagement, or use automated tools to overwhelm
                the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Third-party content and advertising</h2>
              <p className="mt-3">
                Some games may be embedded from separate static files or future
                hosted sources. Ads and analytics may be served through third
                parties including Google. Those services may have their own
                policies and technical requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Disclaimers</h2>
              <p className="mt-3">
                The site is provided on an &quot;as is&quot; and &quot;as
                available&quot; basis. We aim to keep pages playable and fast,
                but we cannot guarantee uninterrupted availability, perfect
                compatibility on every device, or error-free operation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Contact</h2>
              <p className="mt-3">
                Questions about these terms can be sent to
                {` ${content.site.supportEmail}`}.
              </p>
            </section>

            <p>
              Continued use of the site means acceptance of these terms and any
              future updates posted on this page.
            </p>
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
