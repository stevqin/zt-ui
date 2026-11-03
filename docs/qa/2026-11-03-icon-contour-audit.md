# Icon contour and semantics audit

Scope: all 309 built-in glyphs, rendered at 24px and 48px. Six browser-generated contact sheets cover every name in gallery order. Three independent visual reviewers checked non-overlapping ranges 1–120, 121–240 and 241–309; the revised sheets were reviewed again. The first pass left 289 glyphs unchanged. A subsequent user review identified five further composition defects; these are corrected in the follow-up below.

## Corrections

| Icon | Correction |
| --- | --- |
| fingerprint | Regular nested arches and separated ridge endings replace irregular disconnected strokes. |
| barcode | Straight flat-ended guard/data bars; removed fake numeral stubs and accidental hooked endings. Stroke width remains configurable. |
| webhook | Three open loop hooks linked in a cycle replace the fork and detached stray marks. |
| sort-ascending | Consistent top-to-bottom arrow with short-to-long bars. |
| sort-descending | Same reading direction with long-to-short bars. |
| chart-radar | Five spokes converge at a single center and end at the outer pentagon; coherent inner data polygon. |
| shoe | Laces moved inside the shoe upper. |
| crop | Removed repeated edge subpaths. |
| scissors | Removed repeated blade subpath. |
| coupon | Conventional percent diagonal and upper-left/lower-right dots. |
| chart-heatmap | Regular 3×3 matrix replaces unequal dashboard-like rectangles. |
| file-pdf | Noncrossing curved PDF mark replaces a knotted loop. |
| handshake | Separate cuffs, clear palm seam and fewer finger strokes. |
| delivery-return | Arrow points left, consistent with its return curve. |
| hand-truck | Wheel contacts deck; removed disconnected diagonal foot. |
| crane | Simplified tower/boom joint and braces. |
| abacus | Round beads with rods interrupted at bead edges. |
| flame | Clean outer contour and separate inner flame. |
| flower | Clear petals; stem and leaf attach below the flower head. |
| mountain | Rear slope meets the foreground edge instead of ending in space. |

Names, category assignments and animation API remain unchanged. Only barcode uses flat stroke caps; ordinary line icons retain round caps. The audit addresses concrete contour, overlap, direction and readability defects rather than replacing valid icons for stylistic preference.

Before geometry is preserved in `site/tests/fixtures/icon-contours-before.json`. Before/after artifact: `/tmp/zt-icon-contour-comparison.png`; complete contact sheets: `/tmp/zt-icon-audit-1.png` through `/tmp/zt-icon-audit-6.png`.

## Verification

- Initial barcode cap regression failed with round caps; corrected behavior passes.
- Targeted icon tests: 336 passed; all309 names remain unique and render with independent exports.
- Visual inspection and three reviewers confirmed corrections; radar is naturally denser but has coherent geometry at 24px.
- Full library suite: `npm test -- --maxWorkers=2 --testTimeout=15000`, 177 files / 2083 tests passed.
- Site suite: `npm test -- --maxWorkers=1 --testTimeout=15000`, 19 files / 519 tests passed.
- Edge Playwright: 11 tests passed, including all309 bounds/uniqueness/grouping, 20-icon comparison, complete visual contact sheets, copy/search/sticky controls, keyboard, mobile and animations/reduced motion.
- Library ESM/UMD/canvas/declarations and site API/content/type/production builds passed. Existing site large-chunk advisory remains.
- `git diff --check`: clean.

## Follow-up: USB, charging, missed call, loyalty and target

The previous visual review missed composition problems in these five glyphs. The current audit has corrected 25 glyphs in total.

| Icon | Follow-up correction |
| --- | --- |
| usb | Separated the triangle/circle/square endpoint symbols and connected them to continuous, spaced branches. |
| battery-charging | Restored a complete battery enclosure and terminal; the compact lightning mark fits inside with clearance. |
| phone-missed | Replaced conflicting arrow fragments with a clear missed-call X above the handset. |
| loyalty-points | Star reward coin with a partial rear coin; removed the oversized intersecting plus sign. |
| sales-target | Concentric target arcs leave a clear quadrant for the growth arrow, eliminating accidental ring/shaft intersections. |

Reviewed at 24px/56px and independently rechecked for these five glyphs. Before geometry: `site/tests/fixtures/icon-details-before.json`; comparison: `/tmp/zt-icon-detail-comparison.png`. The targeted icon suite passed 336 tests. Follow-up verification: all 12 Edge browser checks passed; library ESM/UMD/canvas/declarations and site API/content/type/production builds passed. `git diff --check` is clean.

## Subsequent design direction

The five follow-up drawings were rejected on visual quality. The user selected mature-reference geometry with small adaptations. Their current implementation supersedes the follow-up descriptions above; see `2026-11-03-icon-reference-adaptations.md` for the current geometry, provenance and comparison.
