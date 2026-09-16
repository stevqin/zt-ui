# Popover and Popconfirm Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add reusable anchored floating content and an accessible asynchronous confirmation flow.

**Architecture:** A pure positioning module computes placement and viewport collision handling. `usePopover` owns trigger timers, global listener lifecycle, Teleport positioning, and parent-overlay branch registration; Popover renders that behavior and Popconfirm composes Popover with Button and Icon.

**Tech Stack:** Vue 3.5, TypeScript, SCSS, Vitest, Vue Test Utils, existing overlay context.

**Spec:** `docs/superpowers/specs/2026-09-16-display-navigation-components-design.md`

## Global Constraints

- Complete `2026-09-16-foundation-components.md` first; consume `ZtIcon` and existing `ZtButton` public APIs.
- Do not add Popper/Floating UI or another dependency.
- Floating content must inherit ConfigProvider CSS variables when teleported.
- Global listeners exist only while visible and are removed on close/unmount.
- Preserve focus and Escape behavior inside Modal and Drawer via `overlayContextKey` branch registration.

---

### Task 1: Positioning and Popover

**Files:**
- Create: `src/components/popover/types.ts`
- Create: `src/components/popover/position.ts`
- Create: `src/components/popover/usePopover.ts`
- Create: `src/components/popover/ZtPopover.vue`
- Create: `src/components/popover/popover.scss`
- Create: `src/components/popover/index.ts`
- Modify: `src/components/index.ts`
- Test: `tests/popover-position.spec.ts`
- Test: `tests/popover.spec.ts`
- Create: `site/src/views/popover/Index.vue`
- Modify: `site/src/docs/catalog.ts`
- Modify: `site/src/router/index.ts`
- Modify: `site/scripts/generate-api.mjs`
- Modify: `site/scripts/api-overrides.mjs`

**Interfaces:**
- Produces `ZtPopoverTrigger`, `ZtPopoverPlacement`, `ZtPopoverProps`, `ZtPopoverInstance`, `ZtPopover`.
- Produces pure `placePopover(triggerRect, popupRect, viewport, placement, offset)` returning `{ top, left, placement, arrowX?, arrowY? }`.
- Instance: `show()`, `hide()`, `toggle()`, `updatePosition()`.

- [ ] **Step 1: Write failing positioning tests**

```ts
it('flips bottom to top and clamps the cross axis', () => {
  const placed = placePopover(
    { top: 170, bottom: 190, left: 260, right: 290, width: 30, height: 20 },
    { width: 120, height: 80 },
    { width: 300, height: 220, padding: 8 },
    'bottom-end',
    8,
  )
  expect(placed).toMatchObject({ placement: 'top-end', top: 82, left: 170 })
})
```

- [ ] **Step 2: Run RED and implement positioning**

Run: `npm test -- --run tests/popover-position.spec.ts`

Expected: FAIL because the module is missing.

Compute the requested main-axis position, flip when the requested side lacks space and the opposite side has more, then clamp left/top to viewport padding. Derive arrow offsets from the trigger center after clamping.

Run: `npm test -- --run tests/popover-position.spec.ts`

Expected: PASS.

- [ ] **Step 3: Write failing trigger and lifecycle tests**

```ts
it('opens by click, closes outside and restores trigger focus on Escape', async () => {
  const wrapper = mount(ZtPopover, {
    attachTo: document.body,
    props: { trigger: 'click' },
    slots: { default: '<button>打开</button>', content: '<button>内容按钮</button>' },
  })
  await wrapper.get('button').trigger('click')
  expect(document.body.querySelector('[role="dialog"]')).not.toBeNull()
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  await nextTick()
  expect(document.body.querySelector('[role="dialog"]')).toBeNull()
  expect(document.activeElement?.textContent).toBe('打开')
})
```

Add separate tests for hover transit between trigger/popup, focus leaving both branches, manual mode, disabled mode, delayed timers, scroll/resize repositioning, and listener cleanup.

- [ ] **Step 4: Run RED and implement Popover**

Run: `npm test -- --run tests/popover.spec.ts`

Expected: FAIL because `ZtPopover` is missing.

Use a single trigger wrapper with event handlers selected by `trigger`. Teleport content when configured. Register a parent overlay branch with `{ trigger, popup, visible, close, focus, tabThroughPopup:true }`. Use `requestAnimationFrame` to coalesce reposition calls and clear timers/listeners in `onBeforeUnmount`.

