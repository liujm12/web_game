import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("TurboArcade brand background", () => {
  it("avoids generic two-axis grid backgrounds", () => {
    const css = readFileSync(join(process.cwd(), "app", "globals.css"), "utf8");

    expect(css).not.toContain("linear-gradient(rgba(125, 211, 252, 0.045) 1px");
    expect(css).not.toContain("background-size: 54px 54px");
    expect(css).toContain("scanline");
  });
});
