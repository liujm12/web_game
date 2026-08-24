// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "@/components/site-footer";

describe("SiteFooter", () => {
  it("uses player-facing trust copy instead of monetization language", () => {
    render(
      <SiteFooter
        brandName="TurboArcade"
        supportEmail="hello@turboarcade.games"
      />,
    );

    expect(screen.getByText(/free browser games/i)).toBeInTheDocument();
    expect(screen.queryByText(/monetization/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/starter build/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/retention/i)).not.toBeInTheDocument();
  });
});
