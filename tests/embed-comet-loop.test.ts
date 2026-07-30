import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("Comet Loop embed layout", () => {
  it("places Shoot and Restart controls after the game canvas", () => {
    const html = readFileSync(
      join(process.cwd(), "public/embed-games/comet-loop/index.html"),
      "utf8",
    );

    const canvasIndex = html.indexOf('<canvas id="game"');
    const controlsIndex = html.indexOf('<div class="controls"');
    const shootIndex = html.indexOf('id="shootButton"');
    const restartIndex = html.indexOf('id="startButton"');

    expect(canvasIndex).toBeGreaterThan(-1);
    expect(controlsIndex).toBeGreaterThan(canvasIndex);
    expect(shootIndex).toBeGreaterThan(canvasIndex);
    expect(restartIndex).toBeGreaterThan(canvasIndex);
  });
});
