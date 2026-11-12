# 2048 Corner Strategy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four real, actionable 2048 board examples to the existing corner strategy guide.

**Architecture:** Extend the current development-only screenshot presets in the playable 2048 component, capture those states through the existing browser workflow, and attach the optimized WebP files to the guide data. The generic guide page continues to render guide sections and galleries.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Testing Library, Playwright CLI, Sharp.

**Spec:** `docs/superpowers/specs/2026-11-12-2048-corner-strategy-design.md`

## Global Constraints

- Use only screenshots captured from the real TurboArcade 2048 component.
- Keep screenshot query presets development-only.
- Do not duplicate the general rules already covered on the game page.
- Each position must identify a next move and a concrete mistake to avoid.

## Review Focus

- Capture presets must not affect normal or production gameplay.
- Board arrays must contain exactly sixteen cells and remain visually readable.
- Guide images must have useful alt text and captions.
- Mobile rendering must not introduce horizontal overflow.
- Screenshot files must remain optimized WebP assets.

### Task 1: Define guide and capture expectations

**Files:**
- Modify: `tests/guides.test.tsx`
- Modify: `tests/game-screenshot-system.test.tsx`

- [ ] Add failing assertions for four practical 2048 positions, guide-specific gallery labeling, image metadata, and deterministic capture states.
- [ ] Run the focused tests and confirm they fail because the new presets and content do not exist.

### Task 2: Add deterministic 2048 board presets

**Files:**
- Modify: `components/games/tile-merge-2048-game.tsx`

- [ ] Add anchored-corner, broken-order, corner-recovery, and open-space presets.
- [ ] Run the focused screenshot tests and confirm the preset assertions pass.

### Task 3: Capture and register real screenshots

**Files:**
- Create: `public/images/gameplay/2048/desktop-corner-anchor.webp`
- Create: `public/images/gameplay/2048/desktop-broken-order.webp`
- Create: `public/images/gameplay/2048/desktop-corner-recovery.webp`
- Create: `public/images/gameplay/2048/desktop-open-space.webp`
- Modify: `data/game-screenshots.ts`

- [ ] Capture the four component states in a real browser.
- [ ] Optimize the PNG captures to WebP.
- [ ] Register descriptive metadata and verify file size limits.

### Task 4: Rewrite the guide around real positions

**Files:**
- Modify: `data/guides.ts`
- Modify: `app/guides/[slug]/page.tsx`

- [ ] Attach the four screenshots to the guide.
- [ ] Rewrite sections around fixed-corner control, a broken layout, recovery, and empty-space preservation.
- [ ] Make the gallery accessible label guide-specific.
- [ ] Run guide and screenshot tests.

### Task 5: Verify the finished change

- [ ] Run the full test suite.
- [ ] Run lint and the production build.
- [ ] Inspect the guide at desktop and mobile widths.
- [ ] Run `git diff --check` and review the final status.
