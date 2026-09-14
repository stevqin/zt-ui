# ZtVTableGrid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable `ZtVTableGrid` for Vue 3 on top of VisActor VTable without VXE, Element Plus, or BIP-private dependencies.

**Architecture:** Pure TypeScript modules own data normalization, selection, editing, summaries, column settings, and CSV output. `ZtVTableGrid.vue` connects those modules to `@visactor/vue-vtable`, composes existing zt-ui controls for toolbar and pagination, and exposes generic events and methods rather than business APIs.

**Tech Stack:** Vue 3, TypeScript, Vitest, `@visactor/vtable`, `@visactor/vue-vtable`, `@visactor/vtable-editors`, Sass.

**Spec:** `docs/superpowers/specs/2026-09-14-vtable-grid-design.md`

## Global Constraints

- Do not import VXE Form, Element Plus, Element Plus Icons, xe-utils, BIP APIs, BIP stores, or BIP aliases.
- Keep `vue`, `@visactor/vtable`, `@visactor/vue-vtable`, and `@visactor/vtable-editors` external from the library bundle and declare them as peer dependencies.
- Reuse `ZtButton`, `ZtCheckbox`, and `ZtPagination` for DOM controls.
- Do not bump the package version, publish npm, push GitHub, or deploy the documentation site.
- Every production behavior starts with a failing Vitest test.

---

### Task 1: Dependencies, public types, and data state

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `src/components/vtable-grid/types.ts`
- Create: `src/components/vtable-grid/data.ts`
- Test: `tests/vtable-grid-data.spec.ts`

**Interfaces:**
- Produces: `normalizePagination`, `normalizeQueryResult`, `createLatestQueryRunner`.
- Produces: public `ZtVTableGrid*` generic types used by all later tasks.

- [ ] **Step 1: Write failing data tests**

Test that pagination clamps to positive integers, query results accept `data` or `records`, and only the latest concurrent query applies:

```ts
const runner = createLatestQueryRunner()
const first = deferred<ZtVTableGridQueryResult<Row>>()
const second = deferred<ZtVTableGridQueryResult<Row>>()
const firstRun = runner.run(() => first.promise)
const secondRun = runner.run(() => second.promise)
second.resolve({ data: [{ id: 2 }], total: 1 })
expect(await secondRun).toEqual({ stale: false, data: [{ id: 2 }], total: 1 })
first.resolve({ data: [{ id: 1 }], total: 1 })
expect((await firstRun).stale).toBe(true)
```

- [ ] **Step 2: Run the focused test and verify missing-module failure**

Run `npm test -- --run tests/vtable-grid-data.spec.ts` and expect failure because `vtable-grid/data` does not exist.

- [ ] **Step 3: Add VisActor peer/dev dependencies and public types**

Declare exact-compatible ranges `^1.26.7`. Define props for columns, local/remote records, form data, pagination, models, selection, actions, editing, summaries, column settings, toolbar, and table options. Define event payloads, slot scopes, and exposed methods.

- [ ] **Step 4: Implement the data helpers**

Use finite-number normalization and a monotonically increasing request sequence:

```ts
export function createLatestQueryRunner() {
  let sequence = 0
  return {
    async run<Row>(query: () => Promise<ZtVTableGridQueryResult<Row>>) {
      const current = ++sequence
      const result = normalizeQueryResult(await query())
      return { ...result, stale: current !== sequence }
    },
    invalidate() { sequence += 1 },
  }
}
```

- [ ] **Step 5: Run focused tests and commit**

Run `npm test -- --run tests/vtable-grid-data.spec.ts`, then commit `feat: add vtable grid data model`.

### Task 2: Selection, editing, summaries, settings, and CSV

**Files:**
- Create: `src/components/vtable-grid/selection.ts`
- Create: `src/components/vtable-grid/editing.ts`
- Create: `src/components/vtable-grid/summary.ts`
- Create: `src/components/vtable-grid/column-settings.ts`
- Create: `src/components/vtable-grid/csv.ts`
- Test: `tests/vtable-grid-state.spec.ts`

**Interfaces:**
- Produces: `createSelectionStore`, `createEditStore`, `buildSummaryValues`, `createColumnSettingsStore`, `toCsv`.
- Consumes: row key, columns, edit change, summary, and column settings types from Task 1.

