# Social Sharing Metadata Design
## Intent

Give every public TurboArcade page a reliable, branded preview when shared on social networks and messaging apps. Game pages must identify the individual game instead of falling back to one generic site card.

## Goals

- Publish complete Open Graph and Twitter Card metadata without inventing an X account.
- Keep canonical and social URLs aligned.
- Provide a 1200×630 TurboArcade fallback image.
- Generate a distinct 1200×630 image for every live game from existing game data.
- Make future games inherit the behavior automatically.
- Cover metadata and image contracts with automated tests.

## Non-goals

- Add visible share buttons.
- Create or connect social accounts.
- Add analytics events for sharing.
- Replace structured data work planned separately.

## Approach

Use one typed metadata builder in `lib/social-metadata.ts` so route metadata cannot accidentally omit nested Open Graph fields when Next.js shallowly replaces them. Use Next.js `ImageResponse` file conventions for the root fallback image and dynamic game images. Static pages, categories, and guides use the root fallback image; game pages use their generated game card.

## Constraints

- Site origin is `https://playturboarcade.com`.
- Locale is `en_US`.
- Twitter card type is `summary_large_image`.
- Images are 1200×630 PNG responses.
- No `twitter:site` field until an official TurboArcade X account exists.
- Public metadata remains English.
