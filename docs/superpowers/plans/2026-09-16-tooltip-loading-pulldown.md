# Tooltip, Loading, and Pulldown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add production-ready Tooltip, standalone/overlay Loading, and hybrid items/slot Pulldown components to zt-ui.

**Architecture:** Tooltip and Pulldown consume a dependency-free internal floating layer module for geometry, Teleport positioning, viewport constraints, observation, and cleanup. Tooltip owns delayed noninteractive hints, Pulldown owns interactive menu/focus behavior and overlay branch registration, and Loading remains independent.

**Tech Stack:** Vue 3.5, TypeScript 5.8, SCSS, Vitest 3, Vue Test Utils, Vite 6

**Spec:** `docs/superpowers/specs/2026-09-16-tooltip-loading-pulldown-design.md`

## Global Constraints

- Do not add Element Plus, VXE, Floating UI, or another UI dependency.
- Support `mini`, `small`, `default`, `medium`, and `large` wherever the component exposes `size`.
- Preserve Modal/Drawer focus, Escape, Tab, layering, and nested overlay behavior.
- Every site demo must use `DemoBlock :code` with a complete copyable Vue + TypeScript SFC.
- Use test-first RED/GREEN cycles and run `git diff --check` before every commit.
- Do not publish npm or push GitHub during implementation.

---

### Task 1: Floating geometry and public internal types

**Files:**
- Create: `src/components/floating/types.ts`
- Create: `src/components/floating/geometry.ts`
- Create: `tests/floating-geometry.spec.ts`

**Interfaces:**
- Produces: `ZtFloatingPlacement`, `ZtFloatingPosition`, `ZtFloatingGeometryOptions`, `computeFloatingPosition(options)`.
- Consumed by: Tasks 2, 3, and 5.

- [ ] **Step 1: Write geometry tests with hand-derived positions**

```ts
import { describe, expect, it } from 'vitest'
import { computeFloatingPosition } from '../src/components/floating/geometry'

const trigger = { top: 100, right: 180, bottom: 132, left: 100, width: 80, height: 32 }
const floating = { width: 120, height: 80 }

it('places bottom-start with the configured gap', () => {
  expect(computeFloatingPosition({ trigger, floating, placement: 'bottom-start', offset: 6, viewport: { width: 800, height: 600 }, gutter: 8 }))
    .toMatchObject({ placement: 'bottom-start', top: 138, left: 100, maxHeight: 454 })
})

it('flips upward and constrains a layer that cannot fit either side', () => {
  const result = computeFloatingPosition({ trigger: { ...trigger, top: 120, bottom: 152 }, floating: { width: 120, height: 240 }, placement: 'bottom', offset: 6, viewport: { width: 320, height: 220 }, gutter: 8 })
  expect(result.placement).toBe('top')
  expect(result.top).toBe(8)
  expect(result.maxHeight).toBe(106)
})
```

Add table cases for all 12 placements, horizontal flipping, left/right clamping, and arrow offsets.

- [ ] **Step 2: Run the geometry tests and verify RED**

Run: `npx vitest run tests/floating-geometry.spec.ts`

Expected: FAIL because the floating module does not exist.

- [ ] **Step 3: Define the exact types**

```ts
export type ZtFloatingSide = 'top' | 'bottom' | 'left' | 'right'
export type ZtFloatingAlign = 'start' | 'center' | 'end'
export type ZtFloatingPlacement = ZtFloatingSide | `${ZtFloatingSide}-${Exclude<ZtFloatingAlign, 'center'>}`

export interface ZtFloatingPosition {
  placement: ZtFloatingPlacement
  top: number
  left: number
  maxHeight: number
  arrowX?: number
  arrowY?: number
}
```

Use a serializable `ZtRect` instead of `DOMRect` so geometry stays pure and independently testable.

- [ ] **Step 4: Implement `computeFloatingPosition`**

