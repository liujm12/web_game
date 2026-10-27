# Structured Data Implementation Plan
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add truthful, reusable JSON-LD to TurboArcade's main discovery pages.

**Architecture:** Pure builders in `lib/structured-data.ts` create page-specific schema graphs from existing content. A small server component safely serializes each graph into a native JSON-LD script.

**Tech Stack:** Next.js 16 App Router, React server components, TypeScript, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-27-structured-data-design.md`

## Global Constraints

- Use only visible, existing content.
- Use absolute production URLs.
- Escape `<` during serialization.
- Exclude draft games.

## Review Focus

- JSON-LD injection through editable content.
- Draft games appearing in public ItemList data.
- Canonical and structured-data URLs diverging.
- FAQ schema containing questions not visible on the page.
- Invalid or invented commercial/review properties.

---

### Task 1: Safe JSON-LD foundation

- [ ] Write failing serialization and site-identity tests.
- [ ] Implement pure URL, serialization, Organization, and WebSite builders.
- [ ] Add the reusable `JsonLd` component.
- [ ] Verify focused tests pass.

### Task 2: Game discovery schemas

- [ ] Write failing game, breadcrumb, FAQ, collection, and live-filter tests.
- [ ] Implement `VideoGame`, `BreadcrumbList`, `FAQPage`, `CollectionPage`, and `ItemList` builders.
- [ ] Render schemas on home, games, category, and game pages.
- [ ] Verify focused tests pass.

### Task 3: Guide schemas and verification

- [ ] Write failing guide article and guide-list tests.
- [ ] Implement article and guide collection builders.
- [ ] Render schemas on guide index and guide detail pages.
- [ ] Run all tests, lint, production build, and rendered HTML checks.
