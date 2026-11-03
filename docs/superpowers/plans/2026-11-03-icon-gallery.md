# Icon gallery usability and visual update

User request: keep search/effect/trigger controls accessible while scrolling; clicking a glyph opens a tips-style popup with copy-name and copy-component actions; improve visual design.

Design: reuse the existing Vue icon/input/select/popover components. Sticky toolbar below the actual measured site header, with a subtle translucent surface, thin border and restrained shadow. Grid uses quiet tiles, clear blue hover/selection, monospace labels. Ten semantic categories cover all 189 icons exactly once. Category selection composes with name or Chinese-category search. One active popup shows icon/name, selectable current component code, two copy actions and live feedback. Copy-component reflects the current effect and trigger. Support keyboard open/focus/Escape/outside close and clipboard fallback/error. Close popup on filtering/effect/trigger changes. Keep examples self-contained, with no site-relative imports.

Implementation:
- [x] Add browser regression tests for sticky controls, native clipboard contents, focus/Escape, failed clipboard and filtering.
- [x] Update Gallery.vue with toolbar, controlled ZtPopover tiles, clipboard helper and theme-aware styling; release only this gallery's ancestor overflow in docs.scss.
- [x] Update existing example interaction test for popup-based component code.
- [x] Verify desktop/mobile sticky geometry, single-popup behavior, light/dark screenshots, copy paths and existing icon motion.
- [x] Run site tests and build plus relevant library icon tests.

Constraints: no dependencies, no library API changes, preserve names and motion settings. Header height observed with cleanup. After filtering while scrolled, keep toolbar visible. Popup only displays on user activation. New clipboard actions must not falsely claim success on failure.

## Verification
- Browser RED: missing floating tools/copy popup reproduced before implementation. Review regressions reproduced missing dialog name and search-focus loss.
- Browser GREEN: 8 Edge tests passed, covering sticky positioning, filter/category composition, all 189 unique icons in 10 groups, actual clipboard text, error fallback, keyboard/Escape/focus, 320/390px bounds, existing animations and symbol bounds.
- Site `npm test -- --maxWorkers=2`: 19 files, 519 tests passed.
- Site `npm run build`: API extraction/content check, typecheck and production bundle passed; existing large-chunk advisory remains.
- Reviewed screenshots `/tmp/zt-icon-gallery-copy-light.png`, `/tmp/zt-icon-gallery-copy-dark.png`, `/tmp/zt-icon-gallery-copy-390.png`; browser also captured 320px layout.
- Independent review findings fixed: actual teleported dialog has an accessible name; externally closing a popup preserves toolbar focus, while Escape restores the icon trigger.
- No new dependencies or library API changes; standalone example source remains copyable.
