# Standalone SelectBox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the circular SelectBox experiment with an independent `ZtSelectBox` that supports clearable input behavior, paged remote search, non-blocking remote batch matching, and a strict dependency boundary for imperative feedback.

**Architecture:** `ZtSelect` and `ZtSelectBox` consume shared `selection` request and anchored-dropdown primitives, while neither component imports the other except that the SelectBox panel may render the public `ZtSelect` as a separator picker. SelectBox owns its trigger and confirmed value, `SelectBoxPanel` owns interactive panel rendering, and `useSelectBoxDraft` owns the pending selection transaction. Global imperative feedback comes from `@ztechjs/zt-alert`; zt-ui retains only declarative Vue feedback components.

**Tech Stack:** Vue 3.5, TypeScript 5.8, SCSS, Vitest 3, Vue Test Utils, Vite 6, `@ztechjs/zt-alert` 0.1.x

**Spec:** `docs/superpowers/specs/2026-09-18-select-box-architecture-design.md`

## Global Constraints

- zt-ui is a new component library; do not add compatibility aliases, legacy prop signatures, deprecation shims, or forwarding files.
- `ZtSelect` must not import from `select-box`, inject a SelectBox mode, or contain SelectBox-specific branches.
- `ZtSelectBox` is always multiple selection and emits `ZtSelectValue[]`.
- The checkbox remains fixed at the left edge of every option; the `option` slot only replaces the content to its right.
- Search, page-size changes, and remote batch matching follow the exact request contracts in the spec.
- Global Message, Notification, MessageBox, Dialog, Drawer, and fullscreen Loading belong to `@ztechjs/zt-alert`.
- Keep zt-ui's declarative `ZtLoading`, `ZtAlert`, `ZtModal`, and `ZtDrawer` components.
- Use test-first RED/GREEN cycles. Run `git diff --check` before each implementation commit.
- Use Node with `PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH` in this workspace.
- Do not publish npm, deploy Pages, push GitHub, or merge branches during implementation.
- Stage only files named by the current task because the repository already contains intentional uncommitted SelectBox work.

---

### Task 1: Move imperative feedback ownership to `@ztechjs/zt-alert`

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/components/index.ts`
- Modify: `src/components/loading/index.ts`
- Modify: `src/components/loading/types.ts`
- Modify: `src/index.ts`
- Modify: `vite.config.ts`
- Delete: `src/components/message/`
- Delete: `src/components/notification/`
- Delete: `src/components/message-box/`
- Delete: `tests/feedback-expansion.spec.ts`
- Delete: `tests/feedback-review.spec.ts`
- Create: `tests/feedback-boundary.spec.ts`

**Interfaces:**
- Consumes: `ZtMessage`, `ZtNotification`, `ZtMessageBox`, `ZtDialog`, `ZtDrawer`, and imperative `ZtLoading` from `@ztechjs/zt-alert`.
- Produces: zt-ui exports declarative `ZtLoading` only; no zt-ui imperative feedback exports remain.

- [ ] **Step 1: Write the failing public-boundary test**

```ts
import { describe, expect, it } from 'vitest'
import * as ztUi from '../src'
import { ZtMessage, ZtLoading as ZtAlertLoading } from '@ztechjs/zt-alert'

