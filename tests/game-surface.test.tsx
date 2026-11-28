// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GameSurface } from "@/components/game-surface";
import { SOUND_PREFERENCE_KEY } from "@/lib/game-sound";
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
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
      },
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders internal games through the local component registry with display and sound controls", async () => {
    render(<GameSurface game={baseGame} />);

    expect(await screen.findByRole("button", { name: "Start run" })).toBeInTheDocument();
    expect(screen.getByText("Ready for launch?")).toBeInTheDocument();

    const soundButton = screen.getByRole("button", { name: "Sound: On" });
    expect(soundButton).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(soundButton);
    expect(screen.getByRole("button", { name: "Sound: Off" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(storage.get(SOUND_PREFERENCE_KEY)).toBe("off");
  });

  it("toggles fallback fullscreen mode and closes on Escape when Fullscreen API is unavailable", async () => {
    const { container } = render(<GameSurface game={baseGame} />);
    await screen.findByRole("button", { name: "Start run" });

    const root = container.querySelector<HTMLElement>('[data-game-surface-root="true"]')!;
    expect(root).toHaveAttribute("data-fullscreen", "false");

    fireEvent.click(screen.getByRole("button", { name: "Fullscreen" }));
    expect(root).toHaveAttribute("data-fullscreen", "true");
    expect(screen.getByRole("button", { name: "Exit fullscreen" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(root).toHaveAttribute("data-fullscreen", "false");
    expect(screen.getByRole("button", { name: "Fullscreen" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("uses native Fullscreen API when supported", async () => {
    const { container } = render(<GameSurface game={baseGame} />);
    await screen.findByRole("button", { name: "Start run" });

    const root = container.querySelector<HTMLElement>('[data-game-surface-root="true"]')!;
    const requestFullscreen = vi.fn().mockImplementation(async () => {
      Object.defineProperty(document, "fullscreenElement", {
        configurable: true,
        value: root,
      });
      document.dispatchEvent(new Event("fullscreenchange"));
    });
    const exitFullscreen = vi.fn().mockImplementation(async () => {
      Object.defineProperty(document, "fullscreenElement", {
        configurable: true,
        value: null,
      });
      document.dispatchEvent(new Event("fullscreenchange"));
    });

    Object.defineProperty(root, "requestFullscreen", {
      configurable: true,
      value: requestFullscreen,
    });
    Object.defineProperty(document, "exitFullscreen", {
      configurable: true,
      value: exitFullscreen,
    });

    fireEvent.click(screen.getByRole("button", { name: "Fullscreen" }));
    expect(requestFullscreen).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole("button", { name: "Exit fullscreen" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Exit fullscreen" }));
    expect(exitFullscreen).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole("button", { name: "Fullscreen" })).toBeInTheDocument();
  });

  it("renders embed games in an iframe shell with fullscreen control and without misleading sound toggle", () => {
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
    expect(screen.getByTitle("Play Mini Golf Tour")).toHaveAttribute("scrolling", "no");
    expect(screen.getByLabelText("Mini Golf Tour play area")).toHaveClass(
      "min-h-[680px]",
    );
    expect(
      screen.getByText("Game opens in the frame below without leaving TurboArcade."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fullscreen" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Sound:/ })).not.toBeInTheDocument();
  });
});
