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
          <div className="mt-6 space-y-8 text-sm leading-8 text-slate-300">
            <p>
              For partnerships, ad operations, copyright notices, gameplay
              issues, or general site questions, email
              {` ${content.site.supportEmail}`}.
            </p>
            <section>
              <h2 className="text-xl font-semibold text-white">Best ways to reach us</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Advertising and partnership inquiries</li>
                <li>Bug reports or broken game links</li>
                <li>DMCA and intellectual property notices</li>
                <li>Privacy or policy questions</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-white">What to include</h2>
              <p className="mt-3">
                To help us respond faster, include the page URL, the game title,
                your device or browser, and a short description of the issue or
                request.
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
