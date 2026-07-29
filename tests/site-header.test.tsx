// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { SiteHeader } from "@/components/site-header";

describe("SiteHeader", () => {
  afterEach(() => {
    cleanup();
  });

  it("includes an All Games navigation link", () => {
    render(<SiteHeader brandName="TurboArcade" />);

    expect(screen.getAllByRole("link", { name: "All Games" })[0]).toHaveAttribute(
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

  it("keeps core navigation reachable on mobile", () => {
    render(<SiteHeader brandName="TurboArcade" />);

    const mobileNav = screen.getByRole("navigation", { name: "Mobile quick links" });
    const labels = Array.from(mobileNav.querySelectorAll("a")).map((link) =>
      link.textContent?.trim(),
    );

    expect(labels).toEqual(["Arcade", "Brain", "All Games"]);
    expect(screen.getAllByRole("link", { name: "All Games" })[1]).toHaveAttribute(
      "href",
      "/games",
    );
  });
});
