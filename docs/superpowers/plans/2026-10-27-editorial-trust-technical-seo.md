# Editorial Trust and Technical SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a verifiable TurboArcade Editorial Team identity, visible editorial standards, and a small set of technical SEO/GEO fixes without inventing personal credentials or changing game behavior.

**Architecture:** Centralize editorial identity and stable dates in one small data module, render them through existing server pages, and keep JSON-LD synchronized with visible copy. Add framework-native routes for the editorial policy, 404 page, robots, sitemap, and `llms.txt`, with focused tests before implementation.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, MetadataRoute APIs, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-27-editorial-trust-technical-seo-design.md`

## Global Constraints

- Use **TurboArcade Editorial Team** as the only editorial identity.
- Do not invent personal names, biographies, credentials, awards, staff counts, review scores, traffic claims, or social accounts.
- Keep all public copy in English.
- Do not redesign pages or change game behavior.
- Visible attribution and structured data must agree.
- Do not commit or push until the user explicitly requests it.

## Review Focus

- Missing or draft games must not gain public editorial claims or sitemap entries.
- Invalid guide dates must not crash sitemap or Article rendering.
- `llms.txt` must expose only canonical public routes and no admin/API paths.
- Device-local `/my-games` must remain usable while being excluded from search discovery.
- Editorial links must remain readable on mobile without crowding the playable game area.

---

### Task 1: Editorial identity and policy

**Files:**
- Create: `lib/editorial.ts`
- Create: `app/editorial-policy/page.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `components/site-footer.tsx`
- Test: `tests/editorial-trust.test.tsx`

**Interfaces:**
- Produces: `EDITORIAL_TEAM_NAME`, `EDITORIAL_POLICY_PATH`, `EDITORIAL_POLICY_UPDATED_AT`, and `formatEditorialDate(value: string): string`.
- Consumes: existing `buildSocialMetadata()` and configured support email.

- [ ] **Step 1: Write failing editorial trust tests**
  - Assert the policy page names TurboArcade Editorial Team.
  - Assert it explains testing, guide review, corrections, update dates, and advertising independence.
  - Assert About and Contact contain concrete workflow and correction copy.
  - Assert the footer links to `/editorial-policy`.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `npm test -- tests/editorial-trust.test.tsx`

- [ ] **Step 3: Add the editorial constants and policy page**
  - Implement the public editorial policy using only claims supported by the current site and testing workflow.
  - Add complete metadata and a canonical URL.

- [ ] **Step 4: Strengthen About, Contact, and footer copy**
  - Replace anonymous generalities with the selected brand editorial identity and an explicit correction path.

- [ ] **Step 5: Run the focused test and confirm success**

### Task 2: Visible attribution and matching structured data

**Files:**
- Modify: `data/guides.ts`
- Modify: `app/guides/[slug]/page.tsx`
- Modify: `app/games/[slug]/page.tsx`
- Modify: `lib/structured-data.ts`
- Test: `tests/editorial-attribution.test.tsx`
- Test: `tests/structured-data.test.ts`
- Test: `tests/structured-data-pages.test.tsx`

**Interfaces:**
- Consumes: editorial constants from Task 1.
- Produces: visible guide byline/review information and Article JSON-LD whose author/publisher identity matches the page.

- [ ] **Step 1: Write failing attribution tests**
  - Assert every guide shows the editorial team, updated date, policy link, and correction link.
  - Assert game pages show their existing last-checked value and a testing-standard link outside the play surface.
  - Assert Article JSON-LD identifies the editorial team consistently.

- [ ] **Step 2: Run focused tests and confirm failure**

Run: `npm test -- tests/editorial-attribution.test.tsx tests/structured-data.test.ts tests/structured-data-pages.test.tsx`

- [ ] **Step 3: Add visible guide and game attribution**
  - Keep attribution compact and secondary to the game/guide content.
  - Do not add fabricated review dates; use existing guide updates and game `lastChecked` data.

- [ ] **Step 4: Align Article JSON-LD**
  - Reference a named Organization/Person-free editorial identity that matches visible page copy.

- [ ] **Step 5: Run focused tests and confirm success**

### Task 3: Technical SEO and GEO routes

**Files:**
- Create: `app/not-found.tsx`
- Create: `app/llms.txt/route.ts`
- Modify: `app/robots.ts`
- Modify: `app/sitemap.ts`
- Test: `tests/technical-seo.test.tsx`
- Modify: `tests/seo-metadata.test.ts`

**Interfaces:**
- Consumes: public routes, guide dates, site update date, and editorial policy path.
- Produces: branded 404 UI, plain-text `llms.txt`, stricter crawl rules, and per-content sitemap dates.

- [ ] **Step 1: Write failing technical SEO tests**
  - Assert custom 404 links to Home, All Games, and Guides.
  - Assert `llms.txt` uses `text/plain`, canonical HTTPS links, and excludes `/admin`, `/api`, and `/my-games`.
  - Assert robots disallows `/admin`, `/api`, and `/my-games` while advertising the sitemap.
  - Assert each guide sitemap entry uses its own real update date.

- [ ] **Step 2: Run focused tests and confirm failure**

Run: `npm test -- tests/technical-seo.test.tsx tests/seo-metadata.test.ts`

- [ ] **Step 3: Implement the custom 404 and `llms.txt` route**
  - Use framework-native App Router conventions and stable public links.

- [ ] **Step 4: Refine robots and sitemap output**
  - Preserve public indexing while excluding private/device-local surfaces.
  - Parse existing guide dates defensively and fall back to the stable site update date if invalid.

- [ ] **Step 5: Run focused tests and confirm success**

### Task 4: Full validation

**Files:**
- Modify only if validation reveals a regression.

**Interfaces:**
- Consumes: all deliverables from Tasks 1–3.
- Produces: verified local release candidate, without committing or pushing.

- [ ] **Step 1: Run all automated tests**

Run: `npm test`

- [ ] **Step 2: Run lint and production build**

Run: `npm run lint`

Run: `npm run build`

- [ ] **Step 3: Start the production server and inspect desktop/mobile pages**
  - Check `/editorial-policy`, one guide, one game, a missing route, `/robots.txt`, `/sitemap.xml`, and `/llms.txt`.

- [ ] **Step 4: Compare visible attribution with emitted JSON-LD**
  - Confirm names, dates, URLs, and policy links match.

- [ ] **Step 5: Report changes and validation results**
  - Leave the working tree uncommitted until the user requests publication.
