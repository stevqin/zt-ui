# Modal, Drawer, Checkbox and Site Examples Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修正 Checkbox 选中标记，并交付具备完整弹层交互的 ZtModal、ZtDrawer 及全站可查看复制的 Vue + TypeScript 示例。

**Architecture:** Modal 与 Drawer 各自负责结构和视觉表现，共用 `overlayManager.ts` 管理层级与滚动锁、`useOverlay.ts` 管理生命周期、焦点和关闭拦截。演示站统一通过 `DemoBlock` 显示和复制完整 SFC 示例。

**Tech Stack:** Vue 3.5、TypeScript 5.8+、Vite 6、Vitest、Vue Test Utils、happy-dom、SCSS。

**Spec:** `docs/superpowers/specs/2026-09-14-modal-drawer-site-examples-design.md`

## Global Constraints

- 对外组件名称固定为 `ZtModal` 与 `ZtDrawer`，仅提供 Vue 组件式 API。
- 关闭原因固定为 `'close' | 'cancel' | 'confirm' | 'mask' | 'escape' | 'api'`。
- 遮罩默认不可关闭，Escape 默认可关闭，默认锁定滚动并自动聚焦。
- 不依赖 bip_frontend 的业务组件、图标、状态或样式。
- 每个 site 演示块提供完整 Vue + TypeScript SFC 示例及复制按钮。
- 当前目录不是 Git 仓库，各任务以测试和构建为审查检查点，不执行 commit。

---

### Task 1: Test Harness and Checkbox Alignment

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `vitest.config.ts`
- Create: `tests/checkbox-style.spec.ts`
- Modify: `src/components/checkbox/checkbox.scss`

**Interfaces:**
- Consumes: existing `.zt-checkbox__inner` and `::after` selectors.
- Produces: `npm test` and centered checkmark style rules used by all Checkbox sizes.

- [ ] **Step 1: Install test dependencies and add script**

Add `vitest`, `@vue/test-utils`, and `happy-dom` as dev dependencies and add:

```json
"test": "vitest run"
```

- [ ] **Step 2: Write the failing style test**

Create a test that reads `checkbox.scss` and asserts:

```ts
expect(source).toContain('box-sizing: border-box')
expect(source).toMatch(/top:\s*50%/)
expect(source).toMatch(/left:\s*50%/)
expect(source).not.toMatch(/&--mini[\s\S]*?&::after\s*\{[^}]*left:\s*3px/)
```

- [ ] **Step 3: Run the test and verify RED**

Run: `npm test -- tests/checkbox-style.spec.ts`

Expected: FAIL because the inner square is content-box and uses per-size absolute offsets.

- [ ] **Step 4: Center the square and marks**

Set `.zt-checkbox__inner` to border-box. Position the checkmark at 50%/50% using translate plus rotate and scale. Let size modifiers change width and height only. Preserve the centered translation for the indeterminate line.

- [ ] **Step 5: Run the test and verify GREEN**

Run: `npm test -- tests/checkbox-style.spec.ts`

Expected: PASS.

### Task 2: Overlay Manager and Lifecycle Composable

**Files:**
- Create: `src/components/overlay/types.ts`
- Create: `src/components/overlay/overlayManager.ts`
- Create: `src/components/overlay/useOverlay.ts`
- Create: `tests/overlay-manager.spec.ts`
- Create: `tests/use-overlay.spec.ts`

**Interfaces:**
- Produces `ZtOverlayCloseReason`, `ZtOverlayCommonProps`, `enterOverlay(id, baseZIndex)`, `leaveOverlay(id)`, `isTopOverlay(id)`, `lockBody(id)`, `unlockBody(id)`, and `useOverlay(options)`.
- `useOverlay` returns `visible`, `alive`, `busy`, `layer`, `isTop`, `panel`, `requestClose`, `confirm`, `cancel`, `maskDown`, `maskClick`, `afterEnter`, `afterLeave`, and `focusPanel`.

- [ ] **Step 1: Write failing manager tests**

Cover monotonically increasing layer values, top overlay changes after leave, duplicate enter protection, scroll lock reference counting, and restoration of the body's prior `overflow` and `paddingRight`.

- [ ] **Step 2: Run manager tests and verify RED**

Run: `npm test -- tests/overlay-manager.spec.ts`

Expected: FAIL because the overlay module does not exist.

- [ ] **Step 3: Implement the manager**

Use module-local arrays/maps and exported functions. Compensate for scrollbar width only when positive. Restore the exact prior inline body styles after the last lock is removed.