describe('imperative feedback boundary', () => {
  it('keeps imperative services in zt-alert and only exposes declarative loading', () => {
    expect(typeof ZtMessage.success).toBe('function')
    expect(typeof ZtAlertLoading.open).toBe('function')
    expect('ZtMessage' in ztUi).toBe(false)
    expect('ZtNotification' in ztUi).toBe(false)
    expect('ZtMessageBox' in ztUi).toBe(false)
    expect('ZtLoadingService' in ztUi).toBe(false)
    expect('useZtLoading' in ztUi).toBe(false)
    expect(ztUi.ZtLoading.name).toBe('ZtLoading')
  })
})
```

- [ ] **Step 2: Run the boundary test and verify RED**

Run:

```bash
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npx vitest run tests/feedback-boundary.spec.ts
```

Expected: FAIL because `@ztechjs/zt-alert` is not installed and zt-ui still exports its own imperative services.

- [ ] **Step 3: Install the runtime dependency and remove duplicate exports**

Run:

```bash
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npm install @ztechjs/zt-alert@^0.1.2
```

Remove the `message`, `notification`, and `message-box` export lines from `src/components/index.ts`. Reduce `src/components/loading/index.ts` to:

```ts
export { default as ZtLoading } from './ZtLoading.vue'
export type { ZtLoadingProps } from './types'
```

Remove `ZtLoadingHandle` from `loading/types.ts`. Import `@ztechjs/zt-alert/style.css` once from `src/index.ts` so a consumer of SelectBox receives message styles without relying on the documentation site. Do not re-export any zt-alert API.

- [ ] **Step 4: Delete duplicate implementation tests and verify package output**

Delete the three command-service source directories and their two service-specific test files. Keep `ZtLoading.vue`, its SCSS, and declarative Loading tests. Build output may bundle zt-alert so the existing UMD entry remains self-contained; do not add it to Rollup `external` unless a browser-compatible UMD global is also provided and tested.

Run:

```bash
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npx vitest run tests/feedback-boundary.spec.ts
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npm run typecheck
```

Expected: both commands PASS.

- [ ] **Step 5: Commit Task 1**

```bash
git diff --check
git add package.json package-lock.json vite.config.ts src/index.ts src/components/index.ts src/components/loading src/components/message src/components/notification src/components/message-box tests/feedback-boundary.spec.ts tests/feedback-expansion.spec.ts tests/feedback-review.spec.ts
git commit -m "refactor: delegate imperative feedback to zt-alert"
```

---

### Task 2: Add shared selection types and remote request coordination

**Files:**
- Create: `src/components/selection/types.ts`
- Create: `src/components/selection/useRemoteOptions.ts`
- Create: `src/components/selection/index.ts`
- Modify: `src/components/select/types.ts`
- Modify: `src/components/select/useRemoteSearch.ts`
- Create: `tests/selection-remote.spec.ts`

**Interfaces:**
- Produces:

```ts
export type ZtSelectValue = string | number | boolean
export interface ZtSelectOption {
  label: string
  value: ZtSelectValue
  disabled?: boolean
}

export interface RemoteRunOptions {
  delay?: number
  clearOnError?: boolean
  onError?: (reason: unknown) => void
}

export interface RemoteOptionsState<Query, Result> {
  result: Ref<Result>
  loading: Ref<boolean>
  failed: Ref<boolean>
  error: Ref<unknown>
  run: (query: Query, options?: RemoteRunOptions) => Promise<Result | undefined>
  schedule: (query: Query, options?: Omit<RemoteRunOptions, 'delay'>) => void
  reset: () => void
  dispose: () => void
}
```

- Consumed by: ordinary Select in Task 9 and SelectBox search/batch coordinators in Tasks 6 and 7.

- [ ] **Step 1: Write failing coordinator tests**

Use deferred promises to assert that only the latest run may update `result`, `loading`, `failed`, and `error`. Add fake-timer cases for `schedule`, method replacement, missing methods, disposal, `clearOnError: false`, and separate coordinator instances using the same method without canceling one another.

```ts
it('ignores an older response after a newer request wins', async () => {
  const first = deferred<string[]>(), second = deferred<string[]>()
  const method = ref(vi.fn()
    .mockReturnValueOnce(first.promise)
    .mockReturnValueOnce(second.promise))
  const remote = useRemoteOptions(method, ref(30), () => [])
  const oldRun = remote.run('old')
  const newRun = remote.run('new')
  second.resolve(['new']); await newRun
  first.resolve(['old']); await oldRun
  expect(remote.result.value).toEqual(['new'])
})
```

- [ ] **Step 2: Run tests and verify RED**

Run:

```bash
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npx vitest run tests/selection-remote.spec.ts
```

Expected: FAIL because `selection/useRemoteOptions.ts` does not exist.

- [ ] **Step 3: Implement the generic coordinator**

Implement `useRemoteOptions<Query, Result>(method, debounce, initialResult)` with one request generation per instance. `run` cancels a pending timer, increments the generation, runs immediately or after `options.delay`, and resolves `undefined` for stale/disposed work. `schedule` calls `run` with the normalized debounce. `reset` restores a fresh `initialResult()`. `dispose` cancels timers and prevents later writes.

Move `ZtSelectValue` and `ZtSelectOption` to `selection/types.ts`. Re-export them from `select/types.ts` so the public Select entry remains coherent, while internal files import from `selection` directly.

- [ ] **Step 4: Adapt the ordinary Select remote wrapper**

Keep `useRemoteSearch` as a thin Select-specific adapter for now:

```ts
const remote = useRemoteOptions(method, debounce, () => [] as ZtSelectOption[])
return {
  options: remote.result,
  loading: remote.loading,
  error: remote.error,
  failed: remote.failed,
  search: (keyword, onError) => remote.schedule(keyword, { onError, clearOnError: true }),
  dispose: remote.dispose,
}
```

- [ ] **Step 5: Run and commit Task 2**

Run:

```bash
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npx vitest run tests/selection-remote.spec.ts tests/select.spec.ts
git diff --check
```

```bash
git add src/components/selection src/components/select/types.ts src/components/select/useRemoteSearch.ts tests/selection-remote.spec.ts
git commit -m "refactor: share selection remote state"
```

---

### Task 3: Extract the anchored dropdown lifecycle

**Files:**
- Create: `src/components/selection/useAnchoredDropdown.ts`
- Modify: `src/components/selection/index.ts`
- Create: `tests/selection-dropdown.spec.ts`

**Interfaces:**
- Consumes: `overlayContextKey` and `OverlayBranch` from `src/components/overlay/context.ts`.
- Produces:

```ts
export interface UseAnchoredDropdownOptions {
  visible: Ref<boolean>
  trigger: Ref<HTMLElement | undefined>
  popup: Ref<HTMLElement | undefined>
  minWidth?: Ref<number | undefined>
  close: () => void
  focus: () => void
}

