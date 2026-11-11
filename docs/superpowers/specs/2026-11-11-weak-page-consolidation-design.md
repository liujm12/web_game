# Weak Page Consolidation Design

## Intent

Remove weak, overlapping game pages from TurboArcade's public editorial surface without deleting working game code. The public catalog should communicate a deliberate selection: eight core games, a secondary tested catalog, and no C-tier pages in discovery or search-facing outputs.

## Current finding

The November 10 audit identifies three C-tier games:

- Orbit Hopper duplicates the three-lane loop already represented by Meteor Sprint.
- Neon Drift repeats the same lane-switching and collect-or-dodge decisions.
- Signal Sweep duplicates Pattern Pulse while its written advice does not match its implementation.

All three are already marked `draft`, but Orbit Hopper and Neon Drift still carry `featured: true`, and the code has no explicit editorial tier that prevents future accidental promotion.

## Approaches considered

### Delete the pages and implementations

This fully removes the risk but discards playable code and makes future rebuilding harder. It is unnecessarily destructive.

### Keep the pages live but reduce links or add noindex

This leaves weak public experiences accessible and creates two sources of truth between page status and search directives. It does not satisfy the goal of a cleaner public catalog.

### Keep the implementations as C-tier drafts and curate the public catalog

This is the selected approach. The three games remain editable in the repository and admin tools, but public helpers, discovery pages, recommendation areas, structured data, and the sitemap only consume live A/B games. Explicit editorial tiers prevent a C game from being treated as a homepage feature.

## Public catalog behavior

- A-tier contains the eight core games completed in Task 8.
- B-tier contains the remaining tested live games.
- C-tier contains Orbit Hopper, Neon Drift, and Signal Sweep, all with `status: draft` and `featured: false`.
- The homepage hero, queue, and featured cards use A-tier games only.
- All Games first presents A-tier editorial picks, then groups B-tier games into Arcade and Brain collections.
- Draft and C-tier games remain absent from category pages, recommendations, structured collections, and the sitemap.

## Non-goals

- Do not delete game components or routes.
- Do not rebuild C-tier mechanics during this task.
- Do not hide tested B-tier games from players.
- Do not change published URLs for A/B games.

## Acceptance evidence

- Tests assert all three C games are draft, unfeatured, and explicitly C-tier.
- Tests assert every live game is A or B tier.
- Homepage tests assert only A-tier games appear in editorial recommendation shelves.
- All Games tests assert curated A and grouped B sections while C titles are absent.
- Sitemap tests assert C-tier URLs are not emitted.

