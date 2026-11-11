# Core Game Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the eight A-tier game pages with specific editorial content, guide and hub links, current playtest evidence, and real screenshots.

**Architecture:** Extend the existing `GameRecord` content contract and shared game page. Keep screenshots in the existing typed registry and expose deterministic development-only capture states from each playable component.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Vitest, Playwright CLI, Sharp.

**Spec:** `docs/superpowers/specs/2026-11-11-core-game-pages-design.md`

## Global Constraints

- Preserve existing public URLs and the current game implementations.
- Do not expose screenshot presets in production.
- Use only real rendered game states for evidence images.
- Keep every new image below the repository screenshot size limits.

## Review Focus

- Advice must match the exact mechanics of each playable component.
- Mobile and desktop controls must not claim unsupported interactions.
- Every core page must have at least one genuine related guide and center page.
- Screenshot states must remain deterministic and production-safe.
- Galleries must not materially slow mobile rendering.

### Task 1: Define core-page acceptance tests

**Files:**
- Modify: `tests/game-content-quality.test.ts`
- Modify: `tests/game-screenshot-system.test.tsx`

- [ ] Add failing tests for the eight complete editorial records.
- [ ] Add failing tests for related guides, center links, and current dates.
- [ ] Add failing tests for eight screenshot sets and deterministic states.
- [ ] Run the focused tests and confirm the expected failures.

### Task 2: Complete editorial data and navigation

**Files:**
- Modify: `lib/site-content.ts`
- Modify: `data/site-content.json`
- Modify: `data/guides.ts`
- Modify: `app/games/[slug]/page.tsx`

- [ ] Add related-center metadata to the game content contract.
- [ ] Complete and fact-check all eight game records.
- [ ] Add the Memory Mosaic and Pattern Pulse supporting guide.
- [ ] Render guide and center links from data rather than slug-specific markup.
- [ ] Run content and page tests.

### Task 3: Add deterministic screenshot states

**Files:**
- Modify: `components/games/merge-shot-2048-game.tsx`
- Modify: `components/games/number-rush-game.tsx`
- Modify: `components/games/target-blitz-game.tsx`
- Modify: `components/games/memory-mosaic-game.tsx`
- Modify: `components/games/pattern-pulse-game.tsx`

- [ ] Add development-only start, progress, success, and recovery/failure presets.
- [ ] Prevent timers from mutating captured states.
- [ ] Verify each state through component tests.

### Task 4: Capture and publish real screenshots

**Files:**
- Modify: `data/game-screenshots.ts`
- Create: `public/images/gameplay/<game>/*.webp`

- [ ] Capture the actual game surface in desktop and mobile viewports.
- [ ] Optimize captures to WebP.
- [ ] Register meaningful alt text, captions, dimensions, devices, and states.
- [ ] Run screenshot-system tests.

### Task 5: Final verification

- [ ] Run focused tests.
- [ ] Run the complete test suite and lint.
- [ ] Build the production bundle.
- [ ] Inspect all eight pages at desktop and mobile widths.
- [ ] Run `git diff --check` and report the uncommitted files.
