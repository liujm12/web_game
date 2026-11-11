export type ScreenshotGameSlug = "patrol-escape" | "2048" | "snake";
export type ScreenshotState = "start" | "progress" | "success" | "failure" | "master";
export type ScreenshotDevice = "Desktop" | "Mobile";

export type GameplayScreenshot = {
  gameSlug: ScreenshotGameSlug;
  state: ScreenshotState;
  device: ScreenshotDevice;
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

export const gameScreenshotSets: Record<ScreenshotGameSlug, GameplayScreenshot[]> = {
  "patrol-escape": [
    {
      gameSlug: "patrol-escape",
      state: "start",
      device: "Desktop",
      src: "/images/gameplay/patrol-escape/desktop-level-1-start.webp",
      alt: "Patrol Escape level 1 starting layout on desktop with the police cruiser blocked from the right-side exit",
      caption: "Captured from the playable game on desktop. Level 1 begins with the police cruiser on the exit row and the blue gate van blocking its route.",
      width: 809,
      height: 953,
    },
    {
      gameSlug: "patrol-escape",
      state: "progress",
      device: "Desktop",
      src: "/images/gameplay/patrol-escape/desktop-level-1-exit-row-progress.webp",
      alt: "Patrol Escape level 1 in progress on desktop after moving the gate van and police cruiser toward the exit",
      caption: "Captured from the playable game on desktop. One vertical grid step and two horizontal grid steps open the exit row without completing the level.",
      width: 809,
      height: 953,
    },
    {
      gameSlug: "patrol-escape",
      state: "success",
      device: "Desktop",
      src: "/images/gameplay/patrol-escape/desktop-level-1-cleared.webp",
      alt: "Patrol Escape level 1 success state on desktop showing the cleared exit and completed puzzle result",
      caption: "Captured from the playable game on desktop. The cruiser has cleared the right-side exit and the real completion panel records the solved board.",
      width: 809,
      height: 953,
    },
    {
      gameSlug: "patrol-escape",
      state: "failure",
      device: "Desktop",
      src: "/images/gameplay/patrol-escape/desktop-level-101-recovery.webp",
      alt: "Patrol Escape level 101 recovery state on desktop after two setup moves with Undo and Restart available",
      caption: "Captured from the playable game on desktop. Patrol Escape has no artificial game-over screen, so this genuine Master-board recovery state shows when Undo or Restart is needed.",
      width: 809,
      height: 989,
    },
    {
      gameSlug: "patrol-escape",
      state: "master",
      device: "Desktop",
      src: "/images/gameplay/patrol-escape/desktop-level-119-master-layout.webp",
      alt: "Patrol Escape level 119 Master layout on desktop with a dense multi-vehicle blocking chain around the police cruiser",
      caption: "Captured from the playable game on desktop. Level 119 demonstrates the denser vehicle count and layered dependencies used in the final Master set.",
      width: 809,
      height: 989,
    },
    {
      gameSlug: "patrol-escape",
      state: "start",
      device: "Mobile",
      src: "/images/gameplay/patrol-escape/mobile-level-1-start.webp",
      alt: "Patrol Escape level 1 starting board in the real mobile layout with touch controls below the six-by-six grid",
      caption: "Captured from the playable game at mobile width. The same Level 1 board remains readable while movement, hint, and level controls reflow for touch.",
      width: 344,
      height: 746,
    },
    {
      gameSlug: "patrol-escape",
      state: "progress",
      device: "Mobile",
      src: "/images/gameplay/patrol-escape/mobile-level-1-progress.webp",
      alt: "Patrol Escape level 1 mobile gameplay after opening the exit row and moving the police cruiser two cells right",
      caption: "Captured from the playable game at mobile width. The progress state proves the touch layout uses the same live board logic as desktop rather than a separate mockup.",
      width: 344,
      height: 770,
    },
    {
      gameSlug: "patrol-escape",
      state: "success",
      device: "Mobile",
      src: "/images/gameplay/patrol-escape/mobile-level-1-cleared.webp",
      alt: "Patrol Escape level 1 cleared on mobile with the solved board and completion controls visible below the grid",
      caption: "Captured from the playable game at mobile width. The solved state, recorded move count, and next-level action remain usable on a narrow screen.",
      width: 344,
      height: 770,
    },
  ],
  "2048": [
    {
      gameSlug: "2048",
      state: "start",
      device: "Desktop",
      src: "/images/gameplay/2048/desktop-start-board.webp",
      alt: "TurboArcade 2048 desktop start state with an empty four-by-four board and the Start 2048 action centered over it",
      caption: "Captured from the playable game on desktop. The start overlay explains the goal before a seeded board is created.",
      width: 809,
      height: 1077,
    },
    {
      gameSlug: "2048",
      state: "progress",
      device: "Desktop",
      src: "/images/gameplay/2048/desktop-progress-score-684.webp",
      alt: "TurboArcade 2048 desktop game in progress with score 684 and several merged tiles arranged across the board",
      caption: "Captured from the playable game on desktop. This reproducible mid-run board shows open cells, merged values, score, and all four movement controls.",
      width: 809,
      height: 1077,
    },
    {
      gameSlug: "2048",
      state: "success",
      device: "Desktop",
      src: "/images/gameplay/2048/desktop-2048-reached.webp",
      alt: "TurboArcade 2048 desktop success state with a 2048 tile and the 2048 reached completion panel over the board",
      caption: "Captured from the playable game on desktop. The real win state appears when the board contains a 2048 tile and offers continued play.",
      width: 809,
      height: 1077,
    },
    {
      gameSlug: "2048",
      state: "failure",
      device: "Desktop",
      src: "/images/gameplay/2048/desktop-no-moves-left.webp",
      alt: "TurboArcade 2048 desktop failure state with a full checkerboard and the No moves left panel displayed",
      caption: "Captured from the playable game on desktop. The full board has no adjacent equal tiles, so the game correctly reports that no legal slide remains.",
      width: 809,
      height: 1077,
    },
    {
      gameSlug: "2048",
      state: "progress",
      device: "Mobile",
      src: "/images/gameplay/2048/mobile-progress-score-684.webp",
      alt: "TurboArcade 2048 mobile game in progress with score 684, readable tiles, and thumb-sized direction controls",
      caption: "Captured from the playable game at mobile width. Tiles and directional controls resize without changing the live mid-run board.",
      width: 344,
      height: 624,
    },
    {
      gameSlug: "2048",
      state: "failure",
      device: "Mobile",
      src: "/images/gameplay/2048/mobile-no-moves-left.webp",
      alt: "TurboArcade 2048 mobile failure state showing a full board, No moves left message, and Play again button",
      caption: "Captured from the playable game at mobile width. The failure explanation and restart action remain visible without horizontal scrolling.",
      width: 344,
      height: 624,
    },
  ],
  snake: [
    {
      gameSlug: "snake",
      state: "start",
      device: "Desktop",
      src: "/images/gameplay/snake/desktop-start-board.webp",
      alt: "TurboArcade Snake desktop start state with the initial three-cell snake, orange fruit, and Start snake overlay",
      caption: "Captured from the playable game on desktop. The initial board, speed selector, and start action are shown before movement begins.",
      width: 809,
      height: 1022,
    },
    {
      gameSlug: "snake",
      state: "progress",
      device: "Desktop",
      src: "/images/gameplay/snake/desktop-progress-score-30.webp",
      alt: "TurboArcade Snake desktop run in progress with a longer green snake, score 30, and orange fruit ahead",
      caption: "Captured from the playable game on desktop. The stable score-30 state demonstrates growth, fruit placement, and the active board without a decorative mockup.",
      width: 809,
      height: 1022,
    },
    {
      gameSlug: "snake",
      state: "success",
      device: "Desktop",
      src: "/images/gameplay/snake/desktop-long-run-score-70.webp",
      alt: "TurboArcade Snake desktop long-run state with a ten-cell snake and score 70 after collecting seven fruits",
      caption: "Captured from the playable game on desktop. Snake has no fixed final victory, so a verified score-70 long run serves as the successful play state.",
      width: 809,
      height: 1022,
    },
    {
      gameSlug: "snake",
      state: "failure",
      device: "Desktop",
      src: "/images/gameplay/snake/desktop-game-over-score-40.webp",
      alt: "TurboArcade Snake desktop failure state showing Game over, a 40-point result, and the Play again action",
      caption: "Captured from the playable game on desktop. The crash result preserves the final score and makes the restart path explicit.",
      width: 809,
      height: 1022,
    },
    {
      gameSlug: "snake",
      state: "progress",
      device: "Mobile",
      src: "/images/gameplay/snake/mobile-progress-score-30.webp",
      alt: "TurboArcade Snake mobile run in progress with score 30 and a compact twelve-by-twelve touch board",
      caption: "Captured from the playable game at mobile width. The twelve-column board and four direction buttons remain usable within the narrow layout.",
      width: 344,
      height: 625,
    },
    {
      gameSlug: "snake",
      state: "failure",
      device: "Mobile",
      src: "/images/gameplay/snake/mobile-game-over-score-40.webp",
      alt: "TurboArcade Snake mobile Game over state with a 40-point result and touch-friendly Play again button",
      caption: "Captured from the playable game at mobile width. The real failure overlay and restart control remain legible over the compact board.",
      width: 344,
      height: 605,
    },
  ],
};

export function getGameScreenshots(slug: string) {
  if (slug !== "patrol-escape" && slug !== "2048" && slug !== "snake") return [];
  return gameScreenshotSets[slug];
}
