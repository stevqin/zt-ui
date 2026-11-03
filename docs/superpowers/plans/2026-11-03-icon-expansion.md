# Icon Expansion Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement tasks inline.

**Goal:** Add 120 unique SVG icons and opt-in motion with three trigger modes.
**Architecture:** Extend the typed registry with separate additional shapes; retain the shared SVG factory. CSS animates SVG children while the outer element retains rotation.
**Tech Stack:** Vue 3, TypeScript, Sass, Vitest, Playwright.
**Spec:** docs/superpowers/specs/2026-11-03-icon-expansion-design.md

## Global Constraints
- 120 new glyphs, 24×24 viewBox, round currentColor strokes; no added dependencies.
- Default static, preserve spin and rotate, reduced motion disables animation.
- Preserve public named exports, custom components, slots, attrs and accessibility.

## Review Focus
- Duplicate glyphs or overwritten existing names: compare canonical rendered SVG signatures.
- Event listeners after unmount or trigger changes: test old button does not replay.
- Keyboard click on ancestor button: mount real button and dispatch click.
- Rotation and spin coexistence: browser assert wrapper and SVG animations separately.
- Reduced motion and repeat clicks: browser measure computed animations and unit test restart.

### Task 1: Registry
- [x] Write failing coverage assertion for 189 total unique glyphs (69 existing + 120 new); render every name and verify named export exists.
- [x] Add shapes in src/components/icon/additional-icons.ts, wire types.ts, icons.ts and exports; verify tests.

### Task 2: Motion
- [x] Write failing tests for static default, explicit animation and three triggers, click replay, ancestor click, cleanup and spin precedence.
- [x] Add typed props in types.ts, event handling in ZtIcon.vue, keyframes/trigger selectors in icon.scss; verify tests.

### Task 3: Gallery and verification
- [x] Extend site/src/examples/icon/Gallery.vue and Basic.vue with motion controls and usage; regenerate API.
- [x] Add and run browser checks for actual animations, trigger modes, keyboard and reduced motion; visually inspect gallery.
- [x] Run npm test, npm run build, site docs checks/build; record results here.

## Progress
- Design accepted by user; implementing in the existing clean checkout, leaving changes reviewable without publishing.

- Registry and motion: 215 targeted tests passed; baseline preservation and cleanup coverage added after review.
- Independent review: no blocking defects; verification gaps addressed.
- Browser: Edge passed actual animation names, repeat-click restart, Enter/Space activation, rotate coexistence, reduced motion, all SVG bounds, light/dark and 390px layout.
- Library build: ESM, UMD, canvas ESM and canvas UMD passed. Site build/API checks passed.
- Audit: 290 public components (101 SFCs, 189 SVG icons), zero violations.
- Full suites initially overlapped and hit existing 5s timeouts/worker RPC timeouts; rerunning with bounded workers.

## Final verification
- `npm test -- --maxWorkers=2 --testTimeout=15000`: 177 files, 1962 tests passed.
- Site `npm test -- --maxWorkers=2`: 19 files, 519 tests passed with default per-test timeout.
- Site `ZT_DOCS_BROWSER_CHANNEL=msedge npx playwright test tests/browser/icon-motion.spec.ts`: passed.
- `npm run build`: library ESM/UMD/canvas and declarations passed. Site final `npm run build`: passed; existing large-chunk advisory remains.
- `npm run audit:components`: 290 components, zero violations.
- `git diff --check`: clean.
- Visual QA: `/tmp/zt-icon-gallery-light.png`, `/tmp/zt-icon-gallery-dark.png`, `/tmp/zt-icon-gallery-mobile.png` inspected.
- Work left uncommitted on `codex/icon-expansion-motion`; no publish or deployment performed.

## Symbol corrections after visual feedback
- `messages`: rounded overlapping speech bubbles with message lines, replacing the ambiguous square outlines.
- `login`: corrected the outward arrow to point into the door. `logout`: matched door height and spacing while preserving the outward arrow.
- Browser regression reproduced the original login direction failure (arrow tip x=6 versus start x=10), then passed after correction.
- Validation: 215 icon unit tests, two Edge browser tests (symbols + full motion/gallery), typecheck, and diff whitespace check passed.
- Before/after 24px and 64px comparison inspected: `/tmp/zt-icon-symbols-comparison.png`.

- Follow-up `filter-list`: centered all three decreasing strokes on x=12 (lengths 16/10/4), replacing the right-aligned 16/13/10 arrangement. Verified at 24px and 64px in `/tmp/zt-icon-filter-list-comparison.png`; 215 icon tests and two Edge browser tests passed.

- User refinement: `filter-list` now combines three descending list strokes on the left with the `filter` funnel silhouette on the right. Inspected at 24px/64px (`/tmp/zt-icon-filter-list-combined.png`); all 215 icon tests and both browser checks passed.

- Latest user refinement: `filter-list` uses full-size descending list lines with a smaller funnel badge overlapping the lower-right region. Inspected at 24px/64px (`/tmp/zt-icon-filter-list-overlay.png`); 215 icon tests and both browser tests passed.

- Corrected overlay interpretation: funnel is entirely within the list bounds (right x=20, bottom y=18), with its bottom aligned to the last list stroke; overlapping horizontal strokes are interrupted for clearance. Added a browser geometry regression for right/bottom containment and smaller funnel height; the prior design failed, the revised glyph passed. Inspected 24px/64px comparison `/tmp/zt-icon-filter-list-contained.png`. All 215 icon unit tests and both browser checks passed.
