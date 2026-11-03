# Demo and component polish

User scope: redesign sidebar group styling; fix Collapse disclosure glyph; refine Descriptions detail hierarchy; add Segmented active-capsule movement; repair zt-alert-loading demo icons; explore more attractive Form validation feedback.

Design follows existing enterprise blue/neutral tokens and native system typography. Quieter sidebar headings and softened link states; readable ledger/plain Descriptions; tail-free16px disclosure chevron; single measured active capsule with real translation/size transitions (not text scaling). Complete SVG loading states fit their icon slot. Form adds inline/popover/summary modes while preserving default tooltip API and existing usages, with a real switchable demo for review.

- [x] Split independent component/site tasks with bounded file ownership.
- [x] Collapse/Segmented targeted25 tests and2 browser motion tests passed.
- [x] Descriptions6 tests, responsive/long-value browser checks and light/dark/mobile screenshots passed.
- [x] Sidebar/loading14 tests,3 browser checks and theme/mobile/SVG screenshots passed.
- [x] Form4 mode regressions written before code and observed failing;18 focused tests passed after implementation.
- [x] Validate Form modes with real layout/focus/scroll/keyboard/mobile/high-z-index checks and screenshots.
- [x] Integrate public API explanations, regenerate metadata and check demo standalone compilation.
- [x] Whole-library/site regression, builds, contract audit and final review.

Form semantics: new `messageDisplay` on Form (tooltip/inline/popover/summary) and FormItem (tooltip/inline/popover override). Default tooltip stays compatible. Inline is a light text row without a separate icon. Popover/summary fields retain full control width and reveal error text only during focus/hover: short messages share the top label row when space allows, longer messages reserve space below the control. Floating text is viewport-clamped, and visible siblings refresh when feedback spacing or the summary moves their anchors. Escape dismisses it. Summary gives reactive field links; validate focuses the first invalid field, validateField does not steal focus. Reduced motion respected. New field errors retain the existing aria-describedby/error-id association. Reset/clear and server errors update summaries reactively.

Verification: library 180 files / 2092 tests passed; docs 19 files / 523 tests passed; 37 distinct browser checks passed (10 scoped component checks and 27 appearance/focus/menu/search/Form/Table regressions). Final library and docs builds passed, API extraction and standalone examples/contracts passed. Four Form browser checks include long wrapping errors, high stacking contexts, 320/390px dark layouts, and stale anchor prevention after preceding feedback and summary rows move. Final focused Form suite:18 tests passed. Review identified the stale anchor issue and its regression now passes. Existing unrelated icon work retained.


## Follow-up: validation placement and catalogue navigation

User clarified that the remaining Form concern is message position and visual style. Add `messageDisplay="label"`: error copy sits beside a top label in normal flow, outside the actual HTML label so the accessible field name remains stable. Long text wraps, horizontal/unlabelled fields use an in-flow row below the control. Softer outlined error states and neutral valid fields avoid a red/green wall. Default public tooltip behavior remains compatible; all Form documentation examples now opt into the recommended label presentation. Comparison keeps label/inline/popover/summary.

Navigation now uses a shared desktop/mobile ComponentNavigation: collapsible category buttons with meaningful icons, counts and expanded state; English component title plus Chinese caption; a reading rail and active mark; sticky group headers; navigation reopens the destination group, including another route within a manually collapsed group. No new dependency.

Two new unit regressions observed failing before the label implementation;20 focused Form tests passed afterwards. Browser coverage includes label/long-message geometry,320/390px dark layouts, unchanged accessible names and field widths, correction/reset, collapse keyboard controls, route expansion, mobile navigation, and existing focus/search/Form/Table interactions. API extraction, standalone examples and final builds passed. Final results:2094 library tests passed across180 files;523 docs tests passed across19 files;38 browser checks passed. Both library and documentation builds passed, including typechecks, generated API contracts and215 standalone examples. Follow-up read-only review found no concrete new regressions.


## Follow-up: expand all categories and remove floating-feedback layout changes

