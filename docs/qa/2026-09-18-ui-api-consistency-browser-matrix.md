# UI/API consistency browser matrix — 2026-09-18

Result: all recorded checks passed. A duplicate API/Types anchor defect discovered during QA was fixed and the complete page matrix rerun. No console errors, page exceptions, failed network requests, or browser warnings occurred in the successful final runs.

## Runtime and method

- Microsoft Edge **153.0.4234.32**, native Chromium, headless on **macOS arm64**; Playwright **1.62.1**, Node **v22.15.0**.
- Documentation: production `site/dist`, served by Vite preview at `127.0.0.1:4199`, using production hash routes. Clipboard permission was granted to the local browser context; actual `navigator.clipboard.readText()` was compared with displayed code.
- Component fixtures: production `dist/zt-ui.css`, Vue production runtime and Vite-compiled component code. Assertions read native computed styles, layout rectangles, scroll dimensions, focus and native pointer/keyboard states; these are not Happy DOM results.
- Sizes: `mini`, `small`, `default`, `medium`, `large`. Themes: `light`, `dark`. Radius boundaries: **0, 3, 4, 8, 9, 16px**.
- Desktop: **1440×1000**. Responsive phone viewport: **390×844**. Additional geometry viewports: **1000×800**, **800×600**, **390×400**, **390×180**, **320×240**.
- [Machine-readable evidence](./2026-09-18-ui-api-consistency-browser-evidence.json) records every page visit, each SelectBox measurement and all Tooltip placement cases. Local reproduction harnesses and full logs are in `.superpowers/sdd/2026-09-18-ui-api-consistency-and-demo-rebuild/task-9-*` in the implementation workspace.

## Coverage and measured results

| Area | Matrix / action | Evidence / result |
|---|---|---|
| Underline props and precedence | All 15 controls × 2 themes × 5 sizes × 6 radii × 2 disabled states × 5 precedence cases | **9000 checks passed**. Cases: explicit true outside an underline Form, explicit false inside one, omitted/inherited true, omitted/plain false, nested Form reset. Exactly one public underline marker when enabled; no marker when disabled by appearance precedence. Native top/left borders 0px, bottom 1px, radius 0px; disabled bottom line dashed. |
| Underline validation and isolation | All 15 controls inside FormItem with external error; SelectBox opened under underline | **15 validation/appearance boundaries passed**; error state retained with decorative success. Input Tab reaches its accessible error indicator. SelectBox search and teleported auxiliary controls do not acquire the outer underline marker. Screenshot below shows red validation lines. |
| Button depth | 2 themes × 5 sizes × 6 radii × 6 visual statuses × 2 shapes | **720 base cases passed**; each also checked disabled/loading: native disabled, opacity .5, shadow removed, depth image removed, base fill retained. Radii 0/3 flat; 4/8 subtle; 9/16 raised. |
| Button interaction | 6 radii × 2 shapes × 2 motion preferences, primary/default-size/light representative | **24 native hover/pressed/focus cases passed**. Hover and pressed fills differ; keyboard outline 2px; reduced motion removes button/icon movement. Exact shadow values checked, not just inequality. Nested theme/radius reset and close-button feedback passed. |
| Button custom fills | 5 colored hooks × 3 representative radii (0/4/9) × 2 shapes | **30 cases passed**, including hover, disabled and loading. Inherited custom gradients remain separate from the radius-owned depth layer. |
| SelectBox regular / flip | 2 themes × 5 sizes, top=30px then top=740px in 1000×800 | **20 geometry cases passed**. Bottom direction with space; flips above near the bottom. Root and panel `overflow-y: hidden`; options region is the only scroll owner. Scrolling to the last option retains the true bottom scroll position after remeasurement. |
| SelectBox narrow / constrained | 390×400, trigger top=184px; 390×180, trigger top=80px | Both sides constrained without page growth or trigger overlap. Tiny case panel rect **left 8, right 382, top 8, bottom 80px**; page remains **390×180**. Panel client height **70px**, clipped content height **236px**, list client height **8px**. |
| SelectBox modes and updates | Selected-only, paste, local empty, remote loading/error/empty; next page, page-size change, resolving remote results, actual page scroll | **33 total recorded SelectBox probes passed**, including the 22 geometry probes above. Selected-only renders two selected options; pasted text is the sole scroll owner. Next page starts at Option 100; page-size update renders 20 items; resolving remote request renders 20 results. A pre-existing 1800px document stays 1800px; scrolling 50px updates trigger and popup geometry without growth. |
| Tooltip placements | 2 themes × 5 sizes × 12 placements | **120 cases passed**. Explicit outer size **160×80px** remains exact; all top/bottom/left/right start/center/end placements resolve correctly with sufficient space. |
| Tooltip content and lengths | Short/long/unbroken content, number, rem/em, calc/vh, dynamic slots/props, constrained viewport | Short content remains under 150px wide; long content wraps. Numeric size **84×96px**. `28rem` / `7em` measured **448×91px**. `calc(100vw - 40px)` / `50vh` measured **760×300px**. 700×600 requested in 320×240 viewport is constrained to **304×224px** at **8,8px**. Only content scrolls; arrow/root stay fixed. |
| Tooltip flipping / focus | All four directions near viewport edges; inside Modal; focus/Escape/reopen | Four flips passed with arrow aligned to trigger center. Dynamic content recenters; numeric size update repositions. Escape dismisses Tooltip while its containing Modal remains open; focus description clears and hover reopens. |
| Page shells and source panels | 79 component pages + external feedback guide × desktop/phone × light/dark | **320 visits passed**. Each component route has one shell, one shell title, purpose/guidance/examples/design+accessibility/API/related sections. Feedback keeps its guide layout. All displayed sources checked for site-only provider imports. |
| API / Types anchors | 79 component pages × 4 theme/viewport combinations after fix | **316 component visits passed**. One canonical `section#api`, named by `h2#api-title`; when types exist, one `section#types`, named by `h3#types-title`. No duplicate API/Types IDs. |
| Desktop status control | Six selections on Radio; keyboard Home/End/ArrowRight; subsequent Checkbox navigation | 3-column, 2-row layout; all six visual statuses select correctly and synchronize live Radio examples and source. Background, outline, check and `aria-checked` identify selection. Status persists across navigation. |
| Controller exclusions | Button, Tag, Steps, Result, Input, Password | No controller on all six routes. Button/Tag matrices remain; business/validation vocabularies stay separate. Catalog capability/default fallback is also covered by unit tests. |
| Real copied source | First example on **all 34 eligible pages** | Native clipboard exactly matches displayed standalone Vue source after status selection; no `useDemoStatus` or site provider dependency. The full generated example audit independently compiles/parity-checks **339 live + 1 integration examples**. |
| Mobile status control | Pill → dialog; choose success; Tab cycle; programmatic external focus; Cmd+K; Escape; resize to desktop | Modal panel opens with selected choice focused; focus stays inside; search shortcut is suppressed; selection updates pill/live example; Escape restores pill focus. Desktop resize restores selected radio focus and region semantics. |
| Global appearance | 2 themes × 5 sizes × 6 radii | **60 production-site cases passed**, using persisted config + reload. Provider theme, size class and radius token match the requested setting. |