export interface AnchoredDropdown {
  popupStyle: ComputedRef<CSSProperties>
  placement: Ref<'top' | 'bottom'>
  overlayContext: OverlayContext
  childBranches: Set<OverlayBranch>
  updatePosition: () => void
  containsTarget: (target: Node) => boolean
  dispose: () => void
}
```

- Consumed by: standalone SelectBox in Task 6 and ordinary Select in Task 9.

- [ ] **Step 1: Write failing lifecycle tests**

Mount a harness with a trigger, teleported popup, and nested registered branch. Stub bounding rectangles. Assert bottom and top placement, popup width, scroll/resize repositioning, popup resize observation, outside click closure, inside blank-click retention, nested popup retention, focus restoration, and cleanup after close/unmount.

- [ ] **Step 2: Verify RED**

Run:

```bash
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npx vitest run tests/selection-dropdown.spec.ts
```

Expected: FAIL because `useAnchoredDropdown` is missing.

- [ ] **Step 3: Implement geometry and lifecycle**

Use fixed positioning for the teleported popup. Prefer the space below; flip above when below cannot fit and above offers more room. Clamp the popup to an 8px viewport gutter, expose `maxHeight`, and update on captured scroll, window resize, and `ResizeObserver` callbacks. `containsTarget` must check trigger, popup, and every visible child branch's trigger/popup.

- [ ] **Step 4: Implement overlay registration and cleanup**

Provide an `OverlayContext` whose `registerBranch` adds the branch locally and forwards it to the nearest parent overlay. Register the current trigger/popup as a branch in the parent overlay. Close child branches before the parent. Remove document/window listeners, observers, branch registrations, and sets in `dispose`.

- [ ] **Step 5: Run and commit Task 3**

```bash
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npx vitest run tests/selection-dropdown.spec.ts
git diff --check
git add src/components/selection tests/selection-dropdown.spec.ts
git commit -m "refactor: share anchored dropdown lifecycle"
```

---

### Task 4: Define SelectBox contracts and draft transaction logic

**Files:**
- Rewrite: `src/components/select-box/types.ts`
- Create: `src/components/select-box/useSelectBoxDraft.ts`
- Modify: `src/components/select-box/index.ts`
- Create: `tests/select-box-draft.spec.ts`

**Interfaces:**
- Produces the exact remote contracts from the spec:

```ts
export type ZtSelectBoxRemoteRequest =
  | { mode: 'search'; keyword: string; page: number; pageSize: number }
  | { mode: 'batch'; keywords: string[] }

