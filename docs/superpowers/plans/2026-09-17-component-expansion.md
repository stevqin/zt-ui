# Component Expansion Implementation Plan

**Goal:** Deliver all 45 approved additions/capability extensions, with working source-matched demos and API documentation.
**Architecture:** Reuse existing ConfigProvider, Form and overlay. Component directories contain types, implementation and tests; package exports and documentation metadata register the public APIs.
**Tech Stack:** Vue 3, TypeScript, SCSS, Vitest, Vite.
**Spec:** ../specs/2026-09-17-component-expansion-design.md.

## Global Constraints

- Preserve existing 38 components. No native browser select/date/color popups for new controls.
- Five sizes, six semantic statuses where meaningful, light/dark and radius inheritance; accessible keyboard and mobile interaction.
- Every interactive public behavior gets meaningful regression tests, including empty/disabled/async/unmount cases as applicable.
- Demo component and code import the same Vue SFC via ?raw; each example declares all state, events, assets and scoped styles.
- No service requests/credentials in ConfigProvider. No business network calls in demos.

## Execution and checks

Use Node via PATH=/Users/stev/.nvm/versions/node/v22.15.0/bin:$PATH. Each task first writes its behavior tests, runs them to record expected failure, then implements until they pass. Use `npm test -- src/components/<id>/<id>.spec.ts`, then `npm run typecheck`. Each SFC exports Props from types.ts and default component via index.ts. Existing tokens and useZtSize/useZtConfig supply appearance. Feature tests import local files so integration can follow independently.

## Task 1: foundation

Components/capabilities: Layout Row Col Space Divider Card Splitter Typography Empty Skeleton Statistic. Required behavior: all corresponding rows and common rules in the approved spec.



## Task 2: feedback

Components/capabilities: Alert Loading Message Notification MessageBox Tooltip Dropdown. Required behavior: all corresponding rows and common rules in the approved spec.



## Task 3: hierarchy

Components/capabilities: Tree Cascader TreeSelect Transfer. Required behavior: all corresponding rows and common rules in the approved spec.



## Task 4: entry

Components/capabilities: Autocomplete InputTag Mention Rate TimeSelect. Required behavior: all corresponding rows and common rules in the approved spec.



## Task 5: datetime-color

Components/capabilities: TimePicker ColorPicker DatePickerPanel ColorPickerPanel. Required behavior: all corresponding rows and common rules in the approved spec.



## Task 6: data

Components/capabilities: Table Timeline Calendar. Required behavior: all corresponding rows and common rules in the approved spec.



## Task 7: navigation-media

Components/capabilities: Anchor Affix Backtop PageHeader InfiniteScroll Carousel Tour Watermark QRCode. Required behavior: all corresponding rows and common rules in the approved spec.



## Task 8: virtual

Components/capabilities: SelectVirtual TreeVirtual. Required behavior: all corresponding rows and common rules in the approved spec.



## Task 9: Integration, documentation and release

- [x] Register all feature exports in src/components/index.ts and verify declaration generation.
- [x] Update site catalog and lazy routes; retain existing paths; migrate completed roadmap entries only after acceptance.
- [x] Extend API generator/metadata for each owner, including service APIs; generate exact signatures and defaults.
- [x] Add Form comprehensive validation coverage and cross-component business scenarios.
- [x] Replace fixed component counts/assertions with complete directory/export/catalog coverage.
- [x] Run root npm test/build and site npm test/build; source audit must cover every live demo.
- [x] Browser verify representative complex behaviors, all new pages, 390px, dark/light, size, overlays and focus restoration.
- [ ] Commit verified implementation, integrate into main without discarding unrelated work, push and verify Pages workflow plus live website.

## Validation summary
