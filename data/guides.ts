import { getGameScreenshots } from "@/data/game-screenshots";

export type GameGuide = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  readTime: string;
  updatedAt: string;
  relatedGameSlugs: string[];
  relatedGuideSlugs?: string[];
  sections: {
    heading: string;
    paragraphs: string[];
    tips?: string[];
  }[];
  images?: { src: string; alt: string; caption: string; width: number; height: number }[];
  relatedHub?: { href: string; label: string };
  caseStudies?: {
    levelId: number;
    difficulty: "Easy" | "Medium" | "Expert" | "Master";
    initialLayout: string;
    blockerRelationship: string;
    commonMistake: string;
    analysis: string;
    complexitySource?: string;
    solution: { vehicleId: string; delta: number; instruction: string }[];
  }[];
};

export const guides: GameGuide[] = [
  {
    slug: "how-to-play-patrol-escape",
    title: "How to Play Patrol Escape",
    eyebrow: "Traffic puzzle field guide",
    summary: "Learn the grid rules, read the blocked exit, and use undo, hints, and move targets to clear all 120 original Patrol Escape boards.",
    readTime: "8 min read",
    updatedAt: "November 11, 2026",
    relatedGameSlugs: ["patrol-escape"],
    relatedGuideSlugs: ["patrol-escape-beginner-strategy", "expert-traffic-puzzle-guide"],
    relatedHub: { href: "/traffic-puzzle-games", label: "Traffic Puzzle Games" },
    images: getGameScreenshots("patrol-escape").map(({ src, alt, caption, width, height }) => ({
      src,
      alt,
      caption,
      width,
      height,
    })),
    sections: [
      { heading: "1. Read the goal and the exit", paragraphs: ["Patrol Escape is played on a six-by-six grid. Your goal is to move the marked police cruiser through the opening on the right edge. The police car starts in the third row, so the route out is horizontal; there is no alternate exit or diagonal movement.", "Before touching a vehicle, trace the police car's row to the right border. Any occupied cell in that corridor is a blocker. Vehicles elsewhere matter only when they prevent you from moving a blocker into free space."], tips: ["Scan the escape row first.", "Mark which blockers need to move, then identify where each blocker can go."] },
      { heading: "2. Follow each vehicle's orientation", paragraphs: ["A horizontal car or truck moves left and right only. A vertical vehicle moves up and down only. Vehicles cannot turn, jump over another vehicle, or overlap; a move is legal only when every newly occupied grid cell is empty and still inside the board.", "A single drag may slide a vehicle several cells, but it counts as that many grid steps in the move total. The solver and hint system reason one cell at a time, so longer drags are convenient without hiding the underlying route."], tips: ["For horizontal traffic, drag sideways; for vertical traffic, drag up or down.", "On desktop, select a vehicle and use arrow keys in its allowed axis."] },
      { heading: "3. Work backward from the blockers", paragraphs: ["The common traffic-puzzle knot is a blocker that cannot move until a crossing vehicle shifts, while that crossing vehicle is trapped by a second row. Do not move every vehicle that looks movable. Find an empty destination long enough for the immediate blocker, then ask which crossing vehicle must move to create that space.", "On level 9, the blue vertical car crosses the police row. It must move along its column before the cruiser can pass; the red truck lower on the board is not in the exit lane and need not move just to clear the route. Solve the direct blocker before spending moves elsewhere."], tips: ["Create a parking space before trying to relocate a long vehicle.", "Move blockers only far enough to clear the escape row unless their new position unlocks another lane."] },
      { heading: "4. Use the controls as recovery tools", paragraphs: ["Undo restores the previous move, which is useful when a vehicle was dragged farther than intended. Restart resets the current layout without changing your selected level. Hint highlights a solver-found next move when a route exists from the current position.", "Choose level opens the level picker, grouped in ranges so you can revisit boards. Completed boards keep a local best move total. The three-star rating compares your grid-step count with that level's par: at or below par earns three stars, up to three steps above par earns two, and a larger count still earns one."], tips: ["Try a move before asking for a hint; compare the hint with your own blocker plan.", "Undo one step at a time to learn which move opened a route.", "Use Restart when the board is tangled beyond a useful recovery, not just after one mistake."] },
      { heading: "5. What changes across difficulty", paragraphs: ["The opening levels introduce short vehicles and a small number of blockers. Medium and Hard boards add crossing dependencies: a vehicle may need to move temporarily away from the exit so another can pass. Expert layouts make the free space itself scarce.", "The final twenty Master boards are intentionally dense. Each starts with at least eight blocking vehicles and has a solver-verified shortest route of at least twenty grid steps. Their challenge comes from sequencing moves and making temporary parking room, not from reflex speed." ] },
      { heading: "6. Three practical board reads", paragraphs: ["Example A — horizontal move on level 1: select the green two-cell car in the lower-left area and press Right once. It shifts one cell into open space without changing rows.", "Example B — vertical move on level 1: select the blue car crossing the police lane and press Up once. It shifts one grid cell in its column, exposing the police row. On desktop, select a vehicle with the mouse and use the matching arrow key; mouse dragging also works. On a phone, drag the vehicle along its permitted axis.", "Example C — clear level 1: after those two setup moves, select the police cruiser and press Right four times. The run finishes in six grid steps total and earns two stars against par five. The cleared-exit screenshot shows the real result; level 9's blocked-exit screenshot shows a denser version of the same rule."], tips: ["Each drag must respect the vehicle axis and board edge.", "Count grid cells, not pointer gestures, when tracking your best route."] },
      { heading: "How the 120 boards are checked", paragraphs: ["Patrol Escape uses layouts authored for TurboArcade rather than a random board shuffle. The included solver searches legal one-cell moves, rejects blocked or out-of-bounds moves, and confirms that each published layout can reach the exit. The final Master set is additionally checked for its stated minimum route length and blocker count.", "This verification catches impossible arrangements; it does not claim that every level has only one solution. The par value is a target for efficient play, while the best-move counter records your own result locally on your device."] },
    ],
  },
  {
    slug: "patrol-escape-beginner-strategy",
    title: "Patrol Escape Beginner Strategy",
    eyebrow: "Traffic puzzle decision guide",
    summary: "Learn a repeatable blocker-chain method, then apply it to real Easy, Medium, and Expert Patrol Escape boards with solver-verified routes.",
    readTime: "10 min read",
    updatedAt: "November 11, 2026",
    relatedGameSlugs: ["patrol-escape"],
    relatedGuideSlugs: ["how-to-play-patrol-escape", "expert-traffic-puzzle-guide"],
    relatedHub: { href: "/traffic-puzzle-games", label: "Traffic Puzzle Games" },
    sections: [
      {
        heading: "Start with the exit row, not the busiest area",
        paragraphs: [
          "Begin every board by tracing row three from the police cruiser to the cyan exit. A vehicle matters immediately only if it occupies one of those cells. This gives you a short list of direct blockers before the crowded parts of the board can distract you.",
          "Name the first occupied exit cell, then keep scanning right. Some boards have two direct blockers. The police car may also be able to advance partway before the lane is fully open; that can be efficient, but only when the new position does not remove parking space needed by another vehicle.",
        ],
        tips: ["Read the police row from left to right.", "Separate direct blockers from vehicles that merely look close to the exit."],
      },
      {
        heading: "Build the blocker chain one layer deeper",
        paragraphs: [
          "After finding a direct blocker, inspect the cells it must enter to leave the exit row. If any of those cells are occupied, the occupying vehicle is a second-layer blocker. Continue only until you find a vehicle with enough empty space to move; that is usually where the useful sequence begins.",
          "A vertical two-cell van crossing the exit row may need one or two clear cells above or below it. A three-cell truck often needs a full cell at the far end before it can shift even once. Count those destination cells exactly instead of assuming that a vehicle can move because one nearby square is empty.",
        ],
        tips: ["Direct blocker → required destination → second-layer blocker.", "Check the far end of a long truck, not only the cell beside its center."],
      },
      {
        heading: "Move only vehicles that belong to the chain",
        paragraphs: [
          "A legal move is not automatically a useful move. Sliding every available car creates more board states to remember and often consumes the space your blocker needs later. Before moving a vehicle, finish this sentence: moving it creates space for which blocker? If the answer is none, leave it alone.",
          "This rule is the fastest way to reduce invalid steps. Use the par target as feedback: if your route is several steps above par, look for a car you moved away and then restored without opening a required cell. Those round trips are usually the waste.",
        ],
        tips: ["Do not move decorative traffic outside the dependency chain.", "Prefer the smallest displacement that clears the required cell.", "Avoid moving a car out and back unless the temporary space is used."],
      },
      {
        heading: "Use Undo for one wrong assumption; restart after the plan collapses",
        paragraphs: [
          "Use Undo when the last move was based on a specific wrong assumption: you dragged one cell too far, chose the wrong direction, or occupied the parking cell needed by the next blocker. Undo preserves the useful part of your route and lets you test the corrected branch immediately.",
          "Restart when you can no longer explain the current blocker chain, when several unrelated vehicles have moved, or when recovering would require multiple reverse moves. A restart is not a penalty; it returns the original layout so you can reread the exit row and compare a cleaner plan against your previous attempt.",
        ],
        tips: ["Undo one local mistake.", "Restart after several speculative moves or when the original dependencies are no longer visible."],
      },
    ],
    caseStudies: [
      {
        levelId: 18,
        difficulty: "Easy",
        initialLayout: "The police cruiser begins on row three with the Rose right van occupying the exit lane at column five. The Amber roof car sits above the van's second destination cell.",
        blockerRelationship: "Rose right van is the direct blocker. Amber roof car is the second-layer blocker because the van must move up two cells, and the roof car occupies the upper cell needed for that second shift.",
        commonMistake: "Moving the Blue left van or Green floor car changes nothing in the exit chain. Moving the police car left is legal, but it adds a step that must be paid back later.",
        analysis: "Move the Rose van up once to expose the exact conflict. Shift the Amber roof car left one cell, then move the Rose van up again. The exit row is now clear and the cruiser needs only two rightward cells.",
        solution: [
          { vehicleId: "gate-right", delta: -1, instruction: "Move Rose right van up 1." },
          { vehicleId: "roof-car", delta: -1, instruction: "Move Amber roof car left 1." },
          { vehicleId: "gate-right", delta: -1, instruction: "Move Rose right van up 1 again." },
          { vehicleId: "police", delta: 2, instruction: "Move the police cruiser right 2 and exit." },
        ],
      },
      {
        levelId: 31,
        difficulty: "Medium",
        initialLayout: "The Blue gate truck stands vertically in column three across the police row. The Violet lower car occupies three cells on the bottom row, including the truck's required destination cell.",
        blockerRelationship: "Blue gate truck is the direct blocker. Violet lower car is the second-layer blocker at bottom-row column three. The Amber gate van is movable but unrelated to the shortest exit route.",
        commonMistake: "Moving the Violet car left keeps column three occupied. Moving the Blue truck up one cell also keeps part of the three-cell truck in the exit row, so neither move solves the dependency.",
        analysis: "The Blue truck needs one empty cell below it. Slide the Violet lower car two cells right to free bottom-row column three. The Blue truck can then move down one cell, completely clearing the police row.",
        solution: [
          { vehicleId: "lower-car", delta: 2, instruction: "Move Violet lower car right 2." },
          { vehicleId: "gate-a", delta: 1, instruction: "Move Blue gate truck down 1." },
          { vehicleId: "police", delta: 4, instruction: "Move the police cruiser right 4 and exit." },
        ],
      },
      {
        levelId: 94,
        difficulty: "Expert",
        initialLayout: "Two three-cell trucks cross the exit row: Blue at column three and Amber at column six. Green and Violet vehicles occupy the lower parking cells both trucks eventually need.",
        blockerRelationship: "Blue and Amber are direct blockers. Green blocks Blue's route to the bottom, while Violet blocks its final destination. After Blue clears, Green must return one cell left so Amber can descend through column six.",
        commonMistake: "The Rose van near the center is movable but never appears in the shortest route. Another common error is pushing Green right and forgetting that its far end then blocks Amber's downward path.",
        analysis: "This board needs staged parking. First create the bottom lane for Blue, clear Blue from the police row, and advance the cruiser only to column four. Then restore Blue upward, return Green one cell left, lower Amber into the freed column, and make the final police move.",
        solution: [
          { vehicleId: "gate-a", delta: 1, instruction: "Move Blue gate truck down 1." },
          { vehicleId: "gate-c", delta: 1, instruction: "Move Amber gate truck down 1." },
          { vehicleId: "floor-car", delta: 3, instruction: "Move Green floor truck right 3." },
          { vehicleId: "gate-a", delta: 1, instruction: "Move Blue gate truck down 1." },
          { vehicleId: "lower-car", delta: 1, instruction: "Move Violet lower car right 1." },
          { vehicleId: "gate-a", delta: 1, instruction: "Move Blue gate truck down 1 and clear the police row." },
          { vehicleId: "police", delta: 3, instruction: "Move the police cruiser right 3, stopping before Amber." },
          { vehicleId: "gate-a", delta: -2, instruction: "Move Blue gate truck up 2 to reopen lower parking space." },
          { vehicleId: "floor-car", delta: -1, instruction: "Move Green floor truck left 1." },
          { vehicleId: "gate-c", delta: 2, instruction: "Move Amber gate truck down 2 and clear the exit cell." },
          { vehicleId: "police", delta: 1, instruction: "Move the police cruiser right 1 and exit." },
        ],
      },
    ],
  },
  {
    slug: "expert-traffic-puzzle-guide",
    title: "Expert Traffic Puzzle Guide",
    eyebrow: "Master-level traffic analysis",
    summary: "Analyze 20-plus-step Patrol Escape boards through buffer management, reverse planning, temporary retreats, and three complete Master routes.",
    readTime: "14 min read",
    updatedAt: "November 11, 2026",
    relatedGameSlugs: ["patrol-escape"],
    relatedGuideSlugs: ["patrol-escape-beginner-strategy", "how-to-play-patrol-escape"],
    relatedHub: { href: "/traffic-puzzle-games", label: "Traffic Puzzle Games" },
    sections: [
      {
        heading: "A 20-step board is a space-management problem",
        paragraphs: [
          "On a Master board, the police cruiser may be only four cells from the exit, yet the shortest route can exceed twenty grid steps. The extra work comes from relocating the empty cells. A blocker cannot leave the police row until another vehicle vacates its destination, and that vehicle often needs a third vehicle to create a temporary parking lane.",
          "Count useful empty cells as resources. A two-cell gap may let a car move but still be too short for a three-cell truck to pass. The important question is not how many vehicles can move now; it is where the next required empty cell must appear and which current vehicle controls it.",
        ],
        tips: ["Track empty cells as carefully as vehicles.", "Measure the full length of every destination lane before committing a truck."],
      },
      {
        heading: "Reverse-analyze the exit into a dependency graph",
        paragraphs: [
          "Start at the right-side exit and work backward through the police row. For each direct blocker, write down the row or column it must enter. Then inspect the vehicle occupying that destination and repeat. This produces a dependency graph rather than a loose list of movable traffic.",
          "When two direct blockers need the same lower buffer, order matters. Clearing the first blocker can consume the exact cells required by the second. A strong plan therefore includes both the opening sequence and the restoration sequence: which temporary move must be reversed before the next blocker can pass.",
        ],
        tips: ["Mark every direct blocker before moving any of them.", "For shared buffers, plan who enters first and who must leave before the next descent."],
      },
      {
        heading: "Preserve a buffer instead of filling every opening",
        paragraphs: [
          "Master layouts are designed around scarce staging space. An empty row segment is a buffer: a place where a long vehicle can wait while another crosses behind it. Filling that segment with an unrelated car may be legal and visually tidy, but it can force several corrective moves later.",
          "Reserve at least one working buffer until all direct blockers have a route out of the police row. If the board has only one three-cell opening, treat it as shared infrastructure. Do not park there permanently until you know no remaining truck needs it.",
        ],
        tips: ["Keep one long-vehicle buffer available.", "A filled gap is not progress unless it completes a dependency."],
      },
      {
        heading: "The correct first move may point away from the exit",
        paragraphs: [
          "A vehicle sometimes moves in the apparently wrong direction because its current position divides the board into two unusable pockets. Moving it away can join those pockets into one buffer long enough for a truck. The vehicle may later return after the blocker has crossed.",
          "Judge a retreat by the cell it releases, not by its direction. In the Master examples below, the police cruiser itself moves left, direct blockers first move deeper into congestion, and floor trucks travel right before returning left. These are productive detours because another named vehicle immediately uses the released space.",
        ],
        tips: ["A backward move is useful when it creates a specifically required cell.", "Name the beneficiary before making a temporary retreat."],
      },
      {
        heading: "Separate a productive detour from wasted steps",
        paragraphs: [
          "A productive detour changes the dependency graph: it opens a destination, joins two empty regions, or lets a direct blocker leave the police row. A wasted move merely changes appearance. If no later vehicle uses the vacated cell before the car returns, the round trip probably added avoidable steps.",
          "Audit a long attempt in pairs. Whenever a vehicle moves out and later comes back, identify what passed through during that interval. If nothing did, remove the pair from your plan. If a blocker crossed or a buffer changed ownership, keep it. This is more reliable than copying the Hint button because it explains why the sequence works and transfers to a different board.",
        ],
        tips: ["For every out-and-back pair, identify the vehicle that used the temporary space.", "Use Undo for a detour with no beneficiary; restart when several such detours have accumulated."],
      },
    ],
    caseStudies: [
      {
        levelId: 101,
        difficulty: "Master",
        initialLayout: "Terminal Lock begins with three direct blockers in the police row: Rose center truck at column four, Amber north van at column five, and Green east truck at column six. The lower half is packed by Green roof, Violet gate, and Amber middle vehicles.",
        blockerRelationship: "The Rose, Amber, and Green vertical vehicles all need lower or upper buffer cells. Blue floor truck blocks Rose's upper route, Green roof car blocks the eastern descent, and Violet gate van occupies the central staging column. The police cruiser must briefly move left so Violet can rise through column three.",
        commonMistake: "Trying to push each direct blocker down immediately consumes the lower buffer before the next truck can use it. Moving the Slate west car is also tempting, but it never appears in the par route and does not release an exit dependency.",
        analysis: "First build the west-side buffer by moving Blue tower and Amber middle. Retreat the police cruiser one cell to release Violet's column, then rearrange Blue floor, Rose, Green roof, Amber north, and Green east in a controlled rotation. The final restoration of Blue tower and Amber middle reopens the route for Rose to descend and the cruiser to leave.",
        complexitySource: "The 27 steps come from three direct blockers sharing two staging zones, plus five necessary restoration steps. Rose and Violet must change vertical positions more than once, and Green roof travels three cells to transfer the eastern buffer.",
        solution: [
          { vehicleId: "a-v1", delta: 1, instruction: "Move Blue tower truck down 1." },
          { vehicleId: "a-h3", delta: 1, instruction: "Move Amber middle truck right 1." },
          { vehicleId: "a-v1", delta: 1, instruction: "Move Blue tower truck down 1 again." },
          { vehicleId: "police", delta: -1, instruction: "Move the police cruiser left 1 to release column three." },
          { vehicleId: "a-v4", delta: -1, instruction: "Move Violet gate van up 1." },
          { vehicleId: "a-v5", delta: 1, instruction: "Move Green east truck down 1." },
          { vehicleId: "a-h4", delta: -1, instruction: "Move Blue floor truck left 1." },
          { vehicleId: "a-v3", delta: -1, instruction: "Move Rose center truck up 1." },
          { vehicleId: "a-h1", delta: -2, instruction: "Move Green roof car left 2." },
          { vehicleId: "a-v2", delta: 1, instruction: "Move Amber north van down 1." },
          { vehicleId: "a-h1", delta: -1, instruction: "Move Green roof car left 1 again." },
          { vehicleId: "a-v3", delta: 1, instruction: "Move Rose center truck down 1." },
          { vehicleId: "a-v5", delta: 2, instruction: "Move Green east truck down 2." },
          { vehicleId: "a-h4", delta: 3, instruction: "Move Blue floor truck right 3." },
          { vehicleId: "a-v4", delta: -2, instruction: "Move Violet gate van up 2." },
          { vehicleId: "police", delta: 1, instruction: "Return the police cruiser right 1." },
          { vehicleId: "a-v1", delta: -1, instruction: "Move Blue tower truck up 1." },
          { vehicleId: "a-h3", delta: -1, instruction: "Move Amber middle truck left 1." },
          { vehicleId: "a-v3", delta: 1, instruction: "Move Rose center truck down 1 and clear the row." },
          { vehicleId: "police", delta: 3, instruction: "Move the police cruiser right 3 and exit." },
        ],
      },
      {
        levelId: 102,
        difficulty: "Master",
        initialLayout: "Midnight Grid places Green east truck and Blue tower truck side by side in columns five and six across the exit row. Slate west and Amber middle vehicles seal much of the lower-right buffer.",
        blockerRelationship: "Blue can descend one cell, but its second destination is held by Amber middle. Green cannot descend until both Slate and Amber middle shift. On the left, Rose center and Amber north control the only space that allows the police cruiser and Violet gate van to reposition.",
        commonMistake: "Driving the police cruiser right attacks the visible exit but leaves both direct blockers untouched. Dropping Blue repeatedly also fails because Amber middle still owns bottom-row column six. Every useful early move must enlarge a buffer, not merely approach the exit.",
        analysis: "Open the left half first: lower Amber north, slide Green roof right, then move Rose down after the police cruiser retreats. Use that space to lift Violet and shift the lower cars. Only then can Amber middle move left far enough for Blue and Green to descend in sequence. The police cruiser exits only after both columns are cleared.",
        complexitySource: "The 32-step par includes two police retreat steps, four Amber-north steps, four Violet steps, and repeated transfers of the lower buffer between Green roof, Slate west, and Amber middle. The direct blockers account for only five of the thirty-two cells moved.",
        solution: [
          { vehicleId: "a-v1", delta: 1, instruction: "Move Blue tower truck down 1." },
          { vehicleId: "a-v2", delta: 1, instruction: "Move Amber north van down 1." },
          { vehicleId: "a-h1", delta: 2, instruction: "Move Green roof car right 2." },
          { vehicleId: "a-v2", delta: 2, instruction: "Move Amber north van down 2." },
          { vehicleId: "police", delta: -1, instruction: "Move the police cruiser left 1." },
          { vehicleId: "a-v3", delta: 3, instruction: "Move Rose center truck down 3." },
          { vehicleId: "police", delta: -1, instruction: "Move the police cruiser left 1 again." },
          { vehicleId: "a-h4", delta: -1, instruction: "Move Blue floor truck left 1." },
          { vehicleId: "a-v5", delta: -1, instruction: "Move Green east truck up 1 temporarily." },
          { vehicleId: "a-h1", delta: 1, instruction: "Move Green roof car right 1." },
          { vehicleId: "a-v4", delta: -3, instruction: "Move Violet gate van up 3." },
          { vehicleId: "a-h1", delta: -1, instruction: "Move Green roof car left 1." },
          { vehicleId: "a-h2", delta: -1, instruction: "Move Slate west car left 1." },
          { vehicleId: "a-h3", delta: -1, instruction: "Move Amber middle truck left 1." },
          { vehicleId: "a-v1", delta: 1, instruction: "Move Blue tower truck down 1." },
          { vehicleId: "a-h3", delta: -1, instruction: "Move Amber middle truck left 1 again." },
          { vehicleId: "a-v5", delta: 3, instruction: "Move Green east truck down 3 and clear column five." },
          { vehicleId: "a-h4", delta: 2, instruction: "Move Blue floor truck right 2." },
          { vehicleId: "a-v4", delta: -1, instruction: "Move Violet gate van up 1." },
          { vehicleId: "police", delta: 4, instruction: "Move the police cruiser right 4 and exit." },
        ],
      },
      {
        levelId: 119,
        difficulty: "Master",
        initialLayout: "Final Roadblock starts with Blue tower, Rose center, and Green east trucks occupying columns four, five, and six of the exit row. Blue floor truck spans the central buffer directly below them.",
        blockerRelationship: "The three direct blockers cannot descend together because Blue floor truck controls row four. Amber north and Violet gate control the floor truck's leftward parking space, while Slate west blocks Rose's final cell at the bottom of column five.",
        commonMistake: "Moving Rose down first stops at the occupied bottom cell. Moving Green east down uses the same central region Blue floor must cross. The board is solved by reserving row four as a shared corridor, not by clearing the blockers in visual order.",
        analysis: "Advance the police cruiser one cell, then create upper buffers by shifting Green roof, Amber middle, Blue tower, and Green east away from their eventual directions. Move Blue floor right while Amber north rises, clear the bottom with Slate and Violet, then walk Blue floor back left as Green, Rose, and Blue descend one after another.",
        complexitySource: "The 32-step route contains six cells of deliberate wrong-way movement and six cells of Blue-floor shuttling. Those twelve steps are not waste: they transfer the same row-four buffer among three direct blockers before the final three-cell police exit.",
        solution: [
          { vehicleId: "police", delta: 1, instruction: "Move the police cruiser right 1." },
          { vehicleId: "a-h1", delta: 1, instruction: "Move Green roof car right 1." },
          { vehicleId: "a-h3", delta: -1, instruction: "Move Amber middle truck left 1." },
          { vehicleId: "a-v1", delta: -1, instruction: "Move Blue tower truck up 1 temporarily." },
          { vehicleId: "a-v5", delta: -2, instruction: "Move Green east truck up 2 temporarily." },
          { vehicleId: "a-h4", delta: 1, instruction: "Move Blue floor truck right 1." },
          { vehicleId: "a-v2", delta: -3, instruction: "Move Amber north van up 3." },
          { vehicleId: "a-h4", delta: 2, instruction: "Move Blue floor truck right 2." },
          { vehicleId: "a-v4", delta: -1, instruction: "Move Violet gate van up 1." },
          { vehicleId: "a-h2", delta: -3, instruction: "Move Slate west car left 3." },
          { vehicleId: "a-v4", delta: 1, instruction: "Return Violet gate van down 1." },
          { vehicleId: "a-h4", delta: -1, instruction: "Move Blue floor truck left 1." },
          { vehicleId: "a-v5", delta: 3, instruction: "Move Green east truck down 3 and clear column six." },
          { vehicleId: "a-h4", delta: -1, instruction: "Move Blue floor truck left 1 again." },
          { vehicleId: "a-v3", delta: 3, instruction: "Move Rose center truck down 3 and clear column five." },
          { vehicleId: "a-h4", delta: -1, instruction: "Move Blue floor truck left 1 again." },
          { vehicleId: "a-v1", delta: 3, instruction: "Move Blue tower truck down 3 and clear column four." },
          { vehicleId: "police", delta: 3, instruction: "Move the police cruiser right 3 and exit." },
        ],
      },
    ],
  },
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
