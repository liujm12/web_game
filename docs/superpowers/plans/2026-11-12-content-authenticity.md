# Content Authenticity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make TurboArcade's authorship, AI assistance, dates, gameplay checks, and screenshot evidence publicly accurate and regression-tested.

**Architecture:** Extend guide records with explicit verification metadata, render it on guide pages, and publish precise workflow disclosure on trust pages. Add cross-data tests that verify screenshot provenance, current dates, guide-specific checks, and the absence of unsupported public metrics.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-12-content-authenticity-design.md`

## Global Constraints

- Preserve all existing uncommitted Tasks 11–13 work.
- Do not invent a personal author name, team size, review count, audience metric, or ranking.
- Use November 12, 2026 only for content actually reviewed in this task.
- Do not commit or push unless the user requests it.

## Review Focus

- A brand byline must not imply an unverified multi-person newsroom.
- A generic AI sentence must not understate the site's substantial AI assistance.
- A guide image not present in the gameplay manifest must fail provenance checks.
- A future or stale guide verification date must fail the authenticity audit.
- A public popularity or audience count must fail the player-facing claim audit.

---

### Task 1: Authenticity Contract

**Files:**
- Create: `tests/content-authenticity.test.tsx`
- Modify: `tests/editorial-attribution.test.tsx`
- Modify: `tests/editorial-trust.test.tsx`

**Interfaces:**
- Consumes: current pages, guide records, screenshot manifest, site content.
- Produces: observable authenticity requirements for public pages and data.

- [ ] Write tests for byline disclosure, AI workflow, guide verification, screenshot provenance, dates, and unsupported claims.
- [ ] Run the focused tests and confirm they fail for missing disclosure and verification metadata.

### Task 2: Public Workflow Disclosure

**Files:**
- Modify: `app/editorial-policy/page.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/llms.txt/route.ts`
- Modify: `lib/editorial.ts`

**Interfaces:**
- Consumes: `EDITORIAL_TEAM_NAME`, support email, current policy page.
- Produces: accurate site-level byline and AI-assistance disclosure.

- [ ] Explain the byline without claiming staff headcount.
- [ ] Describe AI use and owner/operator accountability precisely.
- [ ] Update the policy date to November 12, 2026.
- [ ] Run focused trust tests until green.

### Task 3: Guide Verification Records

**Files:**
- Modify: `data/guides.ts`
- Modify: `app/guides/[slug]/page.tsx`
- Modify: `data/site-content.json`
- Modify: guide and structured-data tests where visible wording changes.

**Interfaces:**
- Produces: `verifiedAt: string` and `verificationNote: string` on every `GameGuide`.
- Consumes: these fields in the guide page verification panel.

- [ ] Add guide-specific gameplay checks and truthful dates.
- [ ] Replace the ambiguous written-and-reviewed claim with a publishing byline.
- [ ] Show gameplay-check date and verification note.
- [ ] Update the site content date to 2026-11-12.
- [ ] Run guide and attribution tests until green.

### Task 4: Screenshot and Claim Audit

**Files:**
- Modify: `data/game-screenshots.ts`
- Create: `docs/content-authenticity-audit-2026-11-12.md`
- Modify: `tests/game-screenshot-system.test.tsx`

**Interfaces:**
- Produces: a shared screenshot provenance disclosure and a dated audit record.
- Consumes: guide image paths and public game-card output.

- [ ] Publish a screenshot-source disclosure based on the running site.
- [ ] Verify every guide image belongs to the relevant game manifest.
- [ ] Record findings for author identity, dates, metrics, history, screenshots, guides, and factual checks.
- [ ] Run focused authenticity and screenshot tests until green.

### Task 5: Full Verification

**Files:**
- No new production files.

**Interfaces:**
- Consumes: all changes from Tasks 1–4.
- Produces: a validated working tree ready for review.

- [ ] Run the full Vitest suite.
- [ ] Run ESLint.
- [ ] Run the production build.
- [ ] Review the complete diff for unsupported claims or accidental changes.
