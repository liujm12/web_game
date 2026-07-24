import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteContent } from "@/lib/site-content";

export default async function DmcaPage() {
  const content = await getSiteContent();
  const updatedAt = "July 24, 2026";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader brandName={content.site.brandName} />
      <main className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
        <div className="rounded-[36px] border border-white/10 bg-slate-900/75 p-8">
          <h1 className="text-4xl font-semibold">DMCA Notice</h1>
          <p className="mt-4 text-sm uppercase tracking-[0.24em] text-cyan-200/70">
            Last updated {updatedAt}
          </p>
          <div className="mt-6 space-y-8 text-sm leading-8 text-slate-300">
            <section>
              <h2 className="text-xl font-semibold text-white">Copyright policy</h2>
              <p className="mt-3">
                TurboArcade respects intellectual property rights and responds to
                good-faith copyright complaints. If you believe material on this
                site infringes your rights, send a notice to
                {` ${content.site.supportEmail}`}.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">What to include in a notice</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Your full name and contact details.</li>
                <li>A description of the copyrighted work.</li>
                <li>The exact page URL or game URL involved.</li>
                <li>A statement that you believe the use is unauthorized.</li>
                <li>A statement that the information in the notice is accurate.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Review process</h2>
              <p className="mt-3">
                We review notices in the order received and may remove or disable
                access to allegedly infringing content while we investigate. If
                we need more information to identify the material, we may reply
                to request clarification.
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
