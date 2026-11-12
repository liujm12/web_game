type GuideLinkTarget = {
  slug: string;
  title: string;
};

const guideLinkLabels: Record<string, string> = {
  "how-to-play-patrol-escape": "Learn the traffic puzzle rules",
  "patrol-escape-beginner-strategy": "Patrol Escape beginner strategy",
  "expert-traffic-puzzle-guide": "Expert traffic puzzle guide",
  "2048-corner-strategy": "2048 corner strategy",
  "recover-a-crowded-2048-board": "Recover a crowded 2048 board",
  "snake-build-space-before-length": "Build space before growing in Snake",
  "breakout-paddle-control": "Control the Breakout paddle",
  "number-rush-clean-rounds": "Play Number Rush without mistakes",
  "memory-mosaic-and-pattern-pulse-training": "Train memory and pattern recall",
};

export function getGuideLinkLabel(guide: GuideLinkTarget) {
  return guideLinkLabels[guide.slug] ?? guide.title;
}

