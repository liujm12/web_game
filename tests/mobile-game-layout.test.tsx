// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

afterEach(cleanup);

describe("mobile game detail layout", () => {
  it("puts the playable surface before intro copy and every ad placement", async () => {
    const pageModule = await import("@/app/games/[slug]/page");
    const Page = pageModule.default;

    render(await Page({ params: Promise.resolve({ slug: "meteor-sprint" }) }));

    const playButton = screen.getByRole("button", { name: "Start run" });
    const introHeading = screen.getByRole("heading", { name: "Meteor Sprint" });
    const adLabels = [
      screen.getByText("Gameplay footer placement"),
      screen.getByText("In-game sidebar placement"),
    ];

    expect(
      Boolean(playButton.compareDocumentPosition(introHeading) & Node.DOCUMENT_POSITION_FOLLOWING),
    ).toBe(true);

    adLabels.forEach((label) => {
      expect(
        Boolean(playButton.compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING),
      ).toBe(true);
    });
  });

  it("keeps both game ad placements available on the detail page", async () => {
    const pageModule = await import("@/app/games/[slug]/page");
    const Page = pageModule.default;

    render(await Page({ params: Promise.resolve({ slug: "meteor-sprint" }) }));

    expect(screen.getAllByText("Gameplay footer placement")).toHaveLength(1);
    expect(screen.getAllByText("In-game sidebar placement")).toHaveLength(1);
  });

  it("uses compact mobile header spacing and an opaque background", async () => {
    const { SiteHeader } = await import("@/components/site-header");

    render(<SiteHeader brandName="TurboArcade" />);

    expect(screen.getByRole("banner")).toHaveClass("bg-slate-950");
    expect(screen.getByText("Browser games for quick breaks")).toHaveClass(
      "hidden",
    );
    expect(screen.getByLabelText("Mobile quick links")).toHaveClass("pb-3");
  });
});
