import { describe, expect, it } from "vitest";

import nextConfig from "@/next.config";

describe("next dev host access", () => {
  it("allows local 127.0.0.1 access for dev assets", () => {
    expect(nextConfig.allowedDevOrigins).toContain("127.0.0.1");
  });
});