- [ ] **Step 4: Run manager tests and verify GREEN**

Run: `npm test -- tests/overlay-manager.spec.ts`

Expected: PASS.

- [ ] **Step 5: Write failing composable tests**

Mount a small harness component and assert: open emits once; Escape closes only the top overlay; mask requires matching down/click targets; `beforeClose` false refuses close; pending async close blocks duplicates; focus moves in and restores; focus trap loops Tab.

- [ ] **Step 6: Run composable tests and verify RED**

Run: `npm test -- tests/use-overlay.spec.ts`

Expected: FAIL because `useOverlay` does not exist.

- [ ] **Step 7: Implement the composable**

Use `watch`, `nextTick`, `onBeforeUnmount`, and document capture listeners. Keep close commits centralized so `update:modelValue`, `close`, and `cancel` fire in a consistent order. Treat thrown/rejected `beforeClose` as a refused close and emit `close-error`.

- [ ] **Step 8: Run composable tests and verify GREEN**

Run: `npm test -- tests/use-overlay.spec.ts`

Expected: PASS.

### Task 3: ZtModal

**Files:**
- Create: `src/components/modal/types.ts`
- Create: `src/components/modal/ZtModal.vue`
- Create: `src/components/modal/modal.scss`
- Create: `src/components/modal/index.ts`
- Create: `tests/modal.spec.ts`
- Modify: `src/components/index.ts`

**Interfaces:**
- Consumes: `ZtOverlayCommonProps`, `ZtOverlayCloseReason`, `useOverlay`, and `ZtButton`.
- Produces: `ZtModal`, `ZtModalProps`, and modal events/slots defined in the spec.

- [ ] **Step 1: Write failing component tests**

Assert Teleport rendering, accessible dialog labeling, width/top/fullscreen styles, close button behavior, default footer confirm/cancel events, named slots, destroy-on-close, and exposed `open`, `close`, `focus` methods.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test -- tests/modal.spec.ts`

Expected: FAIL because ZtModal is not implemented.

- [ ] **Step 3: Implement types and component structure**

Implement a Teleport + Transition component with header, body, optional footer, close icon SVG, and ZtButton actions. Use a generated title id and forward non-prop attributes to the overlay root.

- [ ] **Step 4: Implement Modal styling**

Create centered/top/fullscreen variants, glass panel styling, loading/disabled states, enter/leave motion, responsive max bounds, focus styles, and reduced-motion rules using existing tokens.

- [ ] **Step 5: Export and run tests**

Run: `npm test -- tests/modal.spec.ts`

Expected: PASS.

### Task 4: ZtDrawer

**Files:**
- Create: `src/components/drawer/types.ts`
- Create: `src/components/drawer/ZtDrawer.vue`
- Create: `src/components/drawer/drawer.scss`
- Create: `src/components/drawer/index.ts`
- Create: `tests/drawer.spec.ts`
- Modify: `src/components/index.ts`

**Interfaces:**
- Consumes: shared overlay interfaces and `ZtButton`.
- Produces: `ZtDrawer`, `ZtDrawerProps`, and `ZtDrawerPlacement`.

- [ ] **Step 1: Write failing Drawer tests**

Assert right placement defaults, all four placement classes, numeric/string size conversion, horizontal size mapped to width, vertical size mapped to height, slots/events, and accessible close behavior.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test -- tests/drawer.spec.ts`

Expected: FAIL because ZtDrawer is not implemented.

- [ ] **Step 3: Implement Drawer**

Reuse the overlay composable and use a placement-derived panel style. Keep event, slot, footer, and exposed-method behavior aligned with Modal.

- [ ] **Step 4: Implement directional styling**

Use placement modifier classes for flex alignment, attached-edge border radius, shadow direction, and translate-based transitions. Cap width/height at the viewport.

- [ ] **Step 5: Export and run tests**

Run: `npm test -- tests/drawer.spec.ts`

Expected: PASS.

### Task 5: DemoBlock Code Viewer and Copy

**Files:**
- Modify: `site/src/components/DemoBlock.vue`
- Modify: `site/src/style.scss`
- Create: `site/src/components/DemoBlock.spec.ts`
- Modify: `site/package.json`
- Modify: `site/package-lock.json`
- Create: `site/vitest.config.ts`

**Interfaces:**
- Consumes: `code: string`, optional `desc: string`.
- Produces: expand/collapse UI, `Vue + TypeScript` label, clipboard copy action, polite success/error feedback.

