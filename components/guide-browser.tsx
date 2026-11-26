"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type GuideTopic = "Traffic puzzles" | "2048" | "Arcade" | "Brain";

export type GuideBrowserItem = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  readTime: string;
  linkLabel: string;
  topics: GuideTopic[];
  searchText: string;
};

type GuideBrowserProps = {
  guides: GuideBrowserItem[];
};

const topics: Array<"All" | GuideTopic> = [
  "All",
  "Traffic puzzles",
  "2048",
  "Arcade",
  "Brain",
];

export function GuideBrowser({ guides }: GuideBrowserProps) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<(typeof topics)[number]>("All");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredGuides = useMemo(
    () => guides.filter((guide) => {
      const matchesTopic = topic === "All" || guide.topics.includes(topic);
      const matchesQuery = !normalizedQuery || guide.searchText.includes(normalizedQuery);
      return matchesTopic && matchesQuery;
    }),
    [guides, normalizedQuery, topic],
  );

  function clearFilters() {
    setQuery("");
    setTopic("All");
  }

  return (
    <section className="mt-8" aria-labelledby="guide-browser-heading">
      <div className="rounded-[28px] border border-cyan-100/12 bg-[#080b16]/82 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200/70">
              Find a field note
            </p>
            <h2 id="guide-browser-heading" className="mt-2 text-2xl font-black text-white">
              Search by game or problem
            </h2>
          </div>
          <label className="block w-full lg:max-w-md">
            <span className="sr-only">Search guides</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try Patrol Escape, crowded board, or Snake"
              className="min-h-12 w-full rounded-2xl border border-white/12 bg-white/[0.055] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-200/45 focus:ring-2 focus:ring-cyan-300/15"
            />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-2" aria-label="Guide topics">
          {topics.map((candidate) => {
            const selected = topic === candidate;
            return (
              <button
                key={candidate}
                type="button"
                aria-pressed={selected}
                onClick={() => setTopic(candidate)}
                className={`min-h-11 rounded-full border px-4 py-2 text-sm font-black transition ${
                  selected
                    ? "border-cyan-200 bg-cyan-300 text-cyan-950"
                    : "border-white/12 bg-white/[0.045] text-slate-300 hover:border-cyan-200/30 hover:text-cyan-100"
                }`}
              >
                {candidate}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-5 text-sm font-semibold text-slate-400" aria-live="polite">
        {filteredGuides.length} {filteredGuides.length === 1 ? "guide" : "guides"} found
      </p>

      {filteredGuides.length ? (
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          {filteredGuides.map((guide, index) => (
            <article key={guide.slug} className="group rounded-[30px] border border-white/10 bg-[#0a0d18]/88 p-7 shadow-[0_24px_70px_rgba(2,6,23,0.38)] transition hover:-translate-y-1 hover:border-cyan-200/25">
              <div className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.24em] text-cyan-200/70">
                <span>{guide.eyebrow}</span>
                <span>{guide.readTime}</span>
              </div>
              <div className="mt-7 flex items-start gap-5">
                <span className="text-5xl font-black text-white/10">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-3xl font-black text-white">{guide.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{guide.summary}</p>
                  <Link href={`/guides/${guide.slug}`} className="mt-6 inline-flex rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-black text-cyan-950 transition group-hover:bg-orange-300 group-hover:text-orange-950">
                    {guide.linkLabel}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-[28px] border border-dashed border-white/15 bg-white/[0.035] p-8 text-center">
          <p className="font-bold text-white">No guides match those filters.</p>
          <p className="mt-2 text-sm text-slate-400">Try another game name, problem, or topic.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 min-h-11 rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-black text-cyan-950 hover:bg-orange-300 hover:text-orange-950"
          >
            Clear guide filters
          </button>
        </div>
      )}
    </section>
  );
}
