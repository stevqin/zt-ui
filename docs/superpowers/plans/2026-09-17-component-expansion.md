# Component Expansion Implementation Plan

> **For agentic workers:** Execute each isolated task with tests and review. Independent file ownership permits parallel work; shared exports, catalog, API registration and dependency changes are owned by the coordinator.

**Goal:** Deliver all 45 approved additions/capability extensions, with working source-matched demos and API documentation.
**Architecture:** Reuse existing ConfigProvider, Form and overlay. Feature-owned component directories contain types, implementation and tests; coordinator integrates package exports and documentation metadata.
**Tech Stack:** Vue 3, TypeScript, SCSS, Vitest, Vite.
**Spec:** ../specs/2026-09-17-component-expansion-design.md (approved by user).

## Global Constraints

- Preserve existing 38 components. No native browser select/date/color popups for new controls.
- Five sizes, six semantic statuses where meaningful, light/dark and radius inheritance; accessible keyboard and mobile interaction.
- Every interactive public behavior gets meaningful regression tests, including empty/disabled/async/unmount cases as applicable.
- Demo component and code import the same Vue SFC via ?raw; each example declares all state, events, assets and scoped styles.
- No service requests/credentials in ConfigProvider. No business network calls in demos.
- Agent-owned files only: component directories and matching site view directories; coordinator exclusively owns exports, catalog, router, API registration, dependencies and builds.
- No agent commits or pushes; coordinator verifies and commits complete milestones.

## Execution and checks

Use Node via PATH=/Users/stev/.nvm/versions/node/v22.15.0/bin:$PATH. Each task first writes its behavior tests, runs them to record expected failure, then implements until they pass. Use `npm test -- src/components/<id>/<id>.spec.ts`, then `npm run typecheck`. Each SFC exports Props from types.ts and default component via index.ts. Existing tokens and useZtSize/useZtConfig supply appearance. Feature tests import local files so integration can follow independently.

## Task 1: foundation

Components/capabilities: Layout Row Col Space Divider Card Splitter Typography Empty Skeleton Statistic. Required behavior: all corresponding rows and common rules in the approved spec.

- [x] Create typed public contracts and failing behavior tests in the owned `src/components/<component>/` directories. Cover the concrete spec interactions rather than only mounting.
- [x] Implement the public components and child components in that directory; `index.ts` exposes components and types.
- [x] Add independent working `site/src/views/<component>/` example SFCs, including advanced and edge scenarios.
- [x] Run focused tests, inspect failures, complete all behavior, and report commands/results plus exported API names.
- [x] Review spec compliance and implementation quality; fix findings before acceptance.

## Task 2: feedback

Components/capabilities: Alert Loading Message Notification MessageBox Tooltip Dropdown. Required behavior: all corresponding rows and common rules in the approved spec.

- [x] Create typed public contracts and failing behavior tests in the owned `src/components/<component>/` directories. Cover the concrete spec interactions rather than only mounting.
- [x] Implement the public components and child components in that directory; `index.ts` exposes components and types.
- [x] Add independent working `site/src/views/<component>/` example SFCs, including advanced and edge scenarios.
- [x] Run focused tests, inspect failures, complete all behavior, and report commands/results plus exported API names.
- [x] Review spec compliance and implementation quality; fix findings before acceptance.

## Task 3: hierarchy

Components/capabilities: Tree Cascader TreeSelect Transfer. Required behavior: all corresponding rows and common rules in the approved spec.

- [x] Create typed public contracts and failing behavior tests in the owned `src/components/<component>/` directories. Cover the concrete spec interactions rather than only mounting.
- [x] Implement the public components and child components in that directory; `index.ts` exposes components and types.
- [x] Add independent working `site/src/views/<component>/` example SFCs, including advanced and edge scenarios.
- [x] Run focused tests, inspect failures, complete all behavior, and report commands/results plus exported API names.
- [x] Review spec compliance and implementation quality; fix findings before acceptance.