export type ZtSelectBoxRemoteResult =
  | { mode: 'search'; options: ZtSelectOption[]; total: number }
  | { mode: 'batch'; matches: Array<{ keyword: string; option: ZtSelectOption }> }
```

- Produces `ZtSelectBoxProps`, `ZtSelectBoxInstance`, `normalizePageSize`, `normalizePageSizes`, and `useSelectBoxDraft`.
- Consumed by: Tasks 5-8.

- [ ] **Step 1: Write failing pure-behavior tests**

Cover opening from confirmed values, toggling without emitting, current-page enabled-only select-all, cancel rollback, confirm snapshot, external model replacement while open, option-cache merge by value, missing-label fallback, and pagination normalization.

```ts
it('rebuilds an open draft when the external model is reset', () => {
  const model = ref<ZtSelectValue[]>([1, 2])
  const state = useSelectBoxDraft(model)
  state.open(); state.toggle(3)
  model.value = []
  expect(state.values.value).toEqual([])
})
```

- [ ] **Step 2: Verify RED**

Run:

```bash
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npx vitest run tests/select-box-draft.spec.ts
```

- [ ] **Step 3: Implement public types**

Define `ZtSelectBoxProps` with `modelValue`, `options`, `width`, `disabled`, `placeholder`, `size`, `filterable`, `clearable`, `remote`, `remoteMethod`, `debounce`, `pageSize`, `pageSizes`, `noDataText`, and `remoteErrorText`. Default `filterable` to `true`, `pageSize` to `10`, and `pageSizes` to `[10, 20, 50]` in the component, not the type.

Define the instance as:

```ts
export interface ZtSelectBoxInstance {
  focus: (options?: FocusOptions) => void
  blur: () => void
  open: () => void
  close: () => void
  clear: () => void
}
```

- [ ] **Step 4: Implement draft and normalization helpers**

Use a value array plus a `Map<ZtSelectValue, ZtSelectOption>` cache. Preserve insertion order, de-duplicate by strict primitive value, ignore disabled values when selecting, and create `{ value, label: String(value) }` for unknown confirmed values. `normalizePageSizes` filters invalid values, removes duplicates, and inserts the effective page size when absent.

- [ ] **Step 5: Run and commit Task 4**

```bash
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npx vitest run tests/select-box-draft.spec.ts
git diff --check
git add src/components/select-box/types.ts src/components/select-box/useSelectBoxDraft.ts src/components/select-box/index.ts tests/select-box-draft.spec.ts
git commit -m "feat: define SelectBox selection state"
```

---

### Task 5: Build the independent SelectBox panel for local data

**Files:**
- Create: `src/components/select-box/SelectBoxPanel.vue`
- Create: `src/components/select-box/select-box.scss`
- Create: `tests/select-box-panel.spec.ts`

**Interfaces:**
- Consumes: `ZtCheckbox`, `ZtButton`, `ZtInput`, `ZtPagination`, `ZtSelect`, `ZtIcon`, `ZtLoading`, `ZtScrollbar`, `ZtText`, and draft operations from Task 4.
- Produces events `search`, `update:page`, `update:pageSize`, `confirm`, and `cancel` plus the scoped `option` slot `{ option, selected, disabled }`.

- [ ] **Step 1: Write failing local panel tests**

Test that the panel renders zt-ui controls, keeps the checkbox as the first option child, applies the option slot only to right-side content, toggles exactly once when clicking checkbox/label/slot/row blank space, keeps the panel open on internal blank clicks, selects enabled items on the current page, paginates the full filtered list, and preserves draft values across pages.

- [ ] **Step 2: Add failing local batch-paste tests**

Use all `options`, not the current page, for exact label/value matching. Cover newline/comma/semicolon/tab parsing, whitespace trimming, duplicate counts, disabled options, partial matches, zero matches, and multiple options matching one keyword. Partial matches must emit `confirm` with matched values rather than block.

- [ ] **Step 3: Verify RED**

Run:

```bash
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npx vitest run tests/select-box-panel.spec.ts
```

- [ ] **Step 4: Implement panel modes and component composition**

Move the useful markup from the experimental `SelectFilterPanel.vue`, but import only public zt-ui controls. Keep the separator `ZtSelect` inside the panel and register its teleported popup through overlay context. Use `ZtLoading` only around the option list. Use `ZtButton :loading="batchLoading" loading-text="匹配中…"` for batch confirmation.

- [ ] **Step 5: Implement deliberate local styles**

Use solid semantic backgrounds and existing CSS variables. Define size-specific trigger/panel gaps, keep option rows single-line, set checkbox-to-content gaps to `4/5/6/7/8px` for `mini/small/default/medium/large`, and keep primary emphasis on the confirm button. Add reduced-motion handling and visible focus rings.

- [ ] **Step 6: Run and commit Task 5**

```bash
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npx vitest run tests/select-box-panel.spec.ts tests/checkbox.spec.ts tests/pagination.spec.ts
git diff --check
git add src/components/select-box/SelectBoxPanel.vue src/components/select-box/select-box.scss tests/select-box-panel.spec.ts
git commit -m "feat: add standalone SelectBox panel"
```

---

### Task 6: Build the standalone trigger and paged remote search

**Files:**
- Rewrite: `src/components/select-box/ZtSelectBox.vue`
- Modify: `src/components/select-box/SelectBoxPanel.vue`
- Modify: `src/components/select-box/select-box.scss`
- Create: `tests/select-box-remote.spec.ts`

**Interfaces:**
- Consumes: `useAnchoredDropdown`, `useRemoteOptions`, `useSelectBoxDraft`, and the remote request/result union.
- Produces: independent `ZtSelectBox`, with no Select wrapper or mode injection.

- [ ] **Step 1: Write failing trigger and popup tests**

Mount `ZtSelectBox` directly. Assert numeric/CSS width, placeholder and summary ellipsis/title, `role="combobox"`, `aria-haspopup="dialog"`, visible-change events, search focus after open, Escape/focus restoration, outside-click cancel, blank-panel retention, and nested separator Select retention.

- [ ] **Step 2: Write failing remote pagination tests**

```ts
expect(remoteMethod).toHaveBeenLastCalledWith({
  mode: 'search', keyword: '华东', page: 1, pageSize: 20,
})
```

Cover initial empty-keyword load, debounced keywords, immediate page changes, `update:pageSize`, external page-size changes, page reset, server `total`, no client-side slicing, stale responses, failure preserving the last successful page, invalid total normalization, and out-of-range page correction with one re-request.

- [ ] **Step 3: Verify RED**

Run:

```bash
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npx vitest run tests/select-box-remote.spec.ts
```

- [ ] **Step 4: Implement standalone container rendering**

Render a button-like trigger, clear/action area, and teleported `<SelectBoxPanel role="dialog">`. Provide the anchored dropdown's overlay context around the panel. Build the confirmed summary from the option cache and keep it on one line. Opening copies confirmed values into the draft; panel confirmation emits `update:modelValue` then `change`, validates the form, and closes; cancel discards the draft.

- [ ] **Step 5: Implement paged remote orchestration**

Instantiate `useRemoteOptions<ZtSelectBoxRemoteRequest, ZtSelectBoxRemoteResult>` for search. Accept only matching `mode: 'search'` responses. Merge response options into the label cache, pass response `total` directly to Pagination, and preserve old results on errors. Search schedules with debounce; page and page-size actions call `run` immediately.

- [ ] **Step 6: Run and commit Task 6**

```bash
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npx vitest run tests/select-box-remote.spec.ts tests/select-box-panel.spec.ts tests/selection-dropdown.spec.ts
git diff --check
git add src/components/select-box tests/select-box-remote.spec.ts
git commit -m "feat: add paged remote SelectBox"
```

---

### Task 7: Add remote batch matching and zt-alert feedback

**Files:**
- Modify: `src/components/select-box/ZtSelectBox.vue`
- Modify: `src/components/select-box/SelectBoxPanel.vue`
- Modify: `tests/select-box-remote.spec.ts`
- Modify: `tests/feedback-boundary.spec.ts`

**Interfaces:**
- Consumes: `ZtMessage` from `@ztechjs/zt-alert` and `mode: 'batch'` remote contracts.
- Produces: non-blocking full/partial/empty match feedback and automatic draft selection.

- [ ] **Step 1: Write failing remote batch tests**

Mock `ZtMessage.success/info/warning/error`. Cover local batch confirmation as well as remote batch confirmation so both paths use the same non-blocking count feedback. Confirm the exact remote request:

```ts
expect(remoteMethod).toHaveBeenLastCalledWith({
  mode: 'batch', keywords: ['华东', '华南', '不存在'],
})
```

Test full matches, partial matches, zero matches, duplicate pasted tokens, two results for one keyword, duplicate option values, disabled results, results for unrequested keywords, retained existing draft values, button loading, duplicate-click suppression, independent search/batch request generations, stale batch responses, and failure retry.

- [ ] **Step 2: Verify RED**

Run:

```bash
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npx vitest run tests/select-box-remote.spec.ts
```

- [ ] **Step 3: Implement the independent batch coordinator**

Create a second `useRemoteOptions` instance so batch requests do not replace search results or search loading. Validate `mode: 'batch'`, ignore records whose keyword was not requested, filter disabled options, count unique matched keywords, merge unique option values into the draft/cache, then execute the ordinary confirm path.

- [ ] **Step 4: Implement exact zt-alert messages**

Use these templates:

```ts
const base = duplicates
  ? `批量粘贴 ${rawCount} 项（去重后 ${uniqueCount} 项）`
  : `批量粘贴 ${rawCount} 项`
