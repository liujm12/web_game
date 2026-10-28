const BASE_URL = "https://playturboarcade.com";

export async function GET() {
  const body = `# TurboArcade

> TurboArcade publishes free browser games for short play sessions, plus practical rules, controls, strategy notes, and original guides reviewed by the TurboArcade Editorial Team.

## Main sections
- [All Games](${BASE_URL}/games): Browse the complete public game catalog.
- [Game Guides](${BASE_URL}/guides): Read practical strategy and control guides.
- [Arcade Games](${BASE_URL}/categories/arcade): Reflex, timing, and action games.
- [Brain Games](${BASE_URL}/categories/brain): Puzzle, memory, and logic games.

## About and policies
- [About TurboArcade](${BASE_URL}/about): Site purpose and publishing approach.
- [Editorial Policy](${BASE_URL}/editorial-policy): Testing, review, corrections, and advertising independence.
- [Contact](${BASE_URL}/contact): Support and correction requests.
- [Privacy Policy](${BASE_URL}/privacy)
- [Terms](${BASE_URL}/terms)
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