- [ ] **Step 1: Add site test dependencies and write failing tests**

Test the initial collapsed state, expanded code text, successful `navigator.clipboard.writeText(code)`, “已复制” feedback reset, and “复制失败” on rejection.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test --prefix site -- src/components/DemoBlock.spec.ts`

Expected: FAIL because copy controls do not exist.

- [ ] **Step 3: Implement copy interaction**

Add a code header inside the expanded source, copy button, `aria-live` status, timeout cleanup on unmount, and a textarea/`execCommand('copy')` fallback when Clipboard API is unavailable.

- [ ] **Step 4: Style and verify GREEN**

Style the code toolbar and compact action controls, then run the same site test and expect PASS.

### Task 6: Convert Existing Site Pages to Complete SFC Examples

**Files:**
- Modify: `site/src/views/button/Index.vue`
- Modify: `site/src/views/tag/Index.vue`
- Modify: `site/src/views/radio/Index.vue`
- Modify: `site/src/views/checkbox/Index.vue`
- Modify: `site/src/views/switch/Index.vue`
- Modify: `site/src/views/badge/Index.vue`

**Interfaces:**
- Consumes: enhanced `DemoBlock`.
- Produces: one complete `lang="ts"` SFC string per visual demo and no raw `.doc-demo` containers.

- [ ] **Step 1: Add an audit script/test**

Create a temporary read-only audit command that checks each page contains `DemoBlock`, each `<DemoBlock>` receives `:code`, every code string contains `<script setup lang="ts">`, and no page retains raw `<div class="doc-demo">`.

- [ ] **Step 2: Run audit and verify RED**

Expected: Radio, Checkbox, Switch, Tag, and Badge fail; Button fails the complete-SFC requirement.

- [ ] **Step 3: Convert each page**

Import `DemoBlock`; define a complete SFC string for every demonstration; replace raw demo wrappers while preserving previews, descriptions, state, and API tables. Include only state and handlers needed by each copied example.

- [ ] **Step 4: Run audit and verify GREEN**

Expected: all six pages satisfy the structural checks.

### Task 7: Modal and Drawer Documentation Pages

**Files:**
- Create: `site/src/views/modal/Index.vue`
- Create: `site/src/views/drawer/Index.vue`
- Modify: `site/src/router/index.ts`
- Modify: `site/src/App.vue`

**Interfaces:**
- Consumes: ZtModal, ZtDrawer, ZtButton, DemoBlock.
- Produces: `/modal` and `/drawer` routes with interactive demos, complete copyable SFC examples, Props/Events/Slots tables, and navigation entries.

- [ ] **Step 1: Write failing route/document audit**

Assert both route paths and navigation labels exist, each page has at least basic, footer/loading or placement demos, every demo has complete TypeScript code, and API tables document the exported props/events/slots.

- [ ] **Step 2: Run audit and verify RED**

Expected: FAIL because pages and routes do not exist.

- [ ] **Step 3: Implement Modal page**

Include basic opening, footer/confirm-loading, mask/Escape behavior, fullscreen, and async `beforeClose` examples. Keep demo state isolated per example.

- [ ] **Step 4: Implement Drawer page**

Include basic right drawer, four placements, footer/loading, custom size, and async `beforeClose` examples.

- [ ] **Step 5: Register routes/navigation and verify audit GREEN**

Expected: all documentation checks pass.

### Task 8: Full Verification and Visual QA

**Files:**
- Modify only files implicated by verification failures.

**Interfaces:**
- Consumes all prior tasks.
- Produces a passing, visually verified library and site.

- [ ] **Step 1: Run all unit tests**

Run: `npm test`

Run: `npm test --prefix site`

Expected: zero failures.

- [ ] **Step 2: Build library and site**

Run: `npm run build`

Run: `npm run build --prefix site`

Expected: type checks and production builds exit 0.

- [ ] **Step 3: Inspect declaration output**

Confirm `dist/index.d.ts` exports ZtModal/ZtDrawer and their public types, and no internal manager symbols are exposed unintentionally.

- [ ] **Step 4: Browser visual verification**

Open the site and inspect Checkbox sizes/checked/indeterminate states, Modal centered/top/fullscreen behavior, Drawer placements, animations, focus, Escape, mask behavior, and code expand/copy controls on all eight component pages.

- [ ] **Step 5: Re-run affected tests and builds after visual fixes**

Expected: all commands remain green after final styling changes.
