// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("All games page", () => {
  it("shows every live game in one place", async () => {
    const pageModule = await import("@/app/games/page");
    const Page = pageModule.default;

    render(await Page());

    expect(
      screen.getByRole("heading", { name: "All browser games, one quick shelf" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Meteor Sprint")).toBeInTheDocument();
    expect(screen.getByText("Number Rush")).toBeInTheDocument();
    expect(screen.getByText("Orbit Hopper")).toBeInTheDocument();
  });
});
