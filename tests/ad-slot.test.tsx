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

  it("hides the placement when a real slot is not configured", () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT = "ca-pub-1015999676044681";

    const { container } = render(<AdSlot label="Gameplay footer placement" />);

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText("Gameplay footer placement")).not.toBeInTheDocument();
    expect(screen.queryByText("Sponsored")).not.toBeInTheDocument();
    expect(screen.queryByText(/NEXT_PUBLIC_ADSENSE_CLIENT/)).not.toBeInTheDocument();
  });

  it("renders a sponsored slot when both publisher client and slot are configured", () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT = "ca-pub-1015999676044681";

    const { container } = render(
      <AdSlot label="Gameplay footer placement" slot="1234567890" />,
    );

    expect(screen.getByText("Sponsored")).toBeInTheDocument();
    expect(container.querySelector(".adsbygoogle")).toHaveAttribute(
      "data-ad-slot",
      "1234567890",
    );
  });
});
