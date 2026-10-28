// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import AboutPage from "@/app/about/page";
import ContactPage from "@/app/contact/page";
import EditorialPolicyPage, {
  metadata as editorialPolicyMetadata,
} from "@/app/editorial-policy/page";
import { SiteFooter } from "@/components/site-footer";

afterEach(() => cleanup());

describe("editorial trust", () => {
  it("publishes a complete editorial policy under the brand editorial team", async () => {
    const { container } = render(await EditorialPolicyPage());
    const text = container.textContent ?? "";

    expect(
      screen.getByRole("heading", { level: 1, name: "Editorial Policy" }),
    ).toBeInTheDocument();
    expect(text).toContain("TurboArcade Editorial Team");
    expect(text).toContain("How we test games");
    expect(text).toContain("How guides are written and reviewed");
    expect(text).toContain("Corrections and updates");
    expect(text).toContain("Advertising and editorial independence");
    expect(editorialPolicyMetadata.alternates?.canonical).toBe(
      "/editorial-policy",
    );
  });

  it("explains the real publishing workflow on the About page", async () => {
    const { container } = render(await AboutPage());
    const text = container.textContent ?? "";

    expect(text).toContain("TurboArcade Editorial Team");
    expect(text).toContain("desktop and mobile");
    expect(
      screen
        .getAllByRole("link", { name: "Editorial Policy" })
        .some((link) => link.getAttribute("href") === "/editorial-policy"),
    ).toBe(true);
  });

  it("makes content corrections a first-class contact reason", async () => {
    const { container } = render(await ContactPage());
    const text = container.textContent ?? "";

    expect(text).toContain("Content corrections");
    expect(text).toContain("screenshot or steps to reproduce");
    expect(text).toContain("TurboArcade Editorial Team");
  });

  it("links the global footer to the editorial policy", () => {
    render(
      <SiteFooter
        brandName="TurboArcade"
        supportEmail="hello@playturboarcade.com"
      />,
    );

    expect(
      screen.getByRole("link", { name: "Editorial Policy" }),
    ).toHaveAttribute("href", "/editorial-policy");
  });
});
