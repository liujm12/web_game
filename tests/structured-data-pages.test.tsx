// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import CategoryPage from "@/app/categories/[slug]/page";
import GamePage from "@/app/games/[slug]/page";
import AllGamesPage from "@/app/games/page";
import GuidePage from "@/app/guides/[slug]/page";
import GuidesPage from "@/app/guides/page";
import HomePage from "@/app/page";

afterEach(() => cleanup());

function readStructuredData(container: HTMLElement) {
  return [...container.querySelectorAll('script[type="application/ld+json"]')]
    .map((script) => JSON.parse(script.textContent ?? "{}"));
}

describe("structured data page integration", () => {
  it("renders Organization and WebSite data on the homepage", async () => {
    const { container } = render(await HomePage());
    const documents = readStructuredData(container);

    expect(documents).toHaveLength(1);
    expect(documents[0]["@graph"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ "@type": "Organization" }),
        expect.objectContaining({ "@type": "WebSite" }),
      ]),
    );
  });

  it("renders live-game ItemLists on the all-games and category pages", async () => {
    const allGames = render(await AllGamesPage());
    const allGamesData = readStructuredData(allGames.container)[0];
    const allGamesList = allGamesData["@graph"].find(
      (entry: Record<string, unknown>) => entry["@type"] === "ItemList",
    );
    cleanup();

    const category = render(
      await CategoryPage({ params: Promise.resolve({ slug: "brain" }) }),
    );
    const categoryData = readStructuredData(category.container)[0];
    const categoryList = categoryData["@graph"].find(
      (entry: Record<string, unknown>) => entry["@type"] === "ItemList",
    );

    expect(allGamesList.numberOfItems).toBeGreaterThan(20);
    expect(categoryList.numberOfItems).toBeGreaterThan(0);
    expect(
      categoryList.itemListElement.every(
        (entry: { url: string }) => entry.url.includes("/games/"),
      ),
    ).toBe(true);
  });

  it("renders VideoGame, BreadcrumbList, and visible FAQ data on a game page", async () => {
    const { container } = render(
      await GamePage({ params: Promise.resolve({ slug: "patrol-escape" }) }),
    );
    const data = readStructuredData(container)[0];
    const types = data["@graph"].map(
      (entry: Record<string, unknown>) => entry["@type"],
    );

    expect(types).toEqual(
      expect.arrayContaining(["VideoGame", "BreadcrumbList", "FAQPage"]),
    );
  });

  it("renders guide collection and article data on guide pages", async () => {
    const guideIndex = render(await GuidesPage());
    const indexTypes = readStructuredData(guideIndex.container)[0]["@graph"].map(
      (entry: Record<string, unknown>) => entry["@type"],
    );
    cleanup();

    const guidePage = render(
      await GuidePage({
        params: Promise.resolve({ slug: "2048-corner-strategy" }),
      }),
    );
    const articleTypes = readStructuredData(guidePage.container)[0]["@graph"].map(
      (entry: Record<string, unknown>) => entry["@type"],
    );

    expect(indexTypes).toEqual(
      expect.arrayContaining(["CollectionPage", "ItemList"]),
    );
    expect(articleTypes).toEqual(
      expect.arrayContaining(["Article", "BreadcrumbList"]),
    );
  });
});