Split placement into side/alignment, calculate preferred coordinates, compare available space on the main axis, flip to the opposite side when it offers more usable space, constrain height to the chosen side, clamp the cross axis to the 8px gutter, and derive arrow coordinates from the trigger center.

- [ ] **Step 5: Run and commit Task 1**

Run: `npx vitest run tests/floating-geometry.spec.ts && git diff --check`

```bash
git add src/components/floating/types.ts src/components/floating/geometry.ts tests/floating-geometry.spec.ts
git commit -m "feat: add floating layer geometry"
```

---

### Task 2: Floating layer lifecycle composable

**Files:**
- Create: `src/components/floating/useFloatingLayer.ts`
- Create: `src/components/floating/index.ts`
- Create: `tests/floating-layer.spec.ts`

**Interfaces:**
- Consumes: `computeFloatingPosition` and `ZtFloatingPlacement` from Task 1.
- Produces:

```ts
interface UseFloatingLayerOptions {
  trigger: Ref<HTMLElement | undefined>
  floating: Ref<HTMLElement | undefined>
  visible: Ref<boolean>
  placement: Ref<ZtFloatingPlacement>
  offset: Ref<number>
  teleported: Ref<boolean>
}

interface UseFloatingLayerReturn {
  style: ComputedRef<CSSProperties>
  actualPlacement: Ref<ZtFloatingPlacement>
  arrowStyle: ComputedRef<CSSProperties>
  updatePosition: () => void
  zIndex: Ref<number>
}
```

- [ ] **Step 1: Write failing lifecycle tests**

Mount a harness component that exposes trigger/floating refs. Stub rectangles and `ResizeObserver`; assert fixed coordinates, nearest `.zt-modal/.zt-drawer` z-index plus one, captured scroll and resize listeners, both elements observed, resize callback repositioning, and full cleanup when hidden/unmounted.

- [ ] **Step 2: Verify RED**

Run: `npx vitest run tests/floating-layer.spec.ts`

Expected: FAIL because `useFloatingLayer` is missing.

- [ ] **Step 3: Implement the composable**

Use `watch(visible, { flush: 'post' })` to attach/detach listeners and observers. On open, wait for `nextTick`, call `updatePosition`, observe both elements, and listen to `window` resize plus captured scroll. Return inline fixed positioning only when teleported; non-teleported mode uses absolute positioning relative to the nearest positioned trigger wrapper.

- [ ] **Step 4: Cover dynamic content and unavailable APIs**

Add tests and guards for missing `ResizeObserver`, zero-sized elements before mount, content height changes, and a trigger removed while visible. The function must remain inert during SSR when `window` or `document` is unavailable.

- [ ] **Step 5: Run and commit Task 2**

Run: `npx vitest run tests/floating-geometry.spec.ts tests/floating-layer.spec.ts && git diff --check`

```bash
git add src/components/floating tests/floating-layer.spec.ts
git commit -m "feat: add floating layer lifecycle"
```

---

### Task 3: Tooltip component

**Files:**
- Create: `src/components/tooltip/ZtTooltip.vue`
- Create: `src/components/tooltip/types.ts`
- Create: `src/components/tooltip/tooltip.scss`
- Create: `src/components/tooltip/index.ts`
- Create: `tests/tooltip.spec.ts`

**Interfaces:**
- Consumes: `useFloatingLayer`, `ZtFloatingPlacement`, `ZtComponentSize`.
- Produces: `ZtTooltip`, `ZtTooltipProps`, `ZtTooltipTrigger`, `ZtTooltipInstance`.

- [ ] **Step 1: Write failing trigger and timer tests**

```ts
it('cancels a delayed hover opening when the pointer leaves first', async () => {
  vi.useFakeTimers()
  const wrapper = mount(ZtTooltip, { props: { content: '说明', showAfter: 200 }, slots: { default: '<button>目标</button>' } })
  await wrapper.get('button').trigger('mouseenter')
  await wrapper.get('button').trigger('mouseleave')
  await vi.advanceTimersByTimeAsync(200)
  expect(document.querySelector('[role="tooltip"]')).toBeNull()
})
```

