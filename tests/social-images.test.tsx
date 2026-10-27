import { describe, expect, it } from "vitest";

import {
  alt as rootImageAlt,
  contentType as rootImageContentType,
  default as rootOpenGraphImage,
  size as rootImageSize,
} from "@/app/opengraph-image";
import rootTwitterImage from "@/app/twitter-image";
import gameOpenGraphImage from "@/app/games/[slug]/opengraph-image";
import gameTwitterImage from "@/app/games/[slug]/twitter-image";
import { getGameSocialCardData } from "@/lib/social-image";
import { getSiteContent } from "@/lib/site-content";

describe("social image routes", () => {
  async function expectPngImage(
    responsePromise: Response | Promise<Response>,
  ) {
    const response = await responsePromise;
    const bytes = await response.arrayBuffer();
    const view = new DataView(bytes);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("image/png");
    expect(view.getUint32(16)).toBe(1200);
    expect(view.getUint32(20)).toBe(630);
  }

  it("publishes a 1200 by 630 PNG site fallback with useful alt text", () => {
    expect(rootImageSize).toEqual({ width: 1200, height: 630 });
    expect(rootImageContentType).toBe("image/png");
    expect(rootImageAlt).toBe(
      "TurboArcade free browser games for quick breaks",
    );
  });

  it("derives distinct social card data for different games", async () => {
    const content = await getSiteContent();
    const signalSweep = getGameSocialCardData(content, "signal-sweep");
    const patrolEscape = getGameSocialCardData(content, "patrol-escape");

    expect(signalSweep).toMatchObject({
      title: "Signal Sweep",
      eyebrow: "BRAIN GAME",
    });
    expect(patrolEscape).toMatchObject({
      title: "Patrol Escape",
      eyebrow: "BRAIN GAME",
    });
    expect(signalSweep.description).not.toBe("");
    expect(patrolEscape.description).not.toBe("");
    expect(signalSweep.palette).not.toEqual(patrolEscape.palette);
  });

  it("uses a safe branded fallback for an unknown game slug", async () => {
    const content = await getSiteContent();

    expect(getGameSocialCardData(content, "missing-game")).toMatchObject({
      title: "TurboArcade",
      eyebrow: "FREE BROWSER GAMES",
    });
  });

  it("renders working root Open Graph and Twitter PNG responses", async () => {
    await expectPngImage(rootOpenGraphImage());
    await expectPngImage(rootTwitterImage());
  });

  it("renders a working Open Graph image for every live game", async () => {
    const content = await getSiteContent();
    const liveGames = content.games.filter((game) => game.status === "live");

    for (const game of liveGames) {
      await expectPngImage(
        gameOpenGraphImage({
          params: Promise.resolve({ slug: game.slug }),
        }),
      );
    }
  }, 30_000);

  it("renders a working Twitter image for a game route", async () => {
    await expectPngImage(
      gameTwitterImage({
        params: Promise.resolve({ slug: "patrol-escape" }),
      }),
    );
  });
});
