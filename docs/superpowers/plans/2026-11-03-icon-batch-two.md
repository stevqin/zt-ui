# Second icon expansion

Continue the confirmed 24×24 currentColor round-stroke style: add 120 distinct glyphs to the existing 189, retain previous names, independent component exports and five motion effects. Add real financial, apparel/accessory, transport, document, communication, analysis, editing, commerce, device and nature symbols; integrate with the grouped sticky-search/copy gallery. Add finance and nature categories so the enlarged collection stays easy to browse.

- [x] Raise preservation/unique-render/export tests to the previous 189 plus 120 new glyphs; observe missing-count failure.
- [x] Draw 120 geometries in the existing additional registry, add named exports and audit evidence rows, update typed gallery categories and counts.
- [x] Browser verify all 309 geometries/bounds, all names grouped exactly once, search, clipboard and existing motion; inspect new glyphs at 24px/48px in light and dark.
- [x] Run full library/site suites, builds and component audit; resolve failures and review before completion.

No dependencies, version bump, deployment or changes to the established motion API.

## Results
- Added 120 glyphs: finance, apparel/accessories, transportation, documents, communication, analysis/development, layout/editing, commerce, devices/security and nature. Preserved all previous 189 names; 309 unique named glyphs total.
- All 309 are grouped exactly once across 12 categories. Finance and nature have dedicated sections; new entries retain existing animation/search/copy functionality.
- `npm test -- --maxWorkers=2 --testTimeout=15000`: 177 files, 2082 tests passed.
- Site `npm test -- --maxWorkers=1 --testTimeout=15000`: 19 files, 519 tests passed. Initial concurrent runs hit the default 5s timeout in two unchanged API-extraction fixture tests; bounded solo rerun passed all assertions.
- Edge Playwright: 9 tests passed; 120 new glyphs nonempty/unique/inside 24px canvas, total309/12categories coverage, sticky controls, category/search, actual copy text, keyboard/error recovery, mobile, all animation modes/reduced motion.
- `npm run build`: library ESM/UMD/canvas and declarations passed. Site production build and API/content/type checks passed; existing large-chunk advisory remains.
- `npm run audit:components`: 410 public components, zero violations.
- Independent review: no actionable findings; all 120 exports and category assignments verified.
- Light/dark 24px/40px contact sheets inspected: `/tmp/zt-icon-batch2-light.png`, `/tmp/zt-icon-batch2-dark.png`. Final video-call plus separated from the camera body.
- `git diff --check`: clean. Work remains uncommitted in `codex/icon-expansion-motion`.