const text = `${base}，匹配 ${matchedKeywordCount} 项，已自动勾选 ${selectedOptionCount} 项`
```

Call `ZtMessage.success(text)` for full matches, `ZtMessage.warning(text)` for partial/zero matches, `ZtMessage.info('没有可匹配的粘贴内容')` for empty input, and `ZtMessage.error('批量匹配失败，请重试')` on failure. Apply the same success/warning/info rules to local matching against the complete `options` array. Remote failure emits `remote-error`, keeps the panel and input open, and does not emit model changes.

- [ ] **Step 5: Run and commit Task 7**

```bash
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npx vitest run tests/select-box-remote.spec.ts tests/feedback-boundary.spec.ts
git diff --check
git add src/components/select-box tests/select-box-remote.spec.ts tests/feedback-boundary.spec.ts
git commit -m "feat: match pasted SelectBox values remotely"
```

---

### Task 8: Add clearable, Form, size, radius, and theme behavior

**Files:**
- Modify: `src/components/select-box/ZtSelectBox.vue`
- Modify: `src/components/select-box/SelectBoxPanel.vue`
- Modify: `src/components/select-box/select-box.scss`
- Create: `tests/select-box-integration.spec.ts`

**Interfaces:**
- Consumes: `useZtConfig`, `useZtSize`, `ztFormItemKey`, zt-ui Icon/Button/Input behavior.
- Produces: `clearable`, exposed `clear()`, inherited ConfigProvider values, and FormItem validation semantics.

- [ ] **Step 1: Write failing clear tests**

Assert button visibility only for non-empty enabled values. Clicking the button and calling `clear()` must emit, in order, `update:modelValue([])`, `change([])`, and `clear`; reset keyword/page; call FormItem `validate('change')`; keep an open panel open with an empty draft; preserve trigger focus; and not reopen/close the panel through click bubbling. Empty/disabled clear calls emit nothing.

- [ ] **Step 2: Write failing configuration and Form tests**

Mount nested `ZtConfigProvider` instances for every size plus light/dark themes and border radii `0`, `6`, and `16`. Assert resolved size classes, `--zt-radius` style, solid theme surface variables, inherited FormItem disabled/error state, `aria-invalid`, `aria-describedby`, `change` validation, and `blur` validation after focus truly leaves popup branches.

- [ ] **Step 3: Verify RED**

Run:

```bash
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npx vitest run tests/select-box-integration.spec.ts
```

- [ ] **Step 4: Implement clear and integration behavior**

Resolve size with `useZtSize(props, () => formItem?.size.value)`, disabled state from prop/FormItem, and theme/radius from `useZtConfig`. Use the existing built-in clear icon and stop pointer/click propagation on its button. Keep clear outside the panel confirmation transaction and rebuild the open draft from the emitted empty model.

- [ ] **Step 5: Polish motion and spacing**

Apply five trigger heights/paddings, matching panel control sizes, theme tokens, and ConfigProvider radius. Ensure checkbox content spacing stays compact and the clear icon has the same hover/press motion language as other input controls. Respect `prefers-reduced-motion`.

- [ ] **Step 6: Run and commit Task 8**

```bash
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npx vitest run tests/select-box-integration.spec.ts tests/select-box-panel.spec.ts tests/select-box-remote.spec.ts
git diff --check
git add src/components/select-box tests/select-box-integration.spec.ts
git commit -m "feat: integrate SelectBox clear and configuration"
```

---

### Task 9: Remove SelectBox branches from ordinary Select

**Files:**
- Modify: `src/components/select/ZtSelect.vue`
- Modify: `src/components/select/select.scss`
- Delete: `src/components/select/SelectFilterPanel.vue`
- Delete: `src/components/select/filter-context.ts`
- Delete: `src/components/select/filter-panel.scss`
- Modify: `tests/select.spec.ts`
- Delete: `tests/select-filter-panel.spec.ts`
- Create: `tests/select-architecture.spec.ts`

**Interfaces:**
- Consumes: `useAnchoredDropdown` and `useRemoteOptions` from `selection`.
- Produces: a standalone ordinary Select with no knowledge of SelectBox.

- [ ] **Step 1: Add the failing architecture test**

```ts
import { readFileSync, existsSync } from 'node:fs'

