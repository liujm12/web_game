import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteContent } from "@/lib/site-content";

export default async function PrivacyPage() {
  const content = await getSiteContent();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader brandName={content.site.brandName} />
      <main className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
        <div className="rounded-[36px] border border-white/10 bg-slate-900/75 p-8">
          <h1 className="text-4xl font-semibold">Privacy Policy</h1>
          <div className="mt-6 space-y-5 text-sm leading-8 text-slate-300">
            <p>
              TurboArcade collects limited analytics and gameplay interaction data
              to improve performance, content placement, and ad readiness.
            </p>
            <p>
              If Google AdSense is enabled in production, advertising partners may
              use cookies to serve and measure ads. This local demo does not load
              live ad scripts by default.
            </p>
            <p>
              Contact {content.site.supportEmail} for privacy requests or
              questions.
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
