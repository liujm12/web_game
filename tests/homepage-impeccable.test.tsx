// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

afterEach(() => {
  cleanup();
});

describe("homepage Impeccable P1/P2 polish", () => {
  it("hides empty ad reservations and removes repeated recommendation sections", async () => {
    const pageModule = await import("@/app/page");
    const Page = pageModule.default;

    render(await Page());

    expect(screen.queryByText("Homepage leaderboard placement")).not.toBeInTheDocument();
    expect(screen.queryByText("Homepage featured games placement")).not.toBeInTheDocument();
    expect(screen.queryByText("Sponsored")).not.toBeInTheDocument();
    expect(screen.queryByText("Popular right now")).not.toBeInTheDocument();
    expect(screen.queryByText("Trending now")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Turbo queue" }),
    ).toBeInTheDocument();
  });

  it("adds decision chips that help players choose by time, device, and mood", async () => {
    const pageModule = await import("@/app/page");
    const Page = pageModule.default;

    render(await Page());

    for (const chip of [
      "20 sec rush",
      "Brain warm-up",
      "Arcade run",
      "Keyboard ready",
      "Thumb friendly",
    ]) {
      expect(screen.getAllByText(chip).length).toBeGreaterThan(0);
    }
  });
});