it('keeps Select independent from SelectBox', () => {
  const source = readFileSync('src/components/select/ZtSelect.vue', 'utf8')
  expect(source).not.toMatch(/SelectBox|SelectFilterPanel|filter-context|filterPanel/)
  expect(existsSync('src/components/select/filter-context.ts')).toBe(false)
  expect(existsSync('src/components/select/SelectFilterPanel.vue')).toBe(false)
})
```

- [ ] **Step 2: Capture ordinary Select behavior before removal**

Strengthen `tests/select.spec.ts` for single/multiple selection, collapse tags, local/remote search, remote races, clear, keyboard movement, outside clicks, nested overlay branches, Form validation, width, and exposed methods. Run the strengthened tests against the current code and confirm they pass before changing Select internals.

- [ ] **Step 3: Remove SelectBox mode and adopt shared primitives**

Delete the mode injection, panel component import, filter-panel computed branches, summary special cases, filter popup sizing, and SelectBox-specific focus/clear behavior. Replace duplicated positioning/outside-click/branch code with `useAnchoredDropdown`. Keep ordinary Select's listbox markup, keyboard semantics, tag behavior, and public API unchanged.

- [ ] **Step 4: Delete obsolete files and tests**

Delete the old panel/context/styles and the experimental `select-filter-panel.spec.ts`. The replacement coverage now lives in `select-box-*` suites. Search for forbidden references:

```bash
rg -n "SelectFilterPanel|selectBoxModeKey|filter-context|filterPanel" src tests
```

Expected: no matches.

- [ ] **Step 5: Run and commit Task 9**

```bash
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npx vitest run tests/select.spec.ts tests/select-architecture.spec.ts tests/select-box-draft.spec.ts tests/select-box-panel.spec.ts tests/select-box-remote.spec.ts tests/select-box-integration.spec.ts
git diff --check
git add src/components/select tests/select.spec.ts tests/select-architecture.spec.ts tests/select-filter-panel.spec.ts
git commit -m "refactor: decouple Select from SelectBox"
```

---

### Task 10: Update SelectBox documentation and complete verification

**Files:**
- Modify: `site/src/views/select-box/Index.vue`
- Modify: `site/src/views/select-box/Remote.vue`
- Create: `site/src/views/select-box/Batch.vue`
- Create: `site/src/views/select-box/Clearable.vue`
- Modify: `site/src/docs/catalog.ts`
- Modify: `site/src/docs/expansion.json`
- Modify: `site/src/docs/api.generated.json`
- Modify: `docs/component-examples-audit.md`
- Modify: `README.md`
- Modify: `site/package.json`
- Modify: `site/package-lock.json`
- Delete: `site/src/views/message/`
- Delete: `site/src/views/notification/`
- Delete: `site/src/views/message-box/`
- Delete: `site/src/views/loading/Fullscreen.vue`
- Create: `site/src/views/feedback/Index.vue`
- Modify: `src/components/index.ts`

**Interfaces:**
- Consumes: final public `ZtSelectBox` API and direct zt-alert imports.
- Produces: copyable documentation for local, remote, batch, clearable, sizing/theme, and the feedback-library boundary.

- [ ] **Step 1: Write or update documentation audit expectations**

Require SelectBox examples to contain the discriminated `remoteMethod`, `v-model:page-size`, batch matching, `clearable`, the `option` slot, width, and ConfigProvider usage. Require the feedback guide to import command APIs from `@ztechjs/zt-alert`, never from `@ztechjs/zt-ui`.

- [ ] **Step 2: Update the site examples**

Use this remote signature in the copyable example:

```ts
async function loadOptions(request: ZtSelectBoxRemoteRequest): Promise<ZtSelectBoxRemoteResult> {
  if (request.mode === 'batch') {
    return { mode: 'batch', matches: await matchRegions(request.keywords) }
  }
  const page = await searchRegions(request.keyword, request.page, request.pageSize)
  return { mode: 'search', options: page.items, total: page.total }
}
```

Show `const pageSize = ref(20)` with `v-model:page-size="pageSize"`. Demonstrate partial batch matching and explain that matched values commit while the zt-alert message reports counts.

- [ ] **Step 3: Replace imperative feedback component pages**

Remove zt-ui Message, Notification, MessageBox, and fullscreen Loading demos. Add one Feedback guide that links to `https://www.npmjs.com/package/@ztechjs/zt-alert`, shows direct installation/import, and explains that local declarative `ZtLoading` remains in zt-ui. Add `@ztechjs/zt-alert` to the site dependencies for copyable example typechecking.

