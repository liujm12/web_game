# 2048 Corner Strategy Enhancement Design

## Intent

Turn the existing 2048 corner guide from a theory-only article into a practical board-reading lesson. A reader should be able to compare four real TurboArcade board states, identify the useful or dangerous pattern, and choose the next move.

## Approach

Add four deterministic development-only capture presets to the existing playable 2048 component: anchored corner, broken ordering, corner recovery, and protected empty space. Capture the actual rendered board as optimized WebP images, then use those images in the guide with position-specific captions and instructions.

This reuses the real game and existing screenshot pipeline rather than drawing diagrams or using generated imagery. The guide remains distinct from general 2048 rules by focusing only on board shape, recovery, and space management.

## Content Requirements

- Show a bottom-left anchor with a descending edge row.
- Show a scattered board where the largest tile has lost its corner structure.
- Show a recoverable board where one left move returns the largest tile to its corner.
- Show a board with protected empty cells and explain why a small merge is less important than keeping room.
- Give a concrete next move, a reason, and a mistake to avoid for each position.
- Retain links to the playable 2048 game and related guide content.

## Technical Requirements

- Screenshots come from `TileMerge2048Game` capture presets.
- Store optimized files under `public/images/gameplay/2048/` as WebP.
- Give every image descriptive alt text and a position-specific caption.
- Render the guide image gallery with a guide-specific accessible label.
- Keep screenshot presets disabled in production.

## Validation

- Tests verify all four capture presets render stable, expected board states.
- Tests verify the guide has at least four real images and three practical positions.
- Tests verify image files exist, use WebP, and stay below the screenshot size budget.
- Full tests, lint, production build, desktop review, and mobile review must pass.
