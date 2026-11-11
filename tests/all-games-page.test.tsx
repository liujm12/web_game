// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("All games page", () => {
  it("shows the curated live catalog and hides draft games", async () => {
    const pageModule = await import("@/app/games/page");
    const Page = pageModule.default;

    render(await Page());

    expect(
      screen.getByRole("heading", { name: "A curated catalog of playable browser games" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Start with our eight core games" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "More Arcade games" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "More Brain games" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Patrol Escape")).toBeInTheDocument();
    expect(screen.getByText("Meteor Sprint")).toBeInTheDocument();
    expect(screen.getByText("Number Rush")).toBeInTheDocument();
    expect(screen.getByText("Pattern Pulse")).toBeInTheDocument();
    expect(screen.getByText("Comet Loop")).toBeInTheDocument();
    expect(screen.queryByText("Orbit Hopper")).not.toBeInTheDocument();
    expect(screen.queryByText("Neon Drift")).not.toBeInTheDocument();
    expect(screen.queryByText("Signal Sweep")).not.toBeInTheDocument();
    expect(screen.queryByText("Every live game in the catalog")).not.toBeInTheDocument();
  });
});