- [ ] **Step 4: Regenerate documentation metadata**

Run:

```bash
cd site
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npm run docs:api
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npm run docs:examples
```

Confirm generated API data contains `ZtSelectBoxRemoteRequest`, `ZtSelectBoxRemoteResult`, `pageSize`, `pageSizes`, `clearable`, and `clear()`, and contains no zt-ui `ZtMessage`, `ZtNotification`, `ZtMessageBox`, `ZtLoadingService`, or `useZtLoading` entry.

- [ ] **Step 5: Run the full verification matrix**

From the library root:

```bash
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npm test
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npm run build
```

From `site/`:

```bash
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npm test
PATH=/Users/stev/.nvm/versions/node/v24.18.0/bin:$PATH npm run build
```

Then run:

```bash
git diff --check
rg -n "SelectFilterPanel|selectBoxModeKey|filter-context|filterPanel" src tests
rg -n "ZtMessage|ZtNotification|ZtMessageBox|ZtLoadingService|useZtLoading" src/components/index.ts src/index.ts site/src/views
```

Expected: all test/build commands PASS; both architecture searches produce no forbidden zt-ui ownership references except direct imports from `@ztechjs/zt-alert` in the Feedback guide or SelectBox.

- [ ] **Step 6: Perform browser visual QA**

Run the site and inspect SelectBox at widths `100px`, `240px`, and `100%`; all five sizes; light/dark themes; radius `0` and `16`; local and remote pages; loading/error/empty states; nested separator Select; partial batch feedback; and clear hover/focus motion. Confirm solid surfaces, compact checkbox spacing, no tag/summary wrapping, no accidental panel closure, and no focus loss.

- [ ] **Step 7: Commit Task 10**

```bash
git add README.md docs/component-examples-audit.md site src/components/index.ts
git commit -m "docs: document standalone SelectBox workflows"
```

---

## Completion Review

Before reporting completion, inspect the final diff and verify each spec section maps to at least one passing test. Confirm there are no placeholders, no stale SelectBox mode files, no internal imperative feedback exports, no uncommitted generated documentation changes, and no unrelated files staged in any implementation commit.
