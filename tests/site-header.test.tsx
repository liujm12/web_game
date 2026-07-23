// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "@/components/site-header";

describe("SiteHeader", () => {
  it("includes an All Games navigation link", () => {
    render(<SiteHeader brandName="TurboArcade" />);

    expect(screen.getByRole("link", { name: "All Games" })).toHaveAttribute(
      "href",
      "/games",
    );
  });

  it("places All Games after Brain", () => {
    render(<SiteHeader brandName="TurboArcade" />);

    const nav = screen.getAllByRole("navigation")[0];
    const labels = Array.from(nav.querySelectorAll("a")).map((link) =>
      link.textContent?.trim(),
    );

    expect(labels).toEqual(["Home", "Arcade", "Brain", "All Games", "Admin"]);
  });
});