User accepted the catalogue and label feedback, requested every navigation category expanded by default, and reported hover-induced page jumps in popover mode. The cause was the dynamic feedbackSpace margin added to bottom popovers: the teleported layer itself was fixed, but its field still reserved space. Removed that state, margin class/CSS variable, and the now-unused shared layout notification. Popovers stay fixed in body, with existing viewport/stacking/resize/scroll positioning; label feedback is unchanged. Desktop and mobile catalogue initialize all categories expanded while retaining manual collapse and destination expansion.

Browser regressions were changed to require unchanged field positions and form heights under hover and long message resizing, with frame samples for jitter. Before the fix,3 floating/layout checks and2 default-expansion checks failed; after the fix the focused20 Form tests passed. Both production builds, typechecks, API extraction and standalone documentation checks passed. All12 browser checks passed in the final single-worker run. An initial parallel smoke run missed the existing800ms loading completion state while builds were running; the final run passed without changing that unrelated demo or test.


## Follow-up: horizontal label validation

User requested a more deliberate placement for label/control side-by-side layouts. Label mode now places horizontal feedback in a trailing column, capped at14em/38% and reserved before validation so control widths do not change when errors appear/clear. Empty columns are aria-hidden without an error id or alert role. The existing content ResizeObserver measures actual available width: under360px the message moves above the control and the empty column disappears. Top-label feedback remains unchanged, unlabelled fields keep their below-control fallback, and floating modes remain out of flow.

Layout demo now validates real fields and switches right/left/top labels. One adjusted unit regression failed before implementation, then69 focused Form/selection/upload regressions passed.18 browser checks passed, including unchanged control widths, left/right alignment, wrapping,320/390px dark layouts, resize of a narrow desktop container, reset, existing floating stability, and nested/server-error Form flows. Final library and documentation builds passed, including typechecks, API extraction and standalone-example checks.


## Follow-up: Splitter thin divider and collapse motion

Visible divider is2px; the independent thumb is16x36px (36x16px vertically) and the transparent separator hit area remains12px. SVG disclosure direction follows the layout and collapsed state. At the collapsed edge both the thumb and drag target stay inside the component. Pane flex-basis transitions run280ms for collapse/restore and model/keyboard changes; pointer dragging and reduced-motion preference disable transitions. Root-state CSS uses direct children to avoid affecting nested Splitters. Vertical demo now also demonstrates collapse/restore.

Two new browser checks failed before implementation, then passed with intermediate animation frames, restore size, thin divider/button geometry, edge button visibility, pointer dragging without transition lag, keyboard collapse and reduced motion. Existing5 Splitter unit checks passed. Both production builds and documentation contracts/typechecks passed. Light/dark screenshots at1440/390px inspected.


## InfiniteScroll paginated business example (final simplified design)

User requested a paginated business scenario, then explicitly asked for plain ul/li, two or more field references and minimal methods. Final Pagination.vue uses only ZtInfiniteScroll with product name and stock, stable id keys,25 records and10 per page. One load(signal) function simulates {code,message,data:{list,total,page,pageSize}}, appends records and advances the successful page. A computed finished flag stops at total; AbortSignal guards unmount. No table, filters or API inspector are included in the final demo.

Final verification:434 documentation example/content checks,2 browser checks (field rendering, rapid duplicate scroll events,10→20→25 unique records, finished state,390/320px dark widths) and the documentation production build passed. Existing4 InfiniteScroll unit checks passed; component implementation was not changed. Screenshots inspected.


## InfiniteScroll global appearance inheritance

User noticed that size/radius had no visible effect. InfiniteScroll previously fixed its font to the default token and exposed no size prop; example rows/padding and outer radius were hardcoded. Added shared useZtSize(props) inheritance and explicit override, five density styles for text/status/retry and inherited item-padding variables. Density changes recheck geometry while respecting existing pending/disabled/finished/error guards. No arbitrary slot styles are overridden. Root/default retry radius remains token-derived; every InfiniteScroll demo viewport now uses --zt-radius, and sample rows consume inherited text/padding.

A provider/override unit regression failed before implementation and passed afterwards. Final checks:5 focused InfiniteScroll units,434 docs content/standalone checks and3 browser checks passed. Browser measures all five font sizes, monotonically increasing row heights,0/max radius, inherited status/error text, paging to25 unique records, dark390/320px fit. Library/docs builds and411-component contract audit passed with zero unwaived violations.


