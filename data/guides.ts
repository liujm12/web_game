export type GameGuide = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  readTime: string;
  updatedAt: string;
  relatedGameSlugs: string[];
  sections: {
    heading: string;
    paragraphs: string[];
    tips?: string[];
  }[];
};

export const guides: GameGuide[] = [
  {
    slug: "2048-corner-strategy",
    title: "2048 Corner Strategy",
    eyebrow: "Board control",
    summary:
      "A practical plan for keeping your largest tile anchored, preserving empty cells, and recovering before the board locks up.",
    readTime: "6 min read",
    updatedAt: "October 21, 2026",
    relatedGameSlugs: ["2048", "merge-shot-2048"],
    sections: [
      {
        heading: "Choose one home corner",
        paragraphs: [
          "The easiest way to make a 2048 board predictable is to choose one corner for the largest tile and treat that corner as permanent. Bottom-left and bottom-right both work. The exact choice matters less than consistency. Once the large tile leaves its home, smaller tiles can slide underneath it and break the descending order that makes future merges easy.",
          "Build a row that decreases as it moves away from the corner: for example 256, 128, 64, 32. That order gives every new tile a natural destination. It also reduces the number of emergency moves because matching values are already close to each other instead of scattered across four rows.",
        ],
        tips: [
          "Avoid the direction that pulls your anchor out of its corner.",
          "Use the two directions that push toward the anchor most often.",
          "Check the whole anchor row before making a move that fills its last gap.",
        ],
      },
      {
        heading: "Protect empty space",
        paragraphs: [
          "A high tile is useful, but open cells are what keep a run alive. Every move should be judged by two questions: will it create a merge, and will it leave room for the next random tile? A move that gains four points but fills the final open cell is usually worse than a quiet move that keeps two escape routes available.",
          "When the board starts to crowd, stop chasing the biggest visible merge. Look for chains instead. Combining two small pairs can open two cells and create a larger pair for the next turn. This is especially important on Normal and Hard, where an awkward spawn can punish a board with only one empty cell.",
        ],
        tips: [
          "Try to keep at least two cells open.",
          "Prefer moves that create more than one merge.",
          "Do not trap a 2 or 4 between two large tiles that cannot combine.",
        ],
      },
      {
        heading: "Recover without abandoning the plan",
        paragraphs: [
          "Eventually a new tile will force a move away from your preferred rhythm. Recovery is not about restoring a perfect board in one turn. First reopen a lane, then rebuild the descending row. If the corner tile must move, use the next move to push it back before another tile spawns into the exposed corner.",
          "Slow down when three rows are nearly full. Read each direction before pressing it and picture where the new gaps will appear. The strongest runs are not the ones with perfect luck; they are the ones that survive one bad spawn without turning the next five moves into random swipes.",
        ],
        tips: [
          "Repair the anchor row before chasing a new large merge.",
          "Use small merges to reopen a lane from the crowded side.",
          "Restart only when no legal merge or useful shift remains.",
        ],
      },
    ],
  },
  {
    slug: "snake-build-space-before-length",
    title: "Snake: Build Space Before Length",
    eyebrow: "Route planning",
    summary:
      "Learn how to turn early, keep a safe return lane, and grow without trapping the snake against its own body.",
    readTime: "5 min read",
    updatedAt: "October 21, 2026",
    relatedGameSlugs: ["snake", "meteor-sprint"],
    sections: [
      {
        heading: "Use the outside edge as a map",
        paragraphs: [
          "At the start of a Snake run, the board feels empty enough to cross in any direction. That freedom disappears quickly. A reliable opening is to travel near the outside edge and make long, predictable turns instead of cutting through the center after every fruit. The edge gives you a clear visual reference and leaves the middle available as an emergency lane.",
          "Do not hug the wall so tightly that the next fruit forces an instant reversal. Leave one row or column between the snake and the edge when possible. That buffer creates a turning lane and prevents the head from meeting the body after a sharp corner.",
        ],
        tips: [
          "Turn one cell earlier than feels necessary.",
          "Keep the center open during the first half of the run.",
          "Avoid entering a narrow corridor unless you can see the exit.",
        ],
      },
      {
        heading: "Plan the return trip before eating",
        paragraphs: [
          "Fruit is not automatically safe just because the head can reach it. Before committing, trace the route the snake will need after the body grows. A fruit beside a wall or inside a loop can be expensive because the new tail length closes the same path you used to enter.",
          "The safest fruit is one that lets you continue in a wide arc. If the direct route creates a pocket, circle around and approach from the other side. The extra travel costs no points and often saves the run. On higher speed settings, deciding the route early is more important than reacting after the head is already close.",
        ],
        tips: [
          "Look two turns beyond the fruit.",
          "Approach wall-side fruit parallel to the wall, not head-on.",
          "Use broad loops instead of repeated tight zigzags.",
        ],
      },
      {
        heading: "Control speed with simpler routes",
        paragraphs: [
          "Hard mode does not leave much time for correction, so reduce the number of decisions you need to make. Long horizontal passes with a single turn at each side are easier to maintain than improvising around the center. The pattern also spaces the body into parallel lanes instead of a tangled knot.",
          "When the board becomes crowded, follow the tail rather than the fruit. Moving toward spaces the tail is about to clear keeps a route open. The score grows more slowly for a few seconds, but the run stays alive long enough to create another safe approach.",
        ],
        tips: [
          "On fast speed, favor repeatable lane patterns.",
          "Follow the tail when no fruit route is clearly safe.",
          "Pause your score chase mentally after every major growth step and reassess space.",
        ],
      },
    ],
  },
  {
    slug: "breakout-paddle-control",
    title: "Breakout Paddle Control Guide",
    eyebrow: "Angle control",
    summary:
      "Turn the paddle from a last-second shield into an aiming tool and clear bricks with more deliberate rebounds.",
    readTime: "6 min read",
    updatedAt: "October 21, 2026",
    relatedGameSlugs: ["breakout-blitz", "target-blitz"],
    sections: [
      {
        heading: "Meet the ball instead of chasing it",
        paragraphs: [
          "Most missed balls begin with a late reaction. Watch the downward path while the ball is still near the bricks, estimate where it will cross the paddle line, and move into that lane early. Once the paddle is under the projected path, make small corrections rather than holding a direction until the ball arrives.",
          "This matters more as the ball speeds up. A long panic movement can carry the paddle past the landing point, especially on mobile where repeated taps are easier to control than one sustained guess. Treat the middle of the paddle as your safe default and move toward an edge only when you intentionally want a sharper return.",
        ],
        tips: [
          "Track the ball's direction before looking at the paddle.",
          "Move early, then correct in short steps.",
          "Use the center of the paddle when survival matters more than angle.",
        ],
      },
      {
        heading: "Aim with the contact point",
        paragraphs: [
          "The ball does not need to leave the paddle at the same angle every time. Contact near the left or right edge creates a stronger sideways path, while contact near the center produces a straighter return. Use an edge hit when you need to reach bricks trapped on one side, and use a center hit when the ball is already moving quickly and you need a predictable recovery.",
          "Do not force extreme angles on every bounce. A nearly horizontal ball takes longer to reach the bricks and creates difficult low rebounds. Alternate between controlled center hits and selective edge hits so the ball continues making vertical progress while still reaching new columns.",
        ],
        tips: [
          "Edge contact changes direction more aggressively.",
          "Center contact is safer when lives are low.",
          "Aim for open brick columns instead of following the ball blindly.",
        ],
      },
      {
        heading: "Clear a route above the wall",
        paragraphs: [
          "A strong Breakout run changes once the ball reaches the space above the remaining bricks. From there, repeated top-wall rebounds can remove several bricks before the ball returns to the paddle. Look for a thin column or side opening and use angled paddle contact to send the ball through it.",
          "When only a few bricks remain, stop sweeping the paddle from side to side. Identify the last occupied column and create a return angle that crosses it. The final brick often takes longer than the first thirty because safe survival and precise aiming become the same problem.",
        ],
        tips: [
          "Open one side channel before spreading damage everywhere.",
          "Once the ball is above the wall, prepare for a faster return path.",
          "For the last brick, prioritize angle over speed.",
        ],
      },
    ],
  },
  {
    slug: "number-rush-clean-rounds",
    title: "Number Rush: Faster Clean Rounds",
    eyebrow: "Visual scanning",
    summary:
      "Use a repeatable scan pattern, reduce wrong taps, and improve speed without turning each board into a guessing game.",
    readTime: "5 min read",
    updatedAt: "October 21, 2026",
    relatedGameSlugs: ["number-rush", "target-blitz", "sudoku-sprint"],
    sections: [
      {
        heading: "Map the first three numbers before tapping",
        paragraphs: [
          "The timer starts when the round begins, but the fastest approach is not to tap the first number immediately. Spend a brief moment locating 1, 2, and 3. That opening map prevents the common pause after the first tap, when the eyes have to search the entire board again under pressure.",
          "After tapping 1, move your eyes toward 2 before your finger leaves the screen or mouse button resets. This creates a continuous path through the board. The goal is not to memorize all nine positions at once; it is to stay one or two numbers ahead of the current tap.",
        ],
        tips: [
          "Find 1, 2, and 3 before the first tap.",
          "Keep your eyes ahead of your finger.",
          "Use peripheral vision to remember where later numbers appeared.",
        ],
      },
      {
        heading: "Scan in a fixed order",
        paragraphs: [
          "Random eye movement feels fast but often revisits the same cells. Choose a scan pattern: left to right across each row, or clockwise around the outside before checking the center. A fixed pattern makes it easier to know which cells you have already checked when the next number is not immediately visible.",
          "The three-by-three board is small enough that the pattern quickly becomes automatic. Once it does, your attention can shift from searching to planning the next movement. This is where clean rounds become faster without extra mistakes.",
        ],
        tips: [
          "Use the same scan direction every round.",
          "Check the center at a consistent point in the pattern.",
          "If a number is missed, restart the pattern instead of darting randomly.",
        ],
      },
      {
        heading: "Recover after a wrong tap",
        paragraphs: [
          "A mistake does not end the round, but frustration can add two or three more. When a wrong tap happens, stop for one beat and confirm the next required number shown above the board. Then resume the same scan pattern rather than tapping the nearest visible tile.",
          "Track two goals separately: fastest time and cleanest round. Trying to improve both every attempt makes progress hard to read. First complete several zero-mistake rounds, then push the time while keeping the same visual routine. A slower clean round provides a better foundation than a fast result built on guesses.",
        ],
        tips: [
          "Read the required number again after an error.",
          "Practice accuracy and speed in separate runs.",
          "Compare personal bests only when the mistake count is similar.",
        ],
      },
    ],
  },
];

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug) ?? null;
}