Cover hover, focus, click, manual controlled mode, combined triggers, hide delay, disabled state, content prop/slot, and event emission.

- [ ] **Step 2: Verify RED**

Run: `npx vitest run tests/tooltip.spec.ts`

Expected: FAIL because Tooltip files do not exist.

- [ ] **Step 3: Implement state and trigger cloning**

Normalize triggers to a Set. Maintain internal visibility when `modelValue` is undefined; otherwise emit `update:modelValue` and follow the prop. Clone one element VNode with merged handlers and ARIA attributes. Fall back to a focusable inline wrapper for text nodes. Preserve consumer event handlers.

- [ ] **Step 4: Implement rendering, accessibility, styles, and methods**

Teleport conditionally, render `role="tooltip"`, merge existing `aria-describedby`, use the floating style/arrow style, apply maxWidth and five size classes, and expose `open`, `close`, `updatePosition`. SCSS must include reduced-motion behavior.

- [ ] **Step 5: Add geometry/cleanup regressions and run GREEN**

Assert final placement class, arrow style, listener cleanup, no timer after unmount, no empty tooltip when neither content source exists, and consumer click/focus handler preservation.

Run: `npx vitest run tests/tooltip.spec.ts tests/floating-layer.spec.ts`

- [ ] **Step 6: Commit Task 3**

```bash
git add src/components/tooltip tests/tooltip.spec.ts
git commit -m "feat: add tooltip component"
```

---

### Task 4: Loading component

**Files:**
- Create: `src/components/loading/ZtLoading.vue`
- Create: `src/components/loading/types.ts`
- Create: `src/components/loading/loading.scss`
- Create: `src/components/loading/index.ts`
- Create: `tests/loading.spec.ts`

**Interfaces:**
- Produces: `ZtLoading`, `ZtLoadingProps`.

- [ ] **Step 1: Write failing independent and overlay mode tests**

```ts
it('keeps slotted content mounted while toggling its overlay', async () => {
  const wrapper = mount(ZtLoading, { props: { loading: false }, slots: { default: '<button>保存</button>' } })
  expect(wrapper.get('button').exists()).toBe(true)
  expect(wrapper.find('[role="status"]').exists()).toBe(false)
  await wrapper.setProps({ loading: true })
  expect(wrapper.get('button').exists()).toBe(true)
  expect(wrapper.get('[role="status"]').text()).toContain('加载中')
  expect(wrapper.attributes('aria-busy')).toBe('true')
})
```

Cover independent rendering, false state, text, spinner slot scope, background, lock pointer behavior, five sizes, and ARIA.

- [ ] **Step 2: Verify RED**

Run: `npx vitest run tests/loading.spec.ts`

Expected: FAIL because Loading files do not exist.

- [ ] **Step 3: Implement delay without flicker**

Watch `loading` and maintain `displayed`. A positive delay starts one timer; false cancels it and hides immediately; repeated true does not create duplicate timers; unmount clears the timer.

- [ ] **Step 4: Implement both render modes and styling**

Detect the default slot once per render. Standalone mode renders only the status content. Overlay mode always renders content inside a relative wrapper and conditionally adds an absolute mask. Apply `pointer-events: auto` for lock and `none` otherwise, plus custom background and five spinner sizes. Disable animation under reduced motion.

- [ ] **Step 5: Run and commit Task 4**

Run: `npx vitest run tests/loading.spec.ts && git diff --check`

```bash
git add src/components/loading tests/loading.spec.ts
git commit -m "feat: add loading component"
```

---

### Task 5: Hybrid Pulldown component and overlay ownership

**Files:**
- Create: `src/components/pulldown/ZtPulldown.vue`
- Create: `src/components/pulldown/types.ts`
- Create: `src/components/pulldown/pulldown.scss`
- Create: `src/components/pulldown/index.ts`
- Create: `tests/pulldown.spec.ts`
- Modify: `src/components/overlay/context.ts`
- Modify: `src/components/overlay/useOverlay.ts`
- Test: `tests/use-overlay.spec.ts`

