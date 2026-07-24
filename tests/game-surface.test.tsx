// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GameSurface } from "@/components/game-surface";
import type { GameRecord } from "@/lib/site-content";

const baseGame = {
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
  playMode: "internal",
} satisfies GameRecord;

describe("game surface", () => {
  it("renders internal games through the local component registry", () => {
    render(<GameSurface game={baseGame} />);

    expect(screen.getByRole("button", { name: "Start run" })).toBeInTheDocument();
    expect(screen.getByText("Ready for launch?")).toBeInTheDocument();
  });

  it("renders embed games in an iframe shell", () => {
    render(
      <GameSurface
        game={{
          ...baseGame,
          slug: "mini-golf",
          title: "Mini Golf Tour",
          playMode: "embed",
          componentKey: "",
          gameUrl: "https://games.example.com/mini-golf/index.html",
        }}
      />,
    );

    expect(screen.getByTitle("Play Mini Golf Tour")).toHaveAttribute(
      "src",
      "https://games.example.com/mini-golf/index.html",
    );
    expect(
      screen.getByText("Game opens in the frame below without leaving TurboArcade."),
    ).toBeInTheDocument();
  });
});
