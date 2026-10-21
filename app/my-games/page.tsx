import type { Metadata } from "next";

import { PlayerDashboard } from "@/components/player-dashboard";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "My Games | TurboArcade",
  description:
    "Your saved TurboArcade games, recently played titles, personal bests, and daily challenge on this device.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function MyGamesPage() {
  const content = await getSiteContent();
  const games = content.games.filter((game) => game.status === "live");

  return (
    <div className="min-h-screen text-white">
      <SiteHeader brandName={content.site.brandName} />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        <PlayerDashboard games={games} />
      </main>
      <SiteFooter brandName={content.site.brandName} supportEmail={content.site.supportEmail} />
    </div>
  );
}
