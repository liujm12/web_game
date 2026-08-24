// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

afterEach(cleanup);

describe("mobile game detail layout", () => {
  it("puts the playable surface before intro copy and hides empty ad placements", async () => {
    const pageModule = await import("@/app/games/[slug]/page");
    const Page = pageModule.default;

    render(await Page({ params: Promise.resolve({ slug: "meteor-sprint" }) }));

    const playButton = screen.getByRole("button", { name: "Start run" });
    const introHeading = screen.getByRole("heading", { name: "Meteor Sprint" });

    expect(
      Boolean(playButton.compareDocumentPosition(introHeading) & Node.DOCUMENT_POSITION_FOLLOWING),
    ).toBe(true);
    expect(screen.queryByText("Gameplay footer placement")).not.toBeInTheDocument();
    expect(screen.queryByText("In-game sidebar placement")).not.toBeInTheDocument();
  });

  it("does not show empty game ad reservations on the detail page", async () => {
    const pageModule = await import("@/app/games/[slug]/page");
    const Page = pageModule.default;

    render(await Page({ params: Promise.resolve({ slug: "meteor-sprint" }) }));

    expect(screen.queryByText("Gameplay footer placement")).not.toBeInTheDocument();
    expect(screen.queryByText("In-game sidebar placement")).not.toBeInTheDocument();
  });

  it("uses compact mobile header spacing and an opaque background", async () => {
    const { SiteHeader } = await import("@/components/site-header");

    render(<SiteHeader brandName="TurboArcade" />);

    expect(screen.getByRole("banner")).toHaveClass("bg-[#030712]/95");
    expect(screen.getByText("Browser games for quick breaks")).toHaveClass(
      "hidden",
    );
    expect(screen.getByLabelText("Mobile quick links")).toHaveClass("pb-3");
  });
});
