// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CategoryHero } from "@/components/category-hero";
import { GamePageIntro } from "@/components/game-page-intro";
import type { CategoryRecord, GameRecord } from "@/lib/site-content";

const category = {
  slug: "arcade",
  name: "Arcade",
  description: "Fast-reflex browser games for quick sessions.",
  highlight: "Best for two-minute breaks",
} satisfies CategoryRecord;

const game = {
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
  playMode: "internal",
  heroGradient: "from-cyan-400 via-sky-500 to-indigo-700",
  seoTitle: "Meteor Sprint",
  seoDescription: "Play Meteor Sprint online.",
} satisfies GameRecord;

describe("player-facing page sections", () => {
  it("frames game detail intro around instant play signals", () => {
    render(<GamePageIntro game={game} />);

    expect(screen.getByText("Arcade / 90 seconds")).toBeInTheDocument();
    expect(screen.getByText("Easy to learn")).toBeInTheDocument();
    expect(screen.getByText("Short rounds")).toBeInTheDocument();
    expect(screen.getByText("Original play page")).toBeInTheDocument();
    expect(screen.getByText("Native browser game")).toBeInTheDocument();
  });

  it("frames category hero around player choice and pace", () => {
    render(<CategoryHero category={category} gameCount={3} />);

    expect(
      screen.getByRole("heading", { name: "Arcade games for fast starts" }),
    ).toBeInTheDocument();
    expect(screen.getByText("3 quick games ready")).toBeInTheDocument();
    expect(screen.getByText("Best for two-minute breaks")).toBeInTheDocument();
  });
});
