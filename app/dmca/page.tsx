import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteContent } from "@/lib/site-content";

export default async function DmcaPage() {
  const content = await getSiteContent();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader brandName={content.site.brandName} />
      <main className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
        <div className="rounded-[36px] border border-white/10 bg-slate-900/75 p-8">
          <h1 className="text-4xl font-semibold">DMCA Notice</h1>
          <p className="mt-5 text-sm leading-8 text-slate-300">
            TurboArcade respects intellectual property rights. If you believe any
            material on this site infringes your rights, send a DMCA notice to
            {` ${content.site.supportEmail}`} with the claimed work, the URL, and
            your contact details.
          </p>
        </div>
      </main>
      <SiteFooter
        brandName={content.site.brandName}
        supportEmail={content.site.supportEmail}
      />
    </div>
  );
}