**Interfaces:**
- Consumes: `useFloatingLayer`, `ZtFloatingPlacement`, `overlayContextKey`, `ZtComponentSize`.
- Produces: `ZtPulldown`, `ZtPulldownProps`, `ZtPulldownItem`, `ZtPulldownCommand`, `ZtPulldownTrigger`, `ZtPulldownInstance`.

- [ ] **Step 1: Write failing items-menu behavior tests**

Test click opening, items rendering, divided/danger classes, item slot scopes, disabled items, command payload, `closeOnCommand=false`, empty slot, external model updates, and visible-change emissions.

- [ ] **Step 2: Write failing keyboard and focus tests**

Open through keyboard, then assert ArrowDown/Up wrapping across enabled items, Home/End, Enter/Space command execution, Escape restoration, outside click, and all three close switches.

- [ ] **Step 3: Write failing custom dropdown and overlay integration tests**

Mount Pulldown with a focusable custom dropdown inside real Modal and Drawer. Assert teleported focus is owned, first Escape closes Pulldown, second closes the parent, Tab returns at the trigger's logical position, nested overlays restore focus, and underneath Pulldowns cannot reopen.

- [ ] **Step 4: Verify RED**

Run: `npx vitest run tests/pulldown.spec.ts tests/use-overlay.spec.ts`

Expected: FAIL because Pulldown is missing and the overlay branch lacks any needed popup metadata.

- [ ] **Step 5: Implement state, triggers, and default menu**

Use internal/controlled visibility semantics from Tooltip. Clone a single trigger VNode while preserving handlers and adding `aria-haspopup`/`aria-expanded`. Implement click/hover/manual modes, default menu roving focus, command behavior, and exposed methods.

- [ ] **Step 6: Implement custom dropdown and overlay branch registration**

Register `{ trigger, popup, visible, close, focus }` with the nearest overlay. Keep native events inside custom content, handle Escape at the branch boundary, and ensure outside clicks exclude both trigger and teleported popup. Extend overlay context only when a failing integration test proves a missing capability.

- [ ] **Step 7: Implement Pulldown styling**

Use glass card tokens, five menu heights/font sizes, divided/danger/hover/focus/disabled states, constrained scroll area, placement animation, and reduced motion.

- [ ] **Step 8: Run and commit Task 5**

Run: `npx vitest run tests/pulldown.spec.ts tests/use-overlay.spec.ts tests/modal.spec.ts tests/drawer.spec.ts && git diff --check`

```bash
git add src/components/pulldown src/components/overlay tests/pulldown.spec.ts tests/use-overlay.spec.ts
git commit -m "feat: add pulldown component"
```

---

### Task 6: Package exports, size contract, and declarations

**Files:**
- Modify: `src/components/index.ts`
- Modify: `tests/size.spec.ts`
- Create: `tests/floating-components-public.spec.ts`

**Interfaces:**
- Consumes all public components/types from Tasks 1-5.
- Produces package-root exports and declaration coverage.

- [ ] **Step 1: Write failing public API tests**

Import `ZtTooltip`, `ZtLoading`, `ZtPulldown` and every public type from `../src`. Instantiate representative props and instances, and assert the component names and methods.

- [ ] **Step 2: Extend the size contract test**

Add all five size assertions for each component, including dropdown/tooltip teleported size classes and Loading spinner dimensions.

- [ ] **Step 3: Verify RED**

Run: `npx vitest run tests/floating-components-public.spec.ts tests/size.spec.ts`

Expected: FAIL because package-root exports are absent.

- [ ] **Step 4: Export components and types**

Add `export * from './tooltip'`, `export * from './loading'`, and `export * from './pulldown'` to `src/components/index.ts`. Keep the internal floating composable unexported except for the `ZtFloatingPlacement` type re-exported by Tooltip and Pulldown type modules.

- [ ] **Step 5: Build and inspect declarations**

