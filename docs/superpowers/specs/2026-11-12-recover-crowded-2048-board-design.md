# Recover a Crowded 2048 Board — Design

## Intent

Add a search-focused TurboArcade guide that helps a player decide whether a crowded 2048 board is still recoverable and which move restores mobility. The guide must complement, rather than repeat, the existing corner strategy.

## Goals

- Teach a concrete crowded-board diagnosis based on empty cells, available merges, and tile order.
- Explain when delaying a small merge creates more useful space.
- Show how a zero-score move can restore a usable number sequence.
- Define a clear no-recovery test.
- Use real screenshots captured from reproducible states in the playable TurboArcade 2048 game.

## Non-goals

- Re-explain how to anchor the largest tile in a corner.
- Provide a complete beginner introduction to 2048.
- Claim that every crowded position has a unique best move.

## Approach

Use four reproducible board positions. Three new in-game capture presets demonstrate recoverable boards; the existing real no-moves-left capture demonstrates an unrecoverable board. This is preferred over diagrams because the screenshots prove that each position is rendered by the live game, while deterministic presets keep the evidence repeatable.

## Content structure

1. Diagnose crowding by counting empty cells and useful merges.
2. Preserve mobility by choosing the move that creates the most usable cells.
3. Delay a low-value merge when another direction creates more space.
4. Restore tile order even when the move scores zero.
5. Stop when the board is full and has no horizontal or vertical equal neighbors.

## Verification

- The guide has an independent slug, title, summary, metadata, and structured data through the existing guide system.
- It contains four real board images and at least three actionable case analyses.
- The existing 2048 Corner Strategy links to the new guide and vice versa.
- Tests assert exact board presets, image files, distinct content, and rendered links.
- Desktop and mobile rendering are checked before completion.
