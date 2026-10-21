// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { PlayerGameTools } from "@/components/player-game-tools";
import { parsePlayerProfile, PLAYER_PROFILE_KEY } from "@/lib/player-profile";

describe("PlayerGameTools", () => {
  const values = new Map<string, string>();

  beforeEach(() => {
    values.clear();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
      },
    });
  });

  afterEach(() => cleanup());

  it("records a visit and lets the player save the game", async () => {
    render(<PlayerGameTools slug="snake" title="Snake" />);

    await waitFor(() => {
      expect(parsePlayerProfile(values.get(PLAYER_PROFILE_KEY) ?? null).recent[0]?.slug).toBe(
        "snake",
      );
    });

    fireEvent.click(screen.getByRole("button", { name: "Save game" }));

    expect(screen.getByRole("button", { name: "Saved" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(parsePlayerProfile(values.get(PLAYER_PROFILE_KEY) ?? null).favorites).toEqual([
      "snake",
    ]);
  });
});
