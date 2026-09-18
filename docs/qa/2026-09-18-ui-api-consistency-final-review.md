# UI/API consistency — final review and bounded fix wave

The independent whole-branch review of `3e8d02e..4fa01ba` found **0 Critical, 2 Important and 2 Minor** issues. Both Important findings have been fixed in this bounded wave, with failing regressions first. **No Critical or Important finding remains open in the fix report.** Independent re-review of these fixes supplies the final merge verdict; this implementer evidence does not replace it.

## Findings and disposition

| Finding | Disposition and regression evidence |
| --- | --- |
| **I1 — nested teleported Popover ownership** | Fixed. Popup-slot descendants register through the existing `OverlayBranch` / `overlayContextKey` graph and propagate to containing Modal scopes. Descendant targets count as inside the parent; Escape is left to the innermost visible branch; parent close/unmount closes owned descendants and releases registrations. Trigger-slot children keep their surrounding context. Placement, dimensions, observation and scrolling remain with Popover. `tests/popover-nested-ownership.spec.ts` covers action delivery and child-only Escape/focus inside/outside Modal, persistent parent cleanup/reopen/unmount, and nested Tooltip manual Escape. |
| **I2 — mobile status dialog below the header** | Fixed. The open mobile controller Teleports directly to the document-level `.doc-site` theme root, outside `.doc-layout`'s fixed stacking context. It retains inherited theme tokens; the closed pill and desktop region return to their original location. `site/src/components/DemoStatusController.spec.ts` covers the actual theme-root/layout boundary, state, keyboard containment, focus restoration, breakpoint changes and unmount cleanup. Native production-site pointer tests below establish the CSS layering. |
| **M1 — evidence wording** | Resolved. The browser matrix and local Task 9 report now identify each harness's actual error channels, the dedicated Tooltip fixture's in-memory Vite CSS, and the 30 custom-fill cases that assert disabled/loading depth-image removal. No broad matrix was rerun for this prose correction. |
| **M2 — large site chunks** | Carried nonblocking limitation. The successful final site build still warns about chunks above 500 kB (approximately **645.99 kB** and **2,376.59 kB**). No bundling changes or warning suppression were made. |

## RED → GREEN proof

Before production changes, the new Popover suite failed **5 of 6** tests: nested pointer action loss (both Modal modes), both layers closing on standalone Escape, persistent children surviving parent close, and Tooltip Escape closing its parent. The existing Modal Escape case already passed and was retained as an integration guard. The new controller boundary test failed because the modal still had `.doc-layout` as an ancestor; its other **13** tests passed.

After the fixes, the focused Popover/overlay suites passed **47 tests**, and the controller suite passed **14 tests**. The complete final gates below also passed. Full RED/GREEN logs are retained in the ignored SDD workspace as `task-10-popover-red.log`, `task-10-status-red.log`, `task-10-popover-green.log` and `task-10-status-green.log`.

## Native Chromium proof

Microsoft Edge **153.0.4234.32** / native Chromium, Playwright **1.62.1**, Node **v22.15.0**, macOS arm64. The Popover fixture used the production library CSS plus an in-memory Vite-compiled fixture and Vue production runtime. The controller probe served the current production `site/dist` from an ephemeral loopback server. Both probes listened for page exceptions, console errors/warnings and failed requests; **zero** were recorded.

- **Nested Popover, 900×700, standalone and inside Modal:** a real pointer click delivered `action` while both popups remained visible. Escape produced only `child:false`, left one visible popup and focused `inner-trigger`. Closing the parent hid both persistent branches and restored `outer-trigger`; reopening exposed only the parent; unmount left zero popup nodes.
- **Mobile controller, 390×844, light and dark:** all **six** header hit-tests (navigation, search and appearance × two themes) returned `demo-status__backdrop`. A real coordinate click dismissed the backdrop without activating the underlying control. A subsequent direct click activated each header control normally. The selected status persisted; Tab stayed in the dialog; Escape restored the pill. Desktop resize moved the controller back into the layout and focused the selected radio; route unmount removed the backdrop and restored header usability.
- **Theme and visual verification:** light panel `rgb(255, 255, 255)`; dark panel `rgb(58, 67, 80)`. The corrected screenshots were visually inspected, including the now-masked header: [light](./2026-09-18-status-mobile-fixed-light.png), [dark](./2026-09-18-status-mobile-fixed-dark.png).

Reproduction scripts and complete JSON results are retained alongside the original reviewer probes in `.superpowers/sdd/2026-09-18-ui-api-consistency-and-demo-rebuild/`: `task-10-popover-fixed-browser.mjs`, `task-10-popover-native-green.log`, `task-10-status-fixed-browser.mjs`, `task-10-status-native-green.log`. The original failing probes/logs remain unmodified.

## Final gates

Commands use `PATH=/Users/stev/.nvm/versions/node/v22.15.0/bin:/usr/bin:/bin:/usr/sbin:/sbin`. The SDD fix report records the exact implementation/evidence commit and the subsequent exact-HEAD gate output; tracked source is unchanged during verification.

| Gate | Result |
| --- | --- |
| Library `npm test` | **126 files / 1311 tests passed** |
| Library `npm run build` | Typecheck, ESM/declarations and UMD passed |
| Site `npm test` | **20 files / 659 tests passed** |
| Site `npm run build` | API/examples generation, typecheck and production build passed; disclosed chunk warning only |
| Root `npm run audit:components` | **126 public components** (94 SFC + 32 SVG), **0 unwaived violations** |
| Site `npm run docs:api` and `npm run docs:examples`; before/after SHA256 comparison | **0 drift**; 79 API pages, 80 example pages, 339 live + 1 integration examples |
| `git diff --check` | Passed |
| `git status --short` after commit and exact-HEAD gates | Clean |

Generated hashes remain `00b44f16b16274f7fb94724d958945f5b11def41cff8a4d8288a9cb9d18adbce` for `site/src/docs/api.generated.json` and `048362ee894e6735be959997ab401a764dee65d1c7362e3cef1243c46f3960cb` for `docs/component-examples-audit.md`.

## Limits

The broad Task 9 matrix remains the earlier recorded evidence; this wave adds focused missing interactions and reruns all required final gates. No Safari/Firefox, physical mobile touch/virtual keyboard, screen-reader speech or exhaustive accessibility certification is claimed. Native screenshots are inspected evidence, not golden pixel comparisons. The approved tiny-viewport SelectBox fixed-chrome clipping ruling remains unchanged. No push, deployment or publication was performed.