- [ ] **Step 1: Write failing state tests**

Cover keyed selection across page replacement, edit changes that disappear when restored to their original value, sum/avg/count/min/max summaries, persisted column visibility/order, and CSV escaping of commas, quotes, newlines, null values, and spreadsheet formula prefixes.

- [ ] **Step 2: Run the focused test and verify missing-module failures**

Run `npm test -- --run tests/vtable-grid-state.spec.ts`.

- [ ] **Step 3: Implement immutable row snapshots and selection stores**

Use `structuredClone` when available with a recursive array/object fallback. Selection stores rows in `Map<ZtVTableGridRowKey, Row>` and exposes `keys`, `rows`, `replacePage`, `toggle`, `setKeys`, and `clear`.

- [ ] **Step 4: Implement summaries and settings**

Compute only columns with a summary rule. Store settings as `{ order, visible, hidden }`; validate restored keys against current columns and append new columns in declaration order.

- [ ] **Step 5: Implement safe CSV output**

Prefix cells starting with `=`, `+`, `-`, or `@` with a single quote, double embedded quotes, and wrap cells containing delimiters or newlines.

- [ ] **Step 6: Run focused tests and commit**

Run `npm test -- --run tests/vtable-grid-state.spec.ts`, then commit `feat: add vtable grid state helpers`.

### Task 3: Column adapter and VisActor event bridge

**Files:**
- Create: `src/components/vtable-grid/columns.ts`
- Create: `src/components/vtable-grid/editors.ts`
- Test: `tests/vtable-grid-columns.spec.ts`

**Interfaces:**
- Produces: `buildVTableColumns`, `resolveRowKey`, `registerGridEditors`, action-column constants.
- Consumes: columns, settings, action button and editor types from Tasks 1–2.

- [ ] **Step 1: Write failing adapter tests**

Assert fixed-left columns come first, fixed-right columns last, hidden columns are omitted, checkbox and action columns are inserted once, formatter and sort config survive conversion, and editor descriptors map to stable registered editor names.

- [ ] **Step 2: Run the focused test and verify failure**

Run `npm test -- --run tests/vtable-grid-columns.spec.ts`.

- [ ] **Step 3: Implement column conversion without framework icons**

Use `checkbox` for the selection column and a VTable `button` column for actions. Standard action metadata supplies Chinese labels and zt-ui colors; custom actions keep caller text, visibility, disabled state, and handler.

- [ ] **Step 4: Register editors idempotently**

Register text, textarea, date, number, email, URL, and select editors once per module. Dynamic select option signatures reuse cached names.

- [ ] **Step 5: Run focused tests and commit**

Run `npm test -- --run tests/vtable-grid-columns.spec.ts`, then commit `feat: add vtable grid column adapter`.

### Task 4: Vue component shell, local/remote querying, selection, and actions

**Files:**
- Create: `src/components/vtable-grid/ZtVTableGrid.vue`
- Create: `src/components/vtable-grid/vtable-grid.scss`
- Create: `src/components/vtable-grid/index.ts`
- Modify: `src/components/index.ts`
- Test: `tests/vtable-grid.spec.ts`

**Interfaces:**
- Produces: public `ZtVTableGrid` component and package exports.
- Consumes: all helpers from Tasks 1–3 and existing zt-ui controls.

- [ ] **Step 1: Mock `@visactor/vue-vtable` and write failing component tests**

The mock exposes a `vTableInstance` with `setRecords`, `resize`, `on`, and `off`. Tests assert initial local records, remote query parameters, latest-request behavior, loading/error/empty states, pagination model events, selection-change, and row action payloads.

- [ ] **Step 2: Run focused component tests and verify failure**

Run `npm test -- --run tests/vtable-grid.spec.ts`.

- [ ] **Step 3: Build the component layout**

Render optional form slot, toolbar, table body, loading overlay, empty fallback, edit actions, selection count, and `ZtPagination`. Use `<ListTable :options :records="[]" width="100%" height="100%">` and call `setRecords` after ready.

- [ ] **Step 4: Implement query and VTable event bridges**

Connect `sort_click`, checkbox state, cell change, row click/double click, and action button click. Normalize VTable row indexes by excluding the header row and ignore synthetic summary rows.

- [ ] **Step 5: Implement exposed methods**

