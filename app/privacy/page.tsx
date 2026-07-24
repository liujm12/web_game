import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteContent } from "@/lib/site-content";

export default async function PrivacyPage() {
  const content = await getSiteContent();
  const updatedAt = "July 24, 2026";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader brandName={content.site.brandName} />
      <main className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
        <div className="rounded-[36px] border border-white/10 bg-slate-900/75 p-8">
          <h1 className="text-4xl font-semibold">Privacy Policy</h1>
          <p className="mt-4 text-sm uppercase tracking-[0.24em] text-cyan-200/70">
            Last updated {updatedAt}
          </p>
          <div className="mt-6 space-y-8 text-sm leading-8 text-slate-300">
            <section>
              <h2 className="text-xl font-semibold text-white">What this policy covers</h2>
              <p className="mt-3">
                This policy explains how TurboArcade handles site usage data,
                gameplay activity, advertising signals, and support requests. It
                applies to the homepage, game pages, category pages, policy
                pages, and any future interactive features we add.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Information we collect</h2>
              <p className="mt-3">
                TurboArcade may collect limited technical information such as
                browser type, device type, approximate region, page views,
                referral source, session length, and gameplay interactions such
                as clicks on a Start button or category shelf. We use this
                information to understand which games load well, which pages
                help users discover more content, and which layouts are worth
                improving.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Advertising and cookies</h2>
              <p className="mt-3">
                If Google AdSense is enabled in production, Google and its
                partners may use cookies, local storage, and similar
                technologies to show ads, measure performance, prevent fraud,
                and limit repetitive ad delivery. This local development build
                does not load live ad code unless an AdSense client ID is
                configured.
              </p>
              <p className="mt-3">
                For launches that target users in the United States, we plan to
                use Google&apos;s Privacy &amp; messaging tools to support
                consent and privacy choices where required.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">How we use information</h2>
              <p className="mt-3">
                We use collected information to operate the site, improve load
                speed and game discovery, understand which content performs
                best, detect misuse, respond to support emails, and maintain
                advertising readiness. We do not sell personal information
                directly from this site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Children and age guidance</h2>
              <p className="mt-3">
                TurboArcade is built for a general audience and is not directed
                to children under 13. If you believe a child has provided
                personal information through a support request, contact us and
                we will review the request promptly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Contact and privacy requests</h2>
              <p className="mt-3">
                For privacy questions, data requests, or advertising-related
                concerns, contact {content.site.supportEmail}. Include the page
                URL and enough detail for us to identify the request quickly.
              </p>
            </section>

            <p>
              This policy may be updated as the catalog, analytics stack, or
              advertising setup changes. Material updates will be reflected on
              this page with a new effective date.
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
