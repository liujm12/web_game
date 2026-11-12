// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import CategoryPage from "@/app/categories/[slug]/page";
import GamePage from "@/app/games/[slug]/page";
import GuidePage from "@/app/guides/[slug]/page";
import GuidesPage from "@/app/guides/page";
import TrafficPuzzleGamesPage from "@/app/traffic-puzzle-games/page";
import { guides } from "@/data/guides";

const guideLabels: Record<string, string> = {
  "how-to-play-patrol-escape": "Learn the traffic puzzle rules",
  "patrol-escape-beginner-strategy": "Patrol Escape beginner strategy",
  "expert-traffic-puzzle-guide": "Expert traffic puzzle guide",
  "2048-corner-strategy": "2048 corner strategy",
  "recover-a-crowded-2048-board": "Recover a crowded 2048 board",
  "snake-build-space-before-length": "Build space before growing in Snake",
  "breakout-paddle-control": "Control the Breakout paddle",
  "number-rush-clean-rounds": "Play Number Rush without mistakes",
  "memory-mosaic-and-pattern-pulse-training": "Train memory and pattern recall",
};

const bannedLabels = /^(click here|read more|learn more|read the guide)$/i;

afterEach(() => cleanup());

describe("content cluster links", () => {
  it("gives every guide a hub and exactly one next guide", () => {
    for (const guide of guides) {
      expect(guide.relatedHub, `${guide.slug} needs a content hub`).toBeDefined();
      expect(guide.relatedGuideSlugs, `${guide.slug} needs one next guide`).toHaveLength(1);
      expect(guide.relatedGuideSlugs?.[0]).not.toBe(guide.slug);
      expect(guides.some((candidate) => candidate.slug === guide.relatedGuideSlugs?.[0])).toBe(true);
    }
  });

  it("uses one complete, descriptive link set on the traffic puzzle hub", async () => {
    const rendered = render(await TrafficPuzzleGamesPage());

    expect(screen.getByRole("link", { name: "Play Patrol Escape" })).toHaveAttribute("href", "/games/patrol-escape");
    expect(screen.getByRole("link", { name: "Learn the traffic puzzle rules" })).toHaveAttribute("href", "/guides/how-to-play-patrol-escape");
    expect(screen.getByRole("link", { name: "Patrol Escape beginner strategy" })).toHaveAttribute("href", "/guides/patrol-escape-beginner-strategy");
    expect(screen.getByRole("link", { name: "Expert traffic puzzle guide" })).toHaveAttribute("href", "/guides/expert-traffic-puzzle-guide");

    for (const path of [
      "/games/patrol-escape",
      "/guides/how-to-play-patrol-escape",
      "/guides/patrol-escape-beginner-strategy",
      "/guides/expert-traffic-puzzle-guide",
    ]) {
      expect(rendered.container.querySelectorAll(`a[href="${path}"]`)).toHaveLength(1);
    }
  });

  it("links a game to its hub, guides, and three related games", async () => {
    render(await GamePage({ params: Promise.resolve({ slug: "patrol-escape" }) }));

    expect(screen.getByRole("link", { name: "Explore Traffic Puzzle Games" })).toHaveAttribute("href", "/traffic-puzzle-games");
    expect(screen.getByRole("link", { name: "Learn the traffic puzzle rules" })).toHaveAttribute("href", "/guides/how-to-play-patrol-escape");
    expect(screen.getByRole("link", { name: "Patrol Escape beginner strategy" })).toHaveAttribute("href", "/guides/patrol-escape-beginner-strategy");
    expect(screen.getByRole("link", { name: "Expert traffic puzzle guide" })).toHaveAttribute("href", "/guides/expert-traffic-puzzle-guide");

    const relatedGames = screen.getByRole("region", { name: "Related games" });
    const gameLinks = within(relatedGames)
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href")?.startsWith("/games/"));
    expect(gameLinks).toHaveLength(3);
  });

  it("gives every guide a practice game, a hub, and one descriptive next guide", async () => {
    for (const guide of guides) {
      render(await GuidePage({ params: Promise.resolve({ slug: guide.slug }) }));

      const firstGame = guide.relatedGameSlugs[0];
      expect(screen.getAllByRole("link").some((link) => link.getAttribute("href") === `/games/${firstGame}`)).toBe(true);
      expect(screen.getByRole("link", { name: `Explore ${guide.relatedHub?.label}` })).toHaveAttribute("href", guide.relatedHub?.href);

      const continuation = screen.getByRole("region", { name: "Continue this topic" });
      const nextGuideLinks = within(continuation)
        .getAllByRole("link")
        .filter((link) => link.getAttribute("href")?.startsWith("/guides/"));
      expect(nextGuideLinks).toHaveLength(1);
      expect(nextGuideLinks[0]).toHaveTextContent(guideLabels[guide.relatedGuideSlugs?.[0] ?? ""]);

      cleanup();
    }
  });

  it("lists every category guide from its assigned center page", async () => {
    for (const categorySlug of ["arcade", "brain"]) {
      render(await CategoryPage({ params: Promise.resolve({ slug: categorySlug }) }));
      const center = screen.getByRole("region", { name: "Guides for this collection" });
      const expectedGuides = guides.filter((guide) => guide.relatedHub?.href === `/categories/${categorySlug}`);

      for (const guide of expectedGuides) {
        expect(within(center).getByRole("link", { name: guideLabels[guide.slug] })).toHaveAttribute("href", `/guides/${guide.slug}`);
      }
      cleanup();
    }
  });

  it("uses descriptive guide titles on the guides index", async () => {
    const rendered = render(await GuidesPage());

    for (const guide of guides) {
      expect(screen.getByRole("link", { name: guideLabels[guide.slug] })).toHaveAttribute("href", `/guides/${guide.slug}`);
    }
    for (const link of Array.from(rendered.container.querySelectorAll("a"))) {
      expect(link.textContent?.trim()).not.toMatch(bannedLabels);
    }
  });
});
