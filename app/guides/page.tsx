import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { guides } from "@/data/guides";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Browser Game Guides | TurboArcade",
  description:
    "Original TurboArcade strategy guides for 2048, Snake, Breakout, Number Rush, and other quick browser games.",
  alternates: {
    canonical: "/guides",
  },
};

export default async function GuidesPage() {
  const content = await getSiteContent();

  return (
    <div className="min-h-screen text-white">
      <SiteHeader brandName={content.site.brandName} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        <section className="rounded-[34px] border border-cyan-100/12 bg-[#080b16]/92 p-7 shadow-[0_28px_80px_rgba(2,6,23,0.46)] sm:p-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-200/75">
            TurboArcade field notes
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Play smarter, one game at a time
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            These guides come from playing the games on TurboArcade and breaking down the decisions that make a run last longer. Each one focuses on a specific board, control pattern, or recovery problem.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {guides.map((guide, index) => (
            <article key={guide.slug} className="group rounded-[30px] border border-white/10 bg-[#0a0d18]/88 p-7 shadow-[0_24px_70px_rgba(2,6,23,0.38)] transition hover:-translate-y-1 hover:border-cyan-200/25">
              <div className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.24em] text-cyan-200/70">
                <span>{guide.eyebrow}</span>
                <span>{guide.readTime}</span>
              </div>
              <div className="mt-7 flex items-start gap-5">
                <span className="text-5xl font-black text-white/10">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="text-3xl font-black text-white">{guide.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{guide.summary}</p>
                  <Link href={`/guides/${guide.slug}`} className="mt-6 inline-flex rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-black text-cyan-950 transition group-hover:bg-orange-300 group-hover:text-orange-950">
                    Read the guide
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter brandName={content.site.brandName} supportEmail={content.site.supportEmail} />
    </div>
  );
}