Expose query/reload/setRecords/getTableInstance/selection/editing/export methods with the exact signatures from `types.ts`.

- [ ] **Step 6: Add zt-ui styling**

Use glass tokens, size presets, visible focus, responsive wrapping, overlay states, and reduced motion. Do not use `transition: all`.

- [ ] **Step 7: Run component and full library tests and commit**

Run `npm test -- --run tests/vtable-grid.spec.ts`, then `npm test`, then commit `feat: add vtable grid component`.

### Task 5: Editing, summaries, settings panel, and CSV integration

**Files:**
- Modify: `src/components/vtable-grid/ZtVTableGrid.vue`
- Modify: `src/components/vtable-grid/vtable-grid.scss`
- Modify: `tests/vtable-grid.spec.ts`

**Interfaces:**
- Extends: component and expose from Task 4.
- Consumes: editing, summary, settings, and CSV helpers from Task 2.

- [ ] **Step 1: Add failing integration tests**

Assert cell edits update the change count, `saveChanges` awaits `batchSave`, save failures retain changes, cancel restores original rows, settings toggle/reorder/reset rebuild columns, and export produces a downloadable UTF-8 CSV blob.

- [ ] **Step 2: Run focused tests and verify behavior failures**

Run `npm test -- --run tests/vtable-grid.spec.ts`.

- [ ] **Step 3: Connect editing and summaries**

Update edit store on VTable cell changes, recalculate frontend summaries from displayed source rows, append a readonly summary record, and display default or slotted save/cancel controls.

- [ ] **Step 4: Build accessible column settings**

Use a popover panel with `role="dialog"`, labelled checkboxes, up/down reorder buttons, reset, Escape close, outside-click close, and optional local persistence.

- [ ] **Step 5: Connect toolbar import/export/create/reload**

Create and import emit events. Export calls `toCsv`, downloads the current displayed business columns, emits the generated content, and revokes the object URL.

- [ ] **Step 6: Run focused/full tests and commit**

Run `npm test -- --run tests/vtable-grid.spec.ts`, then `npm test`, then commit `feat: complete vtable grid interactions`.

### Task 6: Documentation site and copyable examples

**Files:**
- Create: `site/src/views/vtable-grid/Index.vue`
- Modify: `site/src/App.vue`
- Modify: `site/src/router/index.ts`
- Modify: `site/src/views/examples-audit.spec.ts`
- Modify: `README.md`
- Test: `site/src/views/examples-audit.spec.ts`

**Interfaces:**
- Demonstrates: public package imports and all major component modes.

- [ ] **Step 1: Add failing route/example audit assertions**

Require a `/vtable-grid` nav route and five `DemoBlock` examples whose copyable source includes TypeScript imports.

- [ ] **Step 2: Run site audit and verify failure**

Run `npm test -- --run src/views/examples-audit.spec.ts` from `site/`.

- [ ] **Step 3: Add examples and API documentation**

Create examples for local data, remote pagination/sort, selection/actions, edit/save, and summary/settings. Document Props, Events, Slots, and Expose.

- [ ] **Step 4: Update README and exports usage**

Add installation notes for VisActor peers and a minimal `ZtVTableGrid` example.

- [ ] **Step 5: Run site tests and commit**

Run the focused site test and commit `docs: add vtable grid examples`.

### Task 7: Final verification and local integration

**Files:**
- Verify all changed files.

**Interfaces:**
- Produces: locally integrated, unpublished implementation.

- [ ] **Step 1: Verify forbidden imports and package entry**

Run `rg -n "vxe|element-plus|@element-plus|@/api|@/store|@/util" src/components/vtable-grid` and expect no matches. Import `ZtVTableGrid` and public types through `src/index.ts` in a smoke test.

- [ ] **Step 2: Run all checks**

Run root `npm test` and `npm run build`; run site `npm test` and `npm run build`; run `git diff --check`.

- [ ] **Step 3: Visually inspect `/vtable-grid`**

Start the site dev server, inspect desktop and narrow layouts, exercise paging, selection, toolbar, editing, and column settings, and fix material defects with a failing test first.

- [ ] **Step 4: Review and integrate locally**

Review the final diff, merge the feature branch into local `main`, verify `main` is clean and ahead of `origin/main`, and do not run `git push` or `npm publish`.
