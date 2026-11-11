# Core Game Pages Design

## Intent

Upgrade the eight A-tier games into independently useful landing pages that document the real build, give game-specific advice, link to supporting material, and show evidence captured from the playable implementation.

## Scope

- Patrol Escape, Merge Shot 2048, Number Rush, Target Blitz, Memory Mosaic, Pattern Pulse, 2048, and Snake.
- Preserve the existing shared game-page layout and playable components.
- Add explicit related-center metadata, complete editorial fields, current playtest dates, and supporting guide relationships.
- Expand the real screenshot system to all eight games; new screenshots must come from deterministic development-only states in the actual components.

## Approach

Use one shared page renderer with richer per-game records rather than creating eight separate page components. This keeps layout and mobile behavior consistent while the descriptions, instructions, strategy, mistakes, FAQ, device notes, guides, hubs, and screenshots remain specific to each game. A new memory-training guide can serve Memory Mosaic and Pattern Pulse because it compares two distinct memory skills instead of duplicating two thin articles.

## Constraints

- Screenshot presets remain disabled in production.
- Images use optimized WebP files, meaningful filenames, alt text, and captions.
- Existing Task 7 changes remain intact.
- No new runtime dependency.
- Category pages serve as the center page for the non-traffic games; Patrol Escape keeps the dedicated traffic-puzzle hub.

## Success Criteria

Each A-tier page renders distinct editorial content, at least one related guide, a relevant center-page link, current tested-device information, a real review date, and a real-play screenshot gallery on desktop and mobile.