Run: `npm run build`

Assert `dist/components/tooltip`, `dist/components/loading`, and `dist/components/pulldown` declarations exist and root `dist/index.d.ts` resolves the exports.

- [ ] **Step 6: Commit Task 6**

```bash
git add src/components/index.ts tests/size.spec.ts tests/floating-components-public.spec.ts
git commit -m "feat: export floating components"
```

---

### Task 7: Documentation site and README

**Files:**
- Create: `site/src/views/tooltip/Index.vue`
- Create: `site/src/views/loading/Index.vue`
- Create: `site/src/views/pulldown/Index.vue`
- Modify: `site/src/App.vue`
- Modify: `site/src/router/index.ts`
- Modify: `site/src/views/examples-audit.spec.ts`
- Modify: `README.md`

**Interfaces:**
- Adds `/tooltip`, `/loading`, and `/pulldown` routes and complete copyable examples.

- [ ] **Step 1: Write failing documentation audits**

Add the three pages to the audited page list. Assert route/navigation order, every required capability token, exactly the intended DemoBlock count for each page, a matching `sfc()` initializer for every `:code` binding, and complete script/template output.

- [ ] **Step 2: Verify RED**

Run from `site/`: `npx vitest run src/views/examples-audit.spec.ts`

Expected: FAIL because the routes and pages are absent.

- [ ] **Step 3: Build Tooltip demos**

Create copyable examples for basic/content slot, combined hover+focus, click/manual control, placements/delay/disabled, and five sizes. Include accessible trigger names.

- [ ] **Step 4: Build Loading demos**

Create copyable examples for standalone, overlay toggle, delay anti-flicker, custom spinner, lock/background, and five sizes. Demonstrate that slotted content stays mounted.

- [ ] **Step 5: Build Pulldown demos**

Create copyable examples for items+command, disabled/divided/danger, item slot, custom dropdown matching the current menu-tree action use case, hover/manual triggers, and five sizes. Include a visible event log and keyboard instructions.

- [ ] **Step 6: Register navigation/routes and update README**

Place Tooltip, Loading, and Pulldown after Select in the component navigation and route table. Add all three to the README component list and include one minimal example each.

- [ ] **Step 7: Run site verification and commit**

Run from `site/`: `npm test && npm run build`

```bash
git add README.md site/src/App.vue site/src/router/index.ts site/src/views/examples-audit.spec.ts site/src/views/tooltip site/src/views/loading site/src/views/pulldown
git commit -m "docs: add floating component examples"
```

---

### Task 8: Final regression and browser verification

**Files:**
- Modify only files implicated by failures discovered during this task.

**Interfaces:**
- Verifies the complete spec without adding new public API.

- [ ] **Step 1: Run complete repository verification**

From package root:

```bash
npm test
npm run build
git diff --check
git status --short --branch
```

From `site/`:

```bash
npm test
npm run build
```

- [ ] **Step 2: Inspect the three pages in a real browser**

Verify Tooltip delay/placement/focus, Loading overlay/lock/no-layout-shift, Pulldown item/custom modes, keyboard navigation, outside click, viewport flipping, responsive layout, reduced-motion behavior, Modal/Drawer nesting, and an empty warning/error console.

- [ ] **Step 3: Add regressions before fixing any browser issue**

For each discovered issue, add the smallest failing component or integration test, run it to confirm RED, implement the fix, then rerun the focused and full suites.

- [ ] **Step 4: Review and record the final state**

Request a whole-feature code review against the specification. Address every Critical/Important finding, rerun its focused reproduction, and record any accepted Minor with its user-visible cost.

- [ ] **Step 5: Commit final fixes if any**

Run `git status --short`, stage each path changed by the final fixes explicitly, then run `git diff --cached --check` and inspect `git diff --cached`. If the staged diff contains only those reviewed fixes, commit it with:

```bash
git commit -m "fix: harden floating component interactions"
```

Do not create this commit when no final files changed, and never use `git add -A` for this step.
