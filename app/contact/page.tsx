import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteContent } from "@/lib/site-content";

export default async function ContactPage() {
  const content = await getSiteContent();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader brandName={content.site.brandName} />
      <main className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
        <div className="rounded-[36px] border border-white/10 bg-slate-900/75 p-8">
          <h1 className="text-4xl font-semibold">Contact</h1>
          <p className="mt-5 text-sm leading-8 text-slate-300">
            For partnerships, ad operations, copyright notices, or launch support,
            email {content.site.supportEmail}. This starter build is structured so
            a production contact form can be added later without changing the
            content model.
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
