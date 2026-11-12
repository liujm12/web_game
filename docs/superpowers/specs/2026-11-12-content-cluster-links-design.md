# Content Cluster Link Rules

## Goal

Create a small, deliberate internal-link graph around TurboArcade games, topic hubs, and guides. Links must help a player continue the same topic rather than exist only for search engines.

## Page responsibilities

- Topic and category hubs link to their related games and every guide assigned to that hub.
- Game pages link to one topic/category hub, every guide written for that game, and three genuinely related games.
- Guide pages link to their practice game or games, one topic/category hub, and exactly one next guide.
- The guides index remains a second discovery route for every published guide.

## Link labels

Guide links use labels that make sense without surrounding text. Important examples are `Learn the traffic puzzle rules`, `Patrol Escape beginner strategy`, and `Recover a crowded 2048 board`. Game links use `Play {game title}`. Topic links use `Explore {hub name}`.

Generic labels such as `Click here`, `Read more`, `Learn more`, and `Read the guide` are not used for content-cluster links.

## Link density

- A game page shows at most three related games.
- A guide page shows exactly one next guide.
- A hub lists all guides assigned to it, but does not repeat the same guide links in multiple sections.
- The same server-rendered links are used at every viewport size.

## Accessibility

Related links are grouped in labelled sections so that their purpose is clear to screen-reader users and testable without relying on visual placement.

