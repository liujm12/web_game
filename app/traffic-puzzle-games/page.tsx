import type { Metadata } from "next";
import Link from "next/link";

import { GameCard } from "@/components/game-card";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getGuideBySlug } from "@/data/guides";
import { getPublicGames, getSiteContent } from "@/lib/site-content";
import { buildSocialMetadata } from "@/lib/social-metadata";
import { buildTopicHubStructuredData } from "@/lib/structured-data";

const title = "Traffic Puzzle Games: Clear the Grid One Move at a Time";
const description = "Learn how traffic puzzles work, how to read vehicle blockers and difficulty, and how TurboArcade's original Patrol Escape boards are verified.";

export const metadata: Metadata = buildSocialMetadata({ title: `${title} | TurboArcade`, description, path: "/traffic-puzzle-games" });

const topics = [
  { heading: "What is a traffic puzzle?", text: "A traffic puzzle is a spatial logic game: vehicles occupy fixed grid cells, and you slide them through open space to create a route for a target vehicle. The challenge is not driving or timing. It is deciding which car must move first so another can move later." },
  { heading: "One axis per vehicle", text: "Each vehicle has a fixed orientation. Horizontal cars slide only along their row; vertical vans slide only along their column. No vehicle turns, jumps, or overlaps another. A legal move needs an empty destination cell for every part of the vehicle." },
  { heading: "Recognize the common blocker patterns", text: "Most boards combine a direct exit blocker with a crossing blocker: the car in the escape lane cannot move until a perpendicular vehicle shifts, but that vehicle may need a temporary parking space. Long trucks, edge traps, and nearly full rows make those dependencies harder to see." },
  { heading: "How difficulty changes", text: "Beginner (Easy) boards use a few short vehicles and visible empty cells. Intermediate (Medium and Hard) puzzles add crossing dependencies and often require moving a blocker away, then returning it. Expert boards restrict parking space. Master layouts are denser still: eight or more blockers and at least twenty grid steps in a shortest verified solution." },
  { heading: "Why Patrol Escape has 120 distinct layouts", text: "Patrol Escape's 120 boards are authored as a progression, from introductory layouts to twenty Master missions. They are not 120 random rearrangements: board names, blocker placement, and par targets are set as individual challenges. A built-in solver checks that each layout can be completed." },
  { heading: "How we verify a layout", text: "The local solver explores legal single-cell moves, respecting vehicle direction, occupied cells, and board boundaries. It must find a route that moves the police cruiser out through the right-side opening. Master boards are also checked against their minimum solution length and blocker-count requirements. Verification establishes solvability, not a unique solution." },
];

export default async function TrafficPuzzleGamesPage() {
  const content = await getSiteContent();
  const publicGames = getPublicGames(content);
  const patrol = publicGames.find((game) => game.slug === "patrol-escape");
  const guide = getGuideBySlug("how-to-play-patrol-escape");
  const strategyGuide = getGuideBySlug("patrol-escape-beginner-strategy");
  const expertGuide = getGuideBySlug("expert-traffic-puzzle-guide");
  const related = publicGames.filter((game) => ["merge-shot-2048", "2048", "color-sort"].includes(game.slug));

  return <div className="min-h-screen text-white">
    <JsonLd data={buildTopicHubStructuredData({ title, description, path: "/traffic-puzzle-games", sections: topics, relatedPaths: ["/games/patrol-escape", ...(guide ? [`/guides/${guide.slug}`] : []), ...(strategyGuide ? [`/guides/${strategyGuide.slug}`] : []), ...(expertGuide ? [`/guides/${expertGuide.slug}`] : [])] })} />
    <SiteHeader brandName={content.site.brandName} />
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-14">
      <header className="rounded-[32px] border border-cyan-100/12 bg-[#080b16]/92 p-7 sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-200">Puzzle field notes</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">Traffic puzzles reward planning, not speed. Learn to trace the exit lane, identify temporary parking spaces, and move each vehicle only along its own axis.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          {patrol && <Link className="rounded-full bg-cyan-300 px-5 py-3 font-black text-slate-950" href="/games/patrol-escape">Play Patrol Escape</Link>}
          {guide && <Link className="rounded-full border border-white/15 px-5 py-3 font-bold" href={`/guides/${guide.slug}`}>How to Play Patrol Escape</Link>}
          {strategyGuide && <Link className="rounded-full border border-white/15 px-5 py-3 font-bold" href={`/guides/${strategyGuide.slug}`}>Beginner Strategy</Link>}
          {expertGuide && <Link className="rounded-full border border-white/15 px-5 py-3 font-bold" href={`/guides/${expertGuide.slug}`}>Expert Guide</Link>}
        </div>
      </header>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {topics.map((topic, index) => <section key={topic.heading} className="rounded-[26px] border border-white/10 bg-[#0a0d18]/90 p-6 sm:p-7">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-200">Field note {String(index + 1).padStart(2, "0")}</p>
          <h2 className="mt-3 text-2xl font-black">{topic.heading}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">{topic.text}</p>
        </section>)}
      </div>
      <section className="mt-8 rounded-[28px] border border-cyan-200/15 bg-cyan-300/[0.05] p-6 sm:p-8">
        <h2 className="text-2xl font-black">Start with the original board set</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">Patrol Escape is TurboArcade&apos;s original traffic-grid game: 120 named boards, a six-by-six board, direction-locked vehicles, locally saved best moves, hints, undo, and a solver-checked route to the exit. The final twenty Master boards each have at least eight blockers and a verified shortest path of twenty or more grid steps.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="rounded-full bg-orange-300 px-5 py-3 font-black text-slate-950" href="/games/patrol-escape">Enter Patrol Escape</Link>
          {guide && <Link className="rounded-full border border-white/15 px-5 py-3 font-bold" href={`/guides/${guide.slug}`}>Read the how-to guide</Link>}
          {strategyGuide && <Link className="rounded-full border border-white/15 px-5 py-3 font-bold" href={`/guides/${strategyGuide.slug}`}>Study three real levels</Link>}
          {expertGuide && <Link className="rounded-full border border-white/15 px-5 py-3 font-bold" href={`/guides/${expertGuide.slug}`}>Analyze three Master boards</Link>}
        </div>
      </section>
      <section className="mt-10">
        <h2 className="text-3xl font-black">Related strategy games</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">If you enjoy freeing space and planning several moves ahead, try these other grid and sorting puzzles.</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{related.map((game) => <GameCard key={game.slug} game={game} />)}</div>
      </section>
    </main>
    <SiteFooter brandName={content.site.brandName} supportEmail={content.site.supportEmail} />
  </div>;
}