- [ ] **Step 5: Verify, document, and commit**

Run: `npm test -- --run tests/popover-position.spec.ts tests/popover.spec.ts && npm run typecheck`

Document all triggers, placements, rich content, width, disabled, manual control, and use inside Modal. Register route, catalog, generator, and instance overrides.

Run: `cd site && npm test && npm run build`

```bash
git add src/components/popover src/components/index.ts tests/popover-position.spec.ts tests/popover.spec.ts site/src/views/popover site/src/docs/catalog.ts site/src/router/index.ts site/scripts
git commit -m "feat: add popover component"
```

### Task 2: Popconfirm

**Files:**
- Create: `src/components/popconfirm/types.ts`
- Create: `src/components/popconfirm/ZtPopconfirm.vue`
- Create: `src/components/popconfirm/popconfirm.scss`
- Create: `src/components/popconfirm/index.ts`
- Modify: `src/components/index.ts`
- Test: `tests/popconfirm.spec.ts`
- Create: `site/src/views/popconfirm/Index.vue`
- Modify: `site/src/docs/catalog.ts`
- Modify: `site/src/router/index.ts`
- Modify: `site/scripts/generate-api.mjs`

**Interfaces:**
- Consumes `ZtPopover`, `ZtButton`, and `ZtIcon`.
- Produces `ZtPopconfirmProps` and `ZtPopconfirm`; `beforeConfirm?: () => boolean | void | Promise<boolean | void>`.
- Emits `confirm`, `cancel`, `confirm-error`, and `update:visible`.

- [ ] **Step 1: Write failing synchronous and asynchronous tests**

```ts
it('waits for async confirmation and closes after success', async () => {
  let finish!: () => void
  const wrapper = mount(ZtPopconfirm, {
    attachTo: document.body,
    props: { title: '删除记录？', beforeConfirm: () => new Promise<void>(resolve => { finish = resolve }) },
    slots: { default: '<button>删除</button>' },
  })
  await wrapper.get('button').trigger('click')
  const buttons = [...document.body.querySelectorAll<HTMLButtonElement>('.zt-popconfirm button')]
  buttons.find(button => button.textContent === '确定')?.click()
  await nextTick()
  expect(buttons.every(button => button.disabled)).toBe(true)
  finish()
  await flushPromises()
  expect(wrapper.emitted('confirm')).toHaveLength(1)
  expect(document.body.querySelector('.zt-popconfirm')).toBeNull()
})
```

Add tests that false keeps the panel open, rejection emits the exact error and unlocks buttons, cancel closes, hideAfterConfirm=false remains open, and rapid confirm clicks invoke the hook once.

- [ ] **Step 2: Run RED and implement confirmation state**

Run: `npm test -- --run tests/popconfirm.spec.ts`

Expected: FAIL because the component is missing.

Track an internal `confirming` boolean. On confirmation, await the hook, stop on false, emit confirm on success, and close only when `hideAfterConfirm`; on rejection emit `confirm-error` and keep visible. Combine external `confirmLoading` with internal confirming for button loading/disabled state.

- [ ] **Step 3: Verify, document, and commit**

Run: `npm test -- --run tests/popconfirm.spec.ts tests/popover.spec.ts && npm run typecheck`

Document basic confirmation, descriptions, statuses, custom icon, async confirmation, disabled buttons, and controlled visibility. Register route/catalog/API.

Run: `cd site && npm test && npm run build`

```bash
git add src/components/popconfirm src/components/index.ts tests/popconfirm.spec.ts site/src/views/popconfirm site/src/docs/catalog.ts site/src/router/index.ts site/scripts/generate-api.mjs
git commit -m "feat: add popconfirm component"
```

### Task 3: Overlay regression gate

- [ ] Run: `npm test -- --run tests/popover-position.spec.ts tests/popover.spec.ts tests/popconfirm.spec.ts tests/modal.spec.ts tests/drawer.spec.ts tests/use-overlay.spec.ts tests/overlay-manager.spec.ts`
- [ ] Run: `npm test && npm run build`
- [ ] Run: `cd site && npm test && npm run build`
- [ ] Inspect `/popover` and `/popconfirm` inside light/dark themes and inside a Modal; verify no clipped content, leaked scroll lock, or Escape conflict.
- [ ] Commit observed integration fixes with `git commit -m "fix: complete anchored overlay integration"` only when fixes exist.
