// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HomeHero } from "@/components/home-hero";
import type { GameRecord, SiteSettings } from "@/lib/site-content";

const site = {
  brandName: "TurboArcade",
  tagline: "Jump in. Play fast. Come back for one more round.",
  description: "Fast browser games for quick breaks.",
  adsenseClient: "",
  supportEmail: "hello@turboarcade.test",
  launchedAt: "2026-07-23",
} satisfies SiteSettings;

const featuredGame = {
  slug: "meteor-sprint",
  title: "Meteor Sprint",
  category: "arcade",
  summary: "Slide across three lanes and dodge meteor strikes.",
  description: "A quick reflex game.",
  instructions: ["Move left", "Move right"],
  tags: ["Reflex", "Quick Play"],
  featured: true,
  trendingScore: 98,
  difficulty: "Easy",
  playersLabel: "Single player",
  status: "live",
  estimatedSession: "90 seconds",
  componentKey: "meteor-sprint",
  heroGradient: "from-cyan-400 via-sky-500 to-indigo-700",
  seoTitle: "Meteor Sprint",
  seoDescription: "Play Meteor Sprint online.",
} satisfies GameRecord;

describe("HomeHero", () => {
  it("leans into player-first value for US casual game traffic", () => {
    render(<HomeHero site={site} featuredGame={featuredGame} />);

    expect(
      screen.getByRole("heading", {
        name: "Play in your browser. No waiting around.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("No download")).toBeInTheDocument();
    expect(screen.getByText("Phone friendly")).toBeInTheDocument();
    expect(screen.getByText("Quick sessions")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Play Meteor Sprint now" }),
    ).toBeInTheDocument();
  });
});
