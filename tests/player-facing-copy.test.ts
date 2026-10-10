import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

const bannedPlayerCopy = [
  /starter build/i,
  /ad-ready/i,
  /monetization/i,
  /controls we checked/i,
  /test notes/i,
  /hands-on notes/i,
  /testing notes/i,
  /page avoids fake score claims/i,
  /reviewed together/i,
  /why does this page include tips/i,
  /a easy/i,
  /hello@turboarcade\.games/i,
  /advertising space reserved/i,
  /local development build/i,
  /advertising readiness/i,
  /catalog notes/i,
  /site is in its early stage/i,
  /how we test pages/i,
  /fake author bios/i,
  /while testing/i,
  /layout is checked/i,
  /stay close to the play field when possible/i,
  /visitors who want to understand the game before pressing play/i,
  /launch quality testing/i,
  /copyrighted character art/i,
  /adding language variety to the game catalog/i,
  /controls checked/i,
  /goes back into revision/i,
];

describe("player-facing copy", () => {
  it("keeps game content focused on players instead of internal review work", async () => {
    const [content, homePage, gamePage, gamesPage, aboutPage, privacyPage, footer, gameCard, gameIntro, adSlot] = await Promise.all([
      readFile("data/site-content.json", "utf8"),
      readFile("app/page.tsx", "utf8"),
      readFile("app/games/[slug]/page.tsx", "utf8"),
      readFile("app/games/page.tsx", "utf8"),
      readFile("app/about/page.tsx", "utf8"),
      readFile("app/privacy/page.tsx", "utf8"),
      readFile("components/site-footer.tsx", "utf8"),
      readFile("components/game-card.tsx", "utf8"),
      readFile("components/game-page-intro.tsx", "utf8"),
      readFile("components/ad-slot.tsx", "utf8"),
    ]);
    const playerSurface = [
      content,
      homePage,
      gamePage,
      gamesPage,
      aboutPage,
      privacyPage,
      footer,
      gameCard,
      gameIntro,
      adSlot,
    ].join("\n");

    for (const phrase of bannedPlayerCopy) {
      expect(playerSurface).not.toMatch(phrase);
    }
  });

  it("does not render unsupported popularity claims on game cards", async () => {
    const gameCard = await readFile("components/game-card.tsx", "utf8");

    expect(gameCard).not.toMatch(/Popularity|Hot score/i);
  });

  it("shows the configured support email on the about page", async () => {
    const aboutPage = await readFile("app/about/page.tsx", "utf8");

    expect(aboutPage).toContain("{content.site.supportEmail}");
  });
});