The 15 underline controls are Input, Password, InputNumber, InputTag, InputOtp, Select, SelectBox, Autocomplete, Cascader, TreeSelect, DatePicker, DateTimePicker, TimePicker, TimeSelect and Mention.

The 34 copied-source pages are Icon, Link, Text, Popconfirm, Tabs, Segmented, Avatar, Upload, InputOtp, Menu, Slider, Progress, Badge, Radio, Checkbox, Switch, Pagination, DatePicker, DateTimePicker, Typography, Alert, Tree, Cascader, TreeSelect, Transfer, Autocomplete, InputTag, Mention, Rate, TimeSelect, TimePicker, ColorPicker, DatePickerPanel and ColorPickerPanel. Every individual shell route is enumerated in the evidence JSON.

## Fixed-chrome ruling and deferred review item

When the viewport is physically shorter than SelectBox's fixed chrome, clipping is intentional: the popup stays within the viewport and does not overlap the trigger or enable whole-panel scrolling. The 390×180 probe confirms this behavior; some fixed controls cannot be reached until more viewport height is available. This is the approved Task 3 ruling and is now explicit in public guidance.

Task 4's deferred Minor is **closed by exact native-browser shadow assertions**. For radii 4/8 the hover shadow was exactly `inset 0 1px 0 rgba(255,255,255,.12), 0 1px 0 rgba(0,0,0,.09)`; for 9/16 it was `inset 0 1px 0 rgba(255,255,255,.2), 0 4px 10px rgba(0,0,0,.18)`. Every non-flat pressed case was exactly `inset 0 1px 2px rgba(0,0,0,.12)`; 0/3 had `none`. Native normalized computed values were compared for both shapes and both motion preferences. No Button implementation adjustment was needed.

## QA-discovered anchor fix

The App heading collector assigned `api` and `types` to headings inside sections already owning those IDs. The route regression failed on all **79** component pages before the fix. ApiReference now provides deterministic heading IDs and explicit section naming, preserving the existing public `#api` / `#types` section anchors. The focused suite passed **105** checks after the fix; the full site suite/build and final 316-visit native anchor matrix passed.

## Visual evidence

The screenshots were inspected at native browser resolution. Status screenshots were captured after transitions settled and after asserting that live examples and the selected choice both use success.

- [Desktop light](./2026-09-18-status-desktop-light.png) · [Desktop dark](./2026-09-18-status-desktop-dark.png)
- [Phone light](./2026-09-18-status-mobile-light.png) · [Phone dark](./2026-09-18-status-mobile-dark.png)
- [SelectBox list](./2026-09-18-select-box-list.png) · [Tiny viewport clipping](./2026-09-18-select-box-tiny.png)
- [Underline validation in dark theme](./2026-09-18-underline-validation-dark.png) · [Tooltip inside Modal](./2026-09-18-tooltip-nested.png)
- [Button custom-fill diagnostic](./2026-09-18-button-custom-gradients.png) — synthetic long labels intentionally exceed circle widths; this image checks fill/depth separation, not icon-label layout.

## Gates and limitations

| Gate | Final result |
|---|---|
| Library `npm test` | **125 files / 1305 tests passed** |
| Library `npm run build` | Typecheck, ESM + declarations, UMD passed |
| Site `npm test` | **20 files / 658 tests passed** |
| Site `npm run build` | API/example generation, typecheck, production build passed |
| `npm run audit:components` | **126 public components** (94 SFC + 32 SVG), **0 unwaived violations** |
| Regenerate API/examples and compare hashes | **0 drift**; 79 generated API pages; 80 example pages |
| `git diff --check` | Passed |

Coverage is native Chromium on desktop hardware with responsive viewports; Safari, Firefox, physical mobile touch/virtual keyboards and screen-reader speech were not tested. Not every possible interaction is tested in every Cartesian combination: the table states each actual combination. Screenshots are visual inspections, not pixel-diff golden tests. Site build retains its existing >500kB chunk-size warning; it does not fail the build. No push, deployment or publication was performed.
