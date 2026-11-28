# TurboArcade (`web_game`)

TurboArcade (`playturboarcade.com`) is a fast, mobile-friendly browser game portal built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **TypeScript**. It focuses on instant-play sessions, clean keyboard and touch controls, original playtested guides, structured technical SEO, and zero runtime third-party UI or database dependencies.

## Features

- **Curated Game Catalog**: 20 public browser games across `Arcade` and `Brain` categories (19 lazy-loaded React games via `next/dynamic` + 1 hosted HTML5 iframe game), organized by editorial tier (`A` core, `B` tested catalog, `C` / `draft` hidden).
- **Deterministic Game Engines**: Core logic lives in standalone modules (`lib/patrol-escape.ts`, `lib/games/*`), including a 120-level solver-verified traffic puzzle (`Patrol Escape`).
- **Local Player Profile**: Favorites, recent games, best scores, and daily challenge state stored in `localStorage` via `lib/player-profile.ts` and surfaced on `/my-games`.
- **Editorial Guides & Verification**: 9 original strategy guides in `data/guides.ts` with gameplay check dates, verification notes, real build WebP screenshots (`public/images/gameplay/`), and a dedicated `/traffic-puzzle-games` hub.
- **Technical SEO & Trust Surfaces**:
  - Static prerendering (`generateStaticParams`) for all public game, category, and guide routes.
  - JSON-LD structured data (`Organization`, `WebSite`, `VideoGame`, `FAQPage`, `CollectionPage`, `ItemList`, `Article`, `BreadcrumbList`).
  - Dynamic Open Graph / Twitter cards, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/ads.txt`, and policy pages (`/about`, `/editorial-policy`, `/contact`, `/privacy`, `/terms`, `/dmca`).
- **Dev-Only Content Workspace**: `/admin` and `/api/site-content` allow local editing of `data/site-content.json` and automatically return `404` in production.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the production bundle and prerender static routes |
| `npm run start` | Run the production server after building |
| `npm run lint` | Run ESLint across the repository |
| `npm test` | Run the full Vitest unit & component test suite |
| `npx tsc --noEmit` | Run strict TypeScript typechecking |
| `npm run screenshots:optimize` | Convert captured PNGs in `.tmp-game-screenshots/` to optimized WebP assets under `public/images/gameplay/` |

## Project Structure

```text
app/                    App Router pages, metadata routes, dynamic OG images, and dev-only API
components/             Shared UI shell, player tools, ad slot wrapper, and lazy-loaded games
  games/                Playable React game components
data/                   Site catalog (site-content.json), guides, screenshot manifest, and level data
lib/                    Game engines, player profile store, editorial helpers, and JSON-LD builders
public/
  embed-games/          Standalone HTML5 games served inside EmbedGameFrame
  images/gameplay/      Optimized WebP gameplay evidence screenshots
scripts/                Asset optimization scripts
tests/                  Vitest suites covering engines, UI, mobile UX, SEO, and content authenticity
docs/                   Design specs, implementation plans, content audits, and UX regression reports
```

## Editorial Tiers & Publishing

Game visibility is governed by `isPublicGame()` in `lib/site-content.ts`:

- **Tier `A` (`status: "live"`)**: Featured editorial core with dedicated guides, verified gameplay notes, and screenshot galleries.
- **Tier `B` (`status: "live"`)**: Tested public catalog games listed on `/games` and category pages.
- **Tier `C` or `status: "draft"`**: Excluded from public pages, `generateStaticParams`, and `/sitemap.xml`.

## Deployment & AdSense Configuration

1. Set the optional AdSense client environment variable when ready for monetization:
   ```bash
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
   ```
   - When unset, `AdSlot` renders nothing (no empty ad placeholders) and `/ads.txt` returns a configuration comment.
   - When set, the AdSense script is injected in `app/layout.tsx` and `/ads.txt` serves the matching publisher record.
2. After approval, configure individual slot IDs under `site.adSlots` in `data/site-content.json`.
3. Verify `/sitemap.xml`, `/robots.txt`, `/llms.txt`, and `/ads.txt` after deployment.
