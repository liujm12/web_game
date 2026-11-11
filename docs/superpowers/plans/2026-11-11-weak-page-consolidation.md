# Weak Page Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the three C-tier games available for future rebuilding while removing them from every public editorial and search-facing surface.

**Architecture:** Add an explicit editorial tier to game records, keep public availability controlled by `status`, and make homepage/catalog selection depend on both status and tier. Render All Games as a curated A-tier shelf followed by grouped B-tier collections.

**Tech Stack:** Next.js App Router, React, TypeScript, JSON content records, Vitest, Testing Library

**Spec:** `docs/superpowers/specs/2026-11-11-weak-page-consolidation-design.md`

## Global Constraints

- Preserve all existing game implementations and URLs.
- Keep Orbit Hopper, Neon Drift, and Signal Sweep as drafts.
- Do not publish C-tier games in lists, recommendations, structured data, or sitemap output.
- Keep all tested A/B games playable and discoverable.

## Review Focus

- A C-tier game with `featured: true` must still never reach homepage selection.
- A draft game must not appear in sitemap or structured collections.
- All Games must still expose every live B-tier game exactly once.
- The homepage must not silently fall back to a B/C game when A-tier records exist.
- Existing saved-game dashboards must continue receiving the full live A/B catalog.

---

### Task 1: Lock editorial tiers with failing tests

**Files:**
- Modify: `tests/game-content-quality.test.ts`
- Modify: `tests/site-content.test.ts`
- Modify: `tests/all-games-page.test.tsx`
- Modify: `tests/seo-metadata.test.ts`

- [ ] Add assertions for the eight A-tier slugs, all remaining live B-tier slugs, and the three C-tier draft slugs.
- [ ] Add selection tests proving featured helpers exclude C-tier and draft records.
- [ ] Add rendering tests for curated A/B catalog sections and absent C titles.
- [ ] Run the focused tests and confirm they fail because editorial tiers and curated sections do not exist yet.

### Task 2: Add editorial tier data and safe selectors

**Files:**
- Modify: `lib/site-content.ts`
- Modify: `data/site-content.json`

- [ ] Add `editorialTier: "A" | "B" | "C"` to game records.
- [ ] Mark the eight core games A, other live games B, and the three weak drafts C.
- [ ] Set every C-tier record to `featured: false`.
- [ ] Make featured selection require live A-tier status.
- [ ] Run the content and helper tests until green.

### Task 3: Curate homepage and All Games discovery

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/games/page.tsx`

- [ ] Use only A-tier games in homepage hero, turbo queue, and featured cards.
- [ ] Replace the single catalog grid with an A-tier editorial shelf and category-grouped B-tier collections.
- [ ] Keep the player dashboard supplied with all live A/B games.
- [ ] Run page tests until green.

### Task 4: Verify search-facing exclusion and the full application

**Files:**
- Test: `tests/seo-metadata.test.ts`
- Test: `tests/game-content-quality.test.ts`

- [ ] Confirm sitemap output contains every live A/B game and no C-tier URL.
- [ ] Run lint, the full test suite, production build, and `git diff --check`.
- [ ] Report the final A/B/C counts and any remaining non-blocking warnings.

