import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Page not found | TurboArcade",
  description:
    "This TurboArcade page is unavailable. Browse all games or open a practical game guide instead.",
  robots: { index: false, follow: false },
};

const recoveryLinks = [
  { href: "/", label: "Home" },
  { href: "/games", label: "All Games" },
  { href: "/guides", label: "Guides" },
];

export default async function NotFound() {
  const content = await getSiteContent();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader brandName={content.site.brandName} />
      <main className="mx-auto flex max-w-4xl px-6 py-16 lg:px-10 lg:py-24">
        <section className="w-full rounded-[36px] border border-cyan-100/15 bg-slate-900/80 p-8 shadow-[0_24px_80px_rgba(2,6,23,0.45)] sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/70">
            Error 404
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
            The address may have changed, or the page may no longer be
            available. Choose a safe route back into TurboArcade.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {recoveryLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  index === 0
                    ? "rounded-full bg-cyan-300 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-200"
                    : "rounded-full border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white hover:bg-white/10"
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter
        brandName={content.site.brandName}
        supportEmail={content.site.supportEmail}
      />
    </div>
  );
}
