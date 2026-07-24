import { afterEach, describe, expect, it } from "vitest";

import { GET } from "@/app/ads.txt/route";

describe("ads.txt route", () => {
  const originalClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  afterEach(() => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT = originalClient;
  });

  it("returns a formatted ads.txt record for the configured AdSense client", async () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT = "ca-pub-1234567890123456";

    const response = await GET();
    const body = await response.text();

    expect(response.headers.get("content-type")).toContain("text/plain");
    expect(body).toContain(
      "google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0",
    );
  });

  it("returns setup instructions when no AdSense client is configured", async () => {
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT = "";

    const response = await GET();
    const body = await response.text();

    expect(body).toContain("Configure NEXT_PUBLIC_ADSENSE_CLIENT");
  });
});
