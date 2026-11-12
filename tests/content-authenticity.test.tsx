// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { existsSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import AboutPage from "@/app/about/page";
import EditorialPolicyPage from "@/app/editorial-policy/page";
import GuidePage from "@/app/guides/[slug]/page";
import { GameCard } from "@/components/game-card";
import {
  GAMEPLAY_SCREENSHOT_PROVENANCE,
  gameScreenshotSets,
} from "@/data/game-screenshots";
import { guides } from "@/data/guides";
import {
  EDITORIAL_POLICY_UPDATED_AT,
  EDITORIAL_TEAM_NAME,
} from "@/lib/editorial";
import { getSiteContent } from "@/lib/site-content";

afterEach(() => cleanup());

describe("content authenticity", () => {
  it("explains the publishing byline without implying an unverified newsroom", async () => {
    const policy = render(await EditorialPolicyPage());
    const policyText = policy.container.textContent ?? "";

    expect(
      screen.getByRole("heading", { name: "Who the byline represents" }),
    ).toBeInTheDocument();
    expect(policyText).toMatch(/site-level publishing byline/i);
    expect(policyText).toMatch(/does not claim a particular staff size/i);
    expect(policyText).toContain(EDITORIAL_TEAM_NAME);
    expect(EDITORIAL_POLICY_UPDATED_AT).toBe("November 12, 2026");
    cleanup();

    const about = render(await AboutPage());
    const aboutText = about.container.textContent ?? "";
    expect(aboutText).toMatch(/site-level publishing byline/i);
    expect(aboutText).toMatch(/owner\/operator/i);
  });

  it("discloses substantial AI assistance and keeps accountability with the site operator", async () => {
    const { container } = render(await EditorialPolicyPage());
    const text = container.textContent ?? "";

    expect(
      screen.getByRole("heading", { name: "AI assistance and accountability" }),
    ).toBeInTheDocument();
    expect(text).toMatch(/substantial AI assistance/i);
    expect(text).toMatch(/draft and revise copy/i);
    expect(text).toMatch(/write and refactor code/i);
    expect(text).toMatch(/owner\/operator decides what is published/i);
    expect(text).toMatch(/do not invent testimonials, audience figures, rankings, or gameplay results/i);
  });

  it("publishes a current, game-specific verification record for every guide", async () => {
    const today = new Date("2026-11-12T23:59:59Z");

    for (const guide of guides) {
      expect(guide.updatedAt).toBe("November 12, 2026");
      expect(guide.verifiedAt).toBe("November 12, 2026");
      expect(guide.verificationNote.length).toBeGreaterThan(110);
      expect(new Date(`${guide.updatedAt} 12:00:00 UTC`).getTime()).toBeLessThanOrEqual(
        today.getTime(),
      );
      expect(new Date(`${guide.verifiedAt} 12:00:00 UTC`).getTime()).toBeLessThanOrEqual(
        today.getTime(),
      );

      render(
        await GuidePage({
          params: Promise.resolve({ slug: guide.slug }),
        }),
      );
      expect(
        screen.getByText(`Published by ${EDITORIAL_TEAM_NAME}`),
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Gameplay checked ${guide.verifiedAt}`),
      ).toBeInTheDocument();
      expect(screen.getByText(guide.verificationNote)).toBeInTheDocument();
      expect(document.body.textContent).not.toMatch(/Written and reviewed by/i);
      cleanup();
    }
  });

  it("uses only relevant screenshots from the real gameplay manifest in guides", () => {
    const screenshotBySource = new Map(
      Object.values(gameScreenshotSets)
        .flat()
        .map((screenshot) => [screenshot.src, screenshot]),
    );

    expect(GAMEPLAY_SCREENSHOT_PROVENANCE.source).toBe(
      "TurboArcade playable build",
    );
    expect(GAMEPLAY_SCREENSHOT_PROVENANCE.disclosure).toMatch(
      /not AI-generated gameplay art/i,
    );

    for (const guide of guides) {
      for (const image of guide.images ?? []) {
        const screenshot = screenshotBySource.get(image.src);
        expect(screenshot, `${image.src} must be registered`).toBeDefined();
        expect(guide.relatedGameSlugs).toContain(screenshot?.gameSlug);
        expect(existsSync(path.join(process.cwd(), "public", image.src))).toBe(true);
        expect(image.caption).toMatch(/^Captured from the playable game/);
      }
    }
  });

  it("does not expose unsupported popularity, audience, review, or ranking claims", async () => {
    const content = await getSiteContent();
    const unsupportedClaim =
      /\b\d[\d,.]*\s+(players|downloads|reviews)\b|\bpopularity\s*\d|\bhot score\b|\branked\s+#?\d/i;

    for (const game of content.games) {
      const view = render(<GameCard game={game} />);
      expect(view.container.textContent ?? "").not.toMatch(unsupportedClaim);
      cleanup();
    }
  });

  it("records the site content review on the date of this audit", async () => {
    const content = await getSiteContent();
    expect(content.site.contentUpdatedAt).toBe("2026-11-12");
  });
});
