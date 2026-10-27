# Structured Data Design
## Intent

Describe TurboArcade's real public content to search engines and AI systems with valid JSON-LD that stays synchronized with visible page data.

## Scope

- Homepage: `Organization` and `WebSite`.
- Game pages: `VideoGame`, `BreadcrumbList`, and visible `FAQPage` content.
- Game and category listings: `CollectionPage` and `ItemList`.
- Guide pages: `Article` and `BreadcrumbList`.
- Guide index: `CollectionPage` and `ItemList`.

## Constraints

- Never invent ratings, reviews, prices, awards, authors, or social profiles.
- Use absolute HTTPS URLs rooted at `https://playturboarcade.com`.
- Only include live games in public lists.
- Escape `<` in serialized JSON-LD to prevent script injection.
- Render native `application/ld+json` script tags as recommended by Next.js 16.