## Task 4: entry

Components/capabilities: Autocomplete InputTag Mention Rate TimeSelect. Required behavior: all corresponding rows and common rules in the approved spec.

- [x] Create typed public contracts and failing behavior tests in the owned `src/components/<component>/` directories. Cover the concrete spec interactions rather than only mounting.
- [x] Implement the public components and child components in that directory; `index.ts` exposes components and types.
- [x] Add independent working `site/src/views/<component>/` example SFCs, including advanced and edge scenarios.
- [x] Run focused tests, inspect failures, complete all behavior, and report commands/results plus exported API names.
- [x] Review spec compliance and implementation quality; fix findings before acceptance.

## Task 5: datetime-color

Components/capabilities: TimePicker ColorPicker DatePickerPanel ColorPickerPanel. Required behavior: all corresponding rows and common rules in the approved spec.

- [x] Create typed public contracts and failing behavior tests in the owned `src/components/<component>/` directories. Cover the concrete spec interactions rather than only mounting.
- [x] Implement the public components and child components in that directory; `index.ts` exposes components and types.
- [x] Add independent working `site/src/views/<component>/` example SFCs, including advanced and edge scenarios.
- [x] Run focused tests, inspect failures, complete all behavior, and report commands/results plus exported API names.
- [x] Review spec compliance and implementation quality; fix findings before acceptance.

## Task 6: data

Components/capabilities: Table Timeline Calendar. Required behavior: all corresponding rows and common rules in the approved spec.

- [x] Create typed public contracts and failing behavior tests in the owned `src/components/<component>/` directories. Cover the concrete spec interactions rather than only mounting.
- [x] Implement the public components and child components in that directory; `index.ts` exposes components and types.
- [x] Add independent working `site/src/views/<component>/` example SFCs, including advanced and edge scenarios.
- [x] Run focused tests, inspect failures, complete all behavior, and report commands/results plus exported API names.
- [x] Review spec compliance and implementation quality; fix findings before acceptance.

## Task 7: navigation-media

Components/capabilities: Anchor Affix Backtop PageHeader InfiniteScroll Carousel Tour Watermark QRCode. Required behavior: all corresponding rows and common rules in the approved spec.

- [x] Create typed public contracts and failing behavior tests in the owned `src/components/<component>/` directories. Cover the concrete spec interactions rather than only mounting.
- [x] Implement the public components and child components in that directory; `index.ts` exposes components and types.
- [x] Add independent working `site/src/views/<component>/` example SFCs, including advanced and edge scenarios.
- [x] Run focused tests, inspect failures, complete all behavior, and report commands/results plus exported API names.
- [x] Review spec compliance and implementation quality; fix findings before acceptance.

## Task 8: virtual

Components/capabilities: SelectVirtual TreeVirtual. Required behavior: all corresponding rows and common rules in the approved spec.

- [x] Create typed public contracts and failing behavior tests in the owned `src/components/<component>/` directories. Cover the concrete spec interactions rather than only mounting.
- [x] Implement the public components and child components in that directory; `index.ts` exposes components and types.
- [x] Add independent working `site/src/views/<component>/` example SFCs, including advanced and edge scenarios.
- [x] Run focused tests, inspect failures, complete all behavior, and report commands/results plus exported API names.
- [x] Review spec compliance and implementation quality; fix findings before acceptance.

## Task 9: Integration, documentation and release

- [x] Register all feature exports in src/components/index.ts and verify declaration generation.
- [x] Update site catalog and lazy routes; retain existing paths; migrate completed roadmap entries only after acceptance.
- [x] Extend API generator/metadata for each owner, including service APIs; generate exact signatures and defaults.
- [x] Add Form comprehensive validation coverage and cross-component business scenarios.
- [x] Replace fixed component counts/assertions with complete directory/export/catalog coverage.
- [x] Run root npm test/build and site npm test/build; source audit must cover every live demo.
- [x] Browser verify representative complex behaviors, all new pages, 390px, dark/light, size, overlays and focus restoration.
- [ ] Commit verified implementation, integrate into main without discarding unrelated work, push and verify Pages workflow plus live website.