## Image preview controls and image-switch motion

Preview controls now provide hover/press feedback, directional navigation glyph motion, close rotation and rotate-button feedback in a compact glass toolbar. Icons use explicit 20px sizing. Image changes use independent directional frame translation/crossfade, preserving the separate zoom/rotation transform. Incoming uncached images load before replacing the displayed frame; loading/error states, rapid reversal, duplicate URLs, stale events and returning to a failed outgoing image are handled. Dynamic alternative text remains reactive. Reduced-motion preference disables transitions; controls fit 320px viewports. Thumbnail hover-preview class and direct backdrop dismissal were corrected.

Verification: new failures reproduced backdrop/list handling, failed outgoing image retry and reactive alternative text before their respective fixes. Final 43 targeted library tests, 27 site tests and 4 Edge browser tests passed. Browser checks measured intermediate animation/hover/press states, directional wrap and rapid reversal, slow image retention, reduced motion, narrow dark layout and focus restoration. Desktop/mobile screenshots inspected. Library and site production builds including typechecks and documentation extraction/content validation passed; focused diff whitespace checks passed.


## Tour target spotlight alignment

User reported that starting the Tour did not align the spotlight with its element. Browser reproduction measured a6.59px top mismatch: Basic.vue targeted ordinary inline span wrappers, whose line boxes did not contain the complete inline-flex buttons. Both target wrappers now use inline-flex and vertical-align:middle, so their measured dimensions exactly match the actual buttons. Tour component geometry logic remains unchanged.

The new browser regression failed before the fix. Final5 existing Tour units and2 Edge browser checks passed. Browser checks cover all five button sizes at1440/390px, exact4px spotlight padding, target edge hit testing and actual button actions through the hole, next-step alignment, scroll tracking, completion/Escape focus restoration. Desktop/mobile screenshots inspected; site production build/typecheck and scoped whitespace checks passed.


## Backtop local demo positioning

User reported a Backtop problem and clarified that button position/display was wrong. Initial browser checks confirmed basic scrolling and click behavior already worked. Both local-list examples placed their buttons at viewport-fixed coordinates, visually separating them from their corresponding lists and leaving unrelated buttons together at the window edge. Added explicit position:'fixed'|'absolute' (default fixed) so local usage can anchor to a relative wrapper without changing page-level positioning. Both demos now use independent relative wrappers and absolute buttons16px from their list edges; containers retain global radius styling. Usage and prop documentation distinguish the two modes.

The new containment regression failed before implementation (button right1412 vs list right1179). Final3 Backtop/Anchor units and2 Edge browser checks passed. Browser checks verify exact local offsets, page-scroll tracking, threshold behavior, independent simultaneous lists, correct target return/callback, unaffected page scroll and390px dark layout. Screenshots inspected; both production builds/typechecks and scoped whitespace checks passed.


## ColorPicker single popup border, underline and initial color spectrum

User requested removal of nested popup borders and underline support, then reported that ColorPicker/ColorPickerPanel hue was not apparent until interacting. Popover now owns the floating border/padding while its directly owned ColorPickerPanel drops only its nested border; standalone panels retain their own surface. Added tri-state underline to ColorPicker through the shared Form appearance boundary and underline mixins, including explicit false, focus/open and disabled states. Panel prop types omit this trigger-only appearance flag. A new demo shows standalone underline, Form inheritance and explicit outlined override.

The hue control previously used a native single-color range track. Shared panel sliders now render the complete rainbow immediately, with initial current-color thumb positions. Alpha uses a transparent-to-current-color gradient over checkerboard. Native range semantics and keyboard editing remain intact, with separate WebKit/Firefox track/thumb rules.

Expected failures were observed for nested borders, missing public underline behavior and missing initial hue gradients. Final76 focused library tests and5 Edge browser checks passed, covering public boolean types and Form overrides/boundaries, standalone vs popup borders, color confirmation/focus restore, 320px dark fit, initial hue/alpha rendering before any slider input, Home/End editing and alpha output. Screenshots inspected. Both production builds/typechecks and scoped whitespace checks passed.
