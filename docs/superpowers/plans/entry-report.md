# Entry subsystem report — 2026-09-17

Implemented all five assigned rows: Autocomplete, InputTag, Mention, Rate, TimeSelect.

## Public exports

- `ZtAutocomplete`, `ZtAutocompleteProps`, `ZtAutocompleteOption`, `ZtAutocompleteSource`, `ZtAutocompleteInstance`.
- `ZtInputTag`, `ZtInputTagProps`.
- `ZtMention`, `ZtMentionProps`, `ZtMentionOption`, `ZtMentionSource`, `ZtMentionInstance`.
- `ZtRate`, `ZtRateProps`.
- `ZtTimeSelect`, `ZtTimeSelectProps`.

Each has a local `index.ts` for component and type exports.

## Behavior

Autocomplete and Mention share cancellable query state. New queries, composition start, blur, Escape/Tab, disabled/readonly, and unmount invalidate requests. AbortSignal reaches user callbacks; generation tokens also reject late results from noncooperative sources. Loading, empty and error states render plain text. Arrow keys skip disabled options, Home/End choose list boundaries, Enter selects and IME Enter does not. Active options scroll into view. Existing Popover supplies positioning, theme and overlay registration; `restoreFocus=false` supports text-combobox blur/Tab behavior.

InputTag splits paste/Enter/separator submissions, trims blank tokens, deduplicates exact strings by default, enforces max count, emits limit when discarding excess, deletes via buttons or empty Backspace, supports readonly/disabled and IME protection. Draft edits do not trigger Form change validation; committed arrays do. Empty value is [].

Mention inserts only prefix-to-caret and retains following text; supports multiple string prefixes, local/async sources, selection payload and plain textarea text. Rate supports pointer half selection, custom icon slot, text labels, keyboard half steps/bounds, repeat-click/Delete clearing and form errors. TimeSelect delegates all popup/search/clear/keyboard behavior to existing Select; strict HH:mm generation prevents zero-step loops, includes end only on grid, exclusive min/max and inclusive disabled intervals. Empty time is null.

All components inherit Form size/disabled and validation; ConfigProvider appearance flows through existing Input/Select/Popover or shared tokens. Four source-matched, standalone examples per component cover basic events, advanced boundaries, all sizes/theme and Form validation.

## Verification

- RED: initial five suites failed due missing implementations before writing production code.
- RED: additional Home/End navigation test failed, then implemented.
- RED: InputTag draft validation test failed, then isolated draft validation from committed tags.
- GREEN: `npx vitest run src/components/{autocomplete,input-tag,mention,rate,time-select}/*.spec.ts` — 5 suites, 16 tests passed.
- GREEN: library `npm run typecheck` passed.
- Site SFC example audit passed: 61 pages / 272 live examples at time of execution. Initial site typecheck caught union-array syntax in TimeSelect Appearance; fixed.
- Site `npm run typecheck --prefix site` passed after fix.

Documentation generation runs in the site's prebuild hook; API coverage depends on metadata registrations. Full integrated builds and browser review are outside the scope of this report.

## Follow-up acceptance fixes

Added `ZtEntryStatus` six semantic statuses to all five entry controls, concrete focus/selected/tag/star colors with Form-error priority, and Status.vue demos. Public properties include individual Chinese JSDoc descriptions. Later integrated entry + datetime/color + existing date run passed 118 tests (16 suites); see datetime-color-report.md.
