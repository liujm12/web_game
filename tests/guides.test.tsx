// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { guides } from "@/data/guides";

describe("guides", () => {
  it("ships a first batch of substantial, game-specific guides", () => {
    expect(guides.length).toBeGreaterThanOrEqual(4);

    for (const guide of guides) {
      expect(guide.sections.length).toBeGreaterThanOrEqual(3);
      expect(guide.sections.flatMap((section) => section.paragraphs).join(" ").length).toBeGreaterThan(700);
      expect(guide.relatedGameSlugs.length).toBeGreaterThan(0);
    }
  });

  it("renders the guides index with original strategy topics", async () => {
    const pageModule = await import("@/app/guides/page");
    const Page = pageModule.default;

    render(await Page());

    expect(screen.getByRole("heading", { name: "Play smarter, one game at a time" })).toBeInTheDocument();
    expect(screen.getByText("2048 Corner Strategy")).toBeInTheDocument();
    expect(screen.getByText("Snake: Build Space Before Length")).toBeInTheDocument();
  });
});
