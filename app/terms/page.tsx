import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteContent } from "@/lib/site-content";

export default async function TermsPage() {
  const content = await getSiteContent();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader brandName={content.site.brandName} />
      <main className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
        <div className="rounded-[36px] border border-white/10 bg-slate-900/75 p-8">
          <h1 className="text-4xl font-semibold">Terms of Service</h1>
          <div className="mt-6 space-y-5 text-sm leading-8 text-slate-300">
            <p>
              TurboArcade is provided for personal entertainment. Users may not
              reverse engineer, scrape, or republish site content without written
              permission.
            </p>
            <p>
              Gameplay, ranking, and advertising features may change as the
              catalog evolves.
            </p>
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
