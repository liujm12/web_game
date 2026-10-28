// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import GamePage from "@/app/games/[slug]/page";
import GuidePage from "@/app/guides/[slug]/page";
import { guides } from "@/data/guides";
import { buildGuideStructuredData } from "@/lib/structured-data";

afterEach(() => cleanup());

describe("visible editorial attribution", () => {
  it("shows the editorial team, review date, policy, and correction path on guides", async () => {
    render(
      await GuidePage({
        params: Promise.resolve({ slug: "2048-corner-strategy" }),
      }),
    );

    expect(
      screen.getByText("Written and reviewed by TurboArcade Editorial Team"),
    ).toBeInTheDocument();
    expect(screen.getByText("Updated October 21, 2026")).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("link", { name: "Editorial Policy" })
        .some((link) => link.getAttribute("href") === "/editorial-policy"),
    ).toBe(true);
    expect(
      screen.getByRole("link", { name: "Report a correction" }),
    ).toHaveAttribute("href", expect.stringContaining("mailto:"));
  });

  it("links game review information to the testing standard", async () => {
    render(
      await GamePage({
        params: Promise.resolve({ slug: "patrol-escape" }),
      }),
    );

    expect(screen.getByText("Last checked: October 2026")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "How we test games" }),
    ).toHaveAttribute("href", "/editorial-policy");
  });

  it("uses the same editorial identity in Article structured data", () => {
    const data = buildGuideStructuredData(guides[0]);
    const article = data["@graph"].find(
      (node) => node["@type"] === "Article",
    );
    const editorialTeam = data["@graph"].find(
      (node) => node["@id"] === "https://playturboarcade.com/#editorial-team",
    );

    expect(article?.author).toEqual({
      "@id": "https://playturboarcade.com/#editorial-team",
    });
    expect(editorialTeam).toMatchObject({
      "@type": "Organization",
      name: "TurboArcade Editorial Team",
      url: "https://playturboarcade.com/editorial-policy",
      parentOrganization: {
        "@id": "https://playturboarcade.com/#organization",
      },
    });
  });
});
