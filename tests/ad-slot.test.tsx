// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AdSlot } from "@/components/ad-slot";

describe("AdSlot", () => {
  const originalClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  afterEach(() => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT = originalClient;
  });

  it("shows review-safe ad copy instead of setup instructions when slots are pending", () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT = "ca-pub-1015999676044681";

    render(<AdSlot label="Gameplay footer placement" />);

    expect(screen.getByText("Sponsored")).toBeInTheDocument();
    expect(screen.getByText("Gameplay footer placement")).toBeInTheDocument();
    expect(screen.queryByText(/NEXT_PUBLIC_ADSENSE_CLIENT/)).not.toBeInTheDocument();
    expect(screen.queryByText(/ad slot ID/)).not.toBeInTheDocument();
    expect(screen.queryByText(/production launch/)).not.toBeInTheDocument();
  });
});
