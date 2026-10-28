// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import NotFound, { metadata as notFoundMetadata } from "@/app/not-found";
import { GET as getLlmsText } from "@/app/llms.txt/route";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { guides } from "@/data/guides";
import { parseEditorialDate } from "@/lib/editorial";

afterEach(() => cleanup());

describe("technical SEO surfaces", () => {
  it("provides a useful, non-indexable branded 404 page", async () => {
    render(await NotFound());

    expect(
      screen.getByRole("heading", { name: "Page not found" }),
    ).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("link", { name: "Home" })
        .some((link) => link.getAttribute("href") === "/"),
    ).toBe(true);
    expect(
      screen
        .getAllByRole("link", { name: "All Games" })
        .some((link) => link.getAttribute("href") === "/games"),
    ).toBe(true);
    expect(
      screen
        .getAllByRole("link", { name: "Guides" })
        .some((link) => link.getAttribute("href") === "/guides"),
    ).toBe(true);
    expect(notFoundMetadata.robots).toEqual({ index: false, follow: false });
  });

  it("publishes a concise public llms.txt without private routes", async () => {
    const response = await getLlmsText();
    const body = await response.text();

    expect(response.headers.get("content-type")).toContain("text/plain");
    expect(body).toContain("# TurboArcade");
    expect(body).toContain("https://playturboarcade.com/games");
    expect(body).toContain("https://playturboarcade.com/guides");
    expect(body).toContain("https://playturboarcade.com/editorial-policy");
    expect(body).not.toContain("/admin");
    expect(body).not.toContain("/api");
    expect(body).not.toContain("/my-games");
  });

  it("keeps private utility routes out of crawling", () => {
    const rules = robots().rules;
    const rule = Array.isArray(rules) ? rules[0] : rules;

    expect(rule.disallow).toEqual(
      expect.arrayContaining(["/admin", "/api", "/my-games"]),
    );
  });

  it("uses page-specific guide dates and includes the editorial policy", async () => {
    const entries = await sitemap();
    const guide = guides[0];
    const guideEntry = entries.find(
      (entry) =>
        entry.url === `https://playturboarcade.com/guides/${guide.slug}`,
    );

    expect(
      entries.some(
        (entry) =>
          entry.url === "https://playturboarcade.com/editorial-policy",
      ),
    ).toBe(true);
    expect(
      entries.some(
        (entry) => entry.url === "https://playturboarcade.com/my-games",
      ),
    ).toBe(false);
    expect(new Date(guideEntry!.lastModified!).toISOString()).toBe(
      new Date(`${guide.updatedAt} 12:00:00 UTC`).toISOString(),
    );
  });

  it("falls back safely when an editorial date is invalid", () => {
    const fallback = new Date("2026-10-22T00:00:00.000Z");

    expect(parseEditorialDate("not-a-date", fallback)).toEqual(fallback);
  });
});
