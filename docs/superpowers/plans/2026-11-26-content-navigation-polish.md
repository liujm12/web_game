# Content And Navigation Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clarify game difficulty labels, remove false-button affordances, surface guide-to-game actions, and add lightweight guide discovery without changing URLs or adding dependencies.

**Architecture:** Keep pages as Server Components. Add one focused Client Component for guide search and topic filters, receiving serializable guide summaries from the server. Represent multi-level game difficulty as optional content metadata so only games with a real range use the alternate label.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Vitest, Testing Library.

**Spec:** User-approved changes from the November 26, 2026 TurboArcade interaction audit.

## Global Constraints

- Do not change public URLs, canonical paths, or sitemap behavior.
- Do not add a site-wide search system or a new dependency.
- Keep static metadata visibly and semantically distinct from controls.
- Preserve server rendering for guide content and only hydrate the filtering surface.

## Review Focus

- Patrol Escape must distinguish current-level difficulty from the full game range.
- Search must match title, summary, game name, and topic without case sensitivity.
- Filtering must preserve a useful empty state and a one-click reset.
- Guide cards and links must remain server-rendered on the first response.
- Mobile controls must retain readable labels and touch targets.

---

### Task 1: Clarify Difficulty And Static Metadata

**Files:**
- Modify: `lib/site-content.ts`
- Modify: `data/site-content.json`
- Modify: `app/games/[slug]/page.tsx`
- Modify: `components/games/patrol-escape-game.tsx`
- Modify: `components/category-hero.tsx`
- Modify: `app/page.tsx`
- Test: `tests/patrol-escape-game.test.tsx`
- Test: `tests/player-pages.test.tsx`
- Test: `tests/homepage-impeccable.test.tsx`

- [ ] Write failing tests for explicit level/range labels and semantic metadata lists.
- [ ] Run focused tests and confirm the expected failures.
- [ ] Add optional `difficultyRange` metadata and update the affected UI.
- [ ] Replace decorative pill groups with clearly labeled metadata lists.
- [ ] Run focused tests and confirm they pass.

### Task 2: Improve Guide Discovery And Game Entry

**Files:**
- Create: `components/guide-browser.tsx`
- Modify: `app/guides/page.tsx`
- Modify: `app/guides/[slug]/page.tsx`
- Test: `tests/guides.test.tsx`

- [ ] Write failing tests for header CTAs, keyword search, topic filters, and empty results.
- [ ] Run the guide tests and confirm the expected failures.
- [ ] Add a serializable guide index model and interactive browser component.
- [ ] Add the primary related-game action to each guide header.
- [ ] Run focused tests and confirm they pass.

### Task 3: Validate The Integrated Change

**Files:**
- Verify only.

- [ ] Run the full test suite.
- [ ] Run lint.
- [ ] Run the production build.
- [ ] Review the final diff for unrelated changes.