## Progress ledger

- Scope approved; isolated branch feat/component-expansion created from 239429b.
- Ownership review: tasks share only stable ConfigProvider/Form/overlay interfaces; shared registrations are coordinator-only. TreeSelect/Cascader depend on Tree contract; virtual tree is sequenced after Tree. ColorPickerPanel shares ColorPicker implementation; DatePickerPanel reuses existing date implementation.

### Execution checkpoint 10:46

- Workspace: /Users/stev/Desktop/anzheng/code/bip/zt-ui-expansion, branch feat/component-expansion. Main repo remains /Users/stev/Desktop/anzheng/code/bip/zt-ui at 239429b. Do not publish until all 45 items accepted.
- Foundation agent: 11 implementations + 22 tests + 22 demos reported; now owns navigation/media 9. Report foundation-report.md. Needs cross-review before accept.
- Hierarchy agent: Tree/Cascader/TreeSelect/Transfer + Tree virtual, 18 tests +9 demos reported; now owns Table/Timeline/Calendar. API comments and status/size compliance fixes requested. Report hierarchy-report.md.
- Entry agent: Autocomplete/InputTag/Mention/Rate/TimeSelect +16 tests +20 demos reported; now owns TimePicker/ColorPicker/DatePickerPanel/ColorPickerPanel. API comments + status compliance fixes requested. May modify DatePickerBase additively for inline panel. Report entry-report.md.
- Coordinator implemented Alert/Loading/Message/Notification/MessageBox/Tooltip/Dropdown +14 demos; tests/feedback-expansion.spec.ts 9 pass. No independent review yet.
- Coordinator added Select virtual/itemHeight/height +Virtual.vue demo; tests/select-virtual.spec.ts 2 pass and original Select tests 29 pass.
- Added Popover restoreFocus flag for input suggestion integration; entry agent covers blur regression.
- Root install complete; site install complete. Added qrcode dependency and @types/qrcode,jsqr test deps. Foundation notified.
- Shared integration underway: expansion.json registers completed dirs (regenerate using /private/tmp/zt-register.py; final target 43 new doc entries +2 virtual extensions =45 scope). Catalog/routes use expansion.json. Generator extended imported emit signatures and service Options APIs; new metadata expansion.mjs. API gate currently fails missing source descriptions while agents add them.
- Helpers in /private/tmp are execution scripts only, not deliverables. Do not rerun feedback creation scripts: they overwrite subsequent fixes. Registration script safe to rerun as new pages land. integration.py is NOT idempotent.
- Outstanding coordinator: complete API metadata/exposes, service docs default accuracy, all new form integrated validation, review feedback internals and all agent specs, browser all pages/mobile/theme, root/site full test/build, formatting, commit/integrate/push/deploy.


### Acceptance checkpoint

- All 45 approved capabilities implemented: 41 new components/services and 4 extensions. Independent reviews and regression fixes are recorded in the adjacent reports.
- Library exports and public declaration generation cover every addition. API generator now reads typed emits, explicit slots and service options/methods.
- Documentation contains 81 pages, 336 executable Vue examples and one integration-only example. Every live demo uses its own source through `?raw`.
- Form includes the ten new input controls with required/custom validation, reset and disabled state.
- Browser: all 43 new documentation routes loaded without console errors. TreeSelect open/Escape, ten-field Form validation, 390px TimePicker/ColorPicker, dark/light and mini/default settings checked; temporary viewport and settings restored.
- Full library suite: 94 files / 606 tests passed. Full site suite: 15 files / 472 tests passed. Library build has no declaration diagnostics; GitHub Pages-base site build passed. Explicit-slot changes additionally passed 11 targeted tests.
- Remaining delivery step: commit, fast-forward main, push and confirm the matching Pages workflow plus deployed website.
