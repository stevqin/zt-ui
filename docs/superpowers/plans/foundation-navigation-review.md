# Independent foundation/navigation review — 2026-09-17

Reviewed Splitter, Space, Carousel, Tour, Affix, Anchor, shared scroll target binding, InfiniteScroll and QRCode after foundation agent released these directories.

## Confirmed defects fixed

1. Carousel without modelValue emitted changes but never switched visible slides. Added internal index when modelValue is omitted while preserving strict controlled behavior when supplied. Public goTo now normalizes arbitrary negative/large indices, floors fractions and ignores nonfinite indices. Chinese API comment updated.
2. Splitter accepted movements/releases from unrelated concurrent pointers. A gesture now owns its pointer ID, rejects additional pointerdown, ignores other pointer events, and clears ownership with listeners.
3. Element-bound Affix only listened to its own scroll container and window resize. Scrolling an ancestor/window moved the container but left fixed content at stale screen coordinates. Shared scroll binding now listens to ancestor scroll in capture phase and observes target size, deduplicates own-container events, rebinds and cleans all listeners/observers.
4. QRCode scheduled object-URL revocation but retained pending timers/URLs until after unmount. It now records pending downloads and synchronously clears/revokes them on unmount while retaining normal delayed browser download cleanup.
5. Tour opened an empty overlay for NaN/fractional current indices. Current now floors and clamps finite indices, with zero fallback for nonfinite values.

## Added tests and evidence

- Observed RED tests for uncontrolled Carousel, unrelated Splitter pointer, ancestor-scroll Affix, QR download unmount cleanup and invalid Tour current before fixes.
- Added positive regressions for strictly controlled Carousel rendering, QR Canvas failure + SVG/color recovery, InfiniteScroll actual container threshold/finished suppression, Space tuple gaps/wrapping updates.
- GREEN: `npx vitest run src/components/{carousel,splitter,affix,anchor,backtop,infinite-scroll,qrcode,space,tour}/*.spec.ts` — 9 suites, 32 tests passed.
- Existing Tour target removal, focus restoration, keyboard completion; InfiniteScroll rejection/retry/abort; QR independent Unicode decode; Space fragment/empty-node filtering all remain passing.
- No additional confirmed defect in Space, Anchor selection math, InfiniteScroll failure handling, or QR encoding surfaced from this pass.
