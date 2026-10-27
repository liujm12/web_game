# Social Sharing Metadata Implementation Plan
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add complete, scalable social sharing metadata and branded social images across TurboArcade.

**Architecture:** A shared metadata builder returns complete canonical, Open Graph, and Twitter metadata for every route. Next.js image routes produce one site fallback card and one data-driven card per game.

**Tech Stack:** Next.js 16 Metadata API, `next/og` ImageResponse, TypeScript, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-27-social-sharing-metadata-design.md`

## Global Constraints

- Use `https://playturboarcade.com` and `en_US`.
- Use 1200×630 PNG images and `summary_large_image`.
- Do not add `twitter:site`.
- Keep social URLs equal to canonical URLs.

## Review Focus

- A new game slug automatically receives a game-specific image URL.
- Missing games return safe not-found metadata rather than malformed URLs.
- Next.js nested metadata replacement never drops descriptions, images, locale, or site name.
- Guide pages use article metadata while game and category pages use website metadata.
- All image URLs are absolute after `metadataBase` resolution.

---

### Task 1: Shared metadata contract

**Files:**
- Create: `lib/social-metadata.ts`
- Modify: `tests/seo-metadata.test.ts`

**Interfaces:**
- Produces: `buildSocialMetadata(options): Metadata`, `SOCIAL_IMAGE_SIZE`, and `SITE_URL`.

- [ ] Write failing tests for complete Open Graph and Twitter fields.
- [ ] Run the focused test and confirm it fails because the builder does not exist.
- [ ] Implement the minimal typed builder.
- [ ] Run the focused test and confirm it passes.

### Task 2: Route metadata integration

**Files:**
- Modify: public page files under `app/`
- Modify: `tests/seo-metadata.test.ts`

**Interfaces:**
- Consumes: `buildSocialMetadata(options)`.
- Produces: complete route metadata with matching canonical and social URLs.

- [ ] Write failing tests for homepage, game, category, and guide metadata.
- [ ] Run the focused test and confirm the missing fields fail.
- [ ] Replace route-specific metadata objects with the shared builder.
- [ ] Run the focused test and confirm it passes.

### Task 3: Social image routes

**Files:**
- Create: `components/social-card.tsx`
- Create: `app/opengraph-image.tsx`
- Create: `app/twitter-image.tsx`
- Create: `app/games/[slug]/opengraph-image.tsx`
- Create: `app/games/[slug]/twitter-image.tsx`
- Create: `tests/social-images.test.tsx`

**Interfaces:**
- Produces: 1200×630 PNG route handlers and deterministic alt text.

- [ ] Write failing tests for image dimensions, alt text, and per-game image resolution.
- [ ] Run the focused test and confirm the routes are missing.
- [ ] Implement the reusable social card and image routes.
- [ ] Run the focused test and confirm it passes.

### Task 4: Full verification

**Files:**
- Modify only if verification exposes a scoped defect.

- [ ] Run the complete Vitest suite.
- [ ] Run ESLint.
- [ ] Run the production build.
- [ ] Start the production app and inspect homepage plus two game pages at desktop and mobile widths.
- [ ] Confirm emitted canonical, Open Graph, and Twitter tags match each page.
