# Editorial Trust and Technical SEO Design

## Intent

Make TurboArcade's publishing responsibility visible without inventing a personal author. Players, search engines, and AI systems should be able to understand who maintains the site, how games and guides are tested, when content was reviewed, and how corrections are handled.

## Goals

- Use **TurboArcade Editorial Team** as the consistent editorial identity.
- Add a public Editorial Policy page describing testing, writing, updates, corrections, and advertising independence.
- Add visible editorial attribution and review dates to guide pages and appropriate game-page content.
- Strengthen the About and Contact pages with concrete ownership, testing, and correction language.
- Align Article structured data with the visible editorial attribution.
- Add a useful custom 404 page.
- Add a concise `llms.txt` file for AI/GEO discovery.
- Improve sitemap modification dates so guides and core pages do not all claim one shared date.
- Keep private/admin routes out of public discovery and cover the changes with automated tests.

## Non-Goals

- Do not invent personal biographies, credentials, awards, review scores, traffic claims, or social accounts.
- Do not claim legal incorporation, a physical office, or a staff size that has not been provided.
- Do not redesign the site or change game behavior.
- Do not add fake editorial history to old pages.
- Do not make `llms.txt` a substitute for normal crawlable pages, sitemap, or structured data.

## Chosen Approach

Use a brand-level editorial team identity. This is more transparent than anonymous “we” copy while avoiding the privacy and accuracy problems of a fabricated personal author. The identity will be backed by a visible policy, testing method, correction channel, and consistent structured data.

## User-Facing Changes

### Editorial Policy

Create `/editorial-policy` with:

- who publishes and maintains TurboArcade;
- how original and selected games are tested on desktop and mobile;
- how gameplay instructions and guides are written and reviewed;
- how update dates are assigned;
- how errors and corrections can be reported;
- a clear statement that advertising does not determine gameplay guidance or editorial conclusions.

Add the page to the footer and sitemap.

### Guides

Each guide will visibly show:

- “Written and reviewed by TurboArcade Editorial Team”;
- the existing updated date;
- a link to the Editorial Policy;
- a correction/contact path.

Article JSON-LD will use the same visible editorial identity and link it to the site organization instead of implying an unnamed person.

### Game and Trust Pages

- Game pages will identify when gameplay information was last checked and link to the testing/editorial standard.
- About will explain the real publishing and testing workflow in concrete language.
- Contact will make correction reports a first-class contact reason and explain what evidence to include.

## Technical Fixes

### Custom 404

Add a branded, useful not-found page with links to All Games, Guides, and the homepage. It will not pretend missing content exists.

### `llms.txt`

Add a plain-text route summarizing the site, its primary public sections, editorial policy, and canonical domain. It will contain only public facts and links.

### Sitemap Dates

- Use each guide's real `updatedAt` value for guide URLs.
- Use the configured site content update date for catalog and game pages.
- Keep stable policy pages on a deliberate site-level date rather than generating a new timestamp on every request.

### Crawl Controls

Keep `/admin`, `/api`, and device-local `/my-games` out of public search discovery. Preserve public access to games, guides, policies, `ads.txt`, and `llms.txt`.

## Validation

- Unit tests for editorial attribution, policy links, sitemap dates, robots rules, `llms.txt`, and the custom 404.
- Existing SEO, structured-data, game, and responsive tests remain green.
- ESLint and the Next.js production build pass.
- Rendered-page checks confirm visible attribution matches Article JSON-LD.
- Desktop and mobile browser checks confirm the new trust elements do not crowd the game area.
