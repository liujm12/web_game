# Content Authenticity Design

## Intent

Make TurboArcade's public authorship, update dates, AI assistance, gameplay verification, and screenshot provenance accurate and easy to audit. The goal is not to manufacture trust signals; it is to expose the real publishing workflow and prevent unsupported claims from returning.

## Chosen Approach

Use three reinforcing layers:

1. Public disclosure explains that `TurboArcade Editorial Team` is a site-level publishing byline, not a claim about staff headcount, and describes the site's substantial AI assistance plainly.
2. Every guide carries a real update date, gameplay-check date, and a guide-specific verification note tied to the current playable implementation.
3. Automated tests protect public pages from fabricated audience metrics and require guide screenshots to come from the real gameplay screenshot manifest.

This is preferred over removing all editorial identity because a consistent organization byline is useful for corrections and structured data. It is also preferred over a generic AI disclaimer because the site needs to say exactly what AI assists with and who remains accountable.

## Truth Rules

- `TurboArcade Editorial Team` identifies the site's publishing function and does not imply multiple human writers or a separate newsroom.
- AI tools may assist substantially with copy, code, tests, and quality checks; the owner/operator decides publication and is accountable for corrections.
- AI tools are not represented as players, reviewers, users, or independent authors.
- No testimonials, audience counts, download counts, traffic claims, popularity rankings, or development-history claims may be invented.
- A guide update date changes only when that guide is meaningfully reviewed or revised.
- A gameplay-check date records the current implementation review and is distinct from the update date.
- Gameplay screenshots must be registered in the real screenshot manifest and come from a running TurboArcade build.
- Verification notes must name the actual mechanics, level data, or board states that were checked.

## Non-goals

- Publishing the owner's legal name or private personal details.
- Claiming independent third-party review.
- Replacing the internal catalog ordering score; it may remain an unpublished administrative field.
- Re-capturing screenshots that already have reproducible states and real source files.

## Acceptance

- The editorial policy and About page describe the real byline and AI workflow.
- Every published guide has an update date, gameplay-check date, and specific verification note.
- Guide pages visibly expose this information and a correction route.
- Every guide image maps to the real screenshot manifest and a relevant game.
- Public-facing cards and pages do not display unsupported popularity or audience claims.
- The site content update date and policy update date reflect this November 12, 2026 review.
- Tests, lint, and production build pass.
