# Data Display Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Descriptions, Collapse, and Result for structured metadata, disclosure, and outcome states.

**Architecture:** Descriptions and Collapse use parent/child registration contexts to retain declarative slots and centralized layout/state. Result is a stateless presentational component that consumes Icon and exposes content/action slots.

**Tech Stack:** Vue 3.5, TypeScript, SCSS, Vitest, Vue Test Utils.

**Spec:** `docs/superpowers/specs/2026-09-16-display-navigation-components-design.md`

## Global Constraints

- Complete the foundation plan first and use `ZtIcon` for state/disclosure icons.
- Preserve declaration order and slot ownership when parent components collect child metadata.
- Use semantic description/disclosure/status markup and full keyboard navigation.
- Apply ConfigProvider sizes, theme variables, and border radius.
- Register dedicated pages and generated API entries.

---

### Task 1: Descriptions and DescriptionsItem

**Files:**
- Create: `src/components/descriptions/{types.ts,context.ts,layout.ts,ZtDescriptions.vue,ZtDescriptionsItem.vue,descriptions.scss,index.ts}`
- Modify: `src/components/index.ts`
- Test: `tests/descriptions.spec.ts`
- Create: `site/src/views/descriptions/Index.vue`
- Modify: `site/src/docs/catalog.ts`
- Modify: `site/src/router/index.ts`
- Modify: `site/scripts/generate-api.mjs`

**Interfaces:**
- Produces `ZtDescriptionsDirection`, `ZtDescriptionsProps`, `ZtDescriptionsItemProps`, `ZtDescriptions`, and `ZtDescriptionsItem`.
- Pure `packDescriptionRows(items, columns)` returns ordered rows whose effective spans never exceed columns.

- [ ] **Step 1: Write failing row-packing and rendered-layout tests**

```ts
it('clips spans to the available columns without reordering items', () => {
  expect(packDescriptionRows([
    { id: 'a', span: 2 }, { id: 'b', span: 2 }, { id: 'c', span: 1 },
  ], 3)).toEqual([
    [{ id: 'a', span: 2 }, { id: 'b', span: 1 }],
    [{ id: 'c', span: 1 }],
  ])
})

it('renders labels and values as a semantic description list', () => {
  const wrapper = mount(ZtDescriptions, { props: { column: 2 }, slots: { default: () => [
    h(ZtDescriptionsItem, { label: '姓名' }, () => '林青'),
    h(ZtDescriptionsItem, { label: '部门' }, () => '设计部'),
  ] } })
  expect(wrapper.get('dl').text()).toContain('姓名')
  expect(wrapper.findAll('dt')).toHaveLength(2)
  expect(wrapper.findAll('dd')).toHaveLength(2)
})
```

- [ ] **Step 2: Run RED and implement registration/layout**

Run: `npm test -- --run tests/descriptions.spec.ts`

Expected: FAIL because modules are missing.

Register each child with stable uid and VNode-producing label/content callbacks. Clamp column and span to positive integers. Use CSS grid with `grid-column: span n`; vertical mode stacks dt/dd inside each cell, horizontal mode uses paired dt/dd. Border mode uses one shared bordered grid rather than independent card borders.

- [ ] **Step 3: Add slot, style, responsive, and inheritance tests**

Cover title/extra/label slots, colon false, align/labelAlign, widths, border, vertical direction, global size, and the mobile single-column media rule. Assert rendered behavior rather than SCSS source text.

- [ ] **Step 4: Verify, document, and commit**

Run: `npm test -- --run tests/descriptions.spec.ts && npm run typecheck`

Document basic, bordered, vertical, custom title/extra, span, alignment, and responsive examples. Register both components in API generation.

Run: `cd site && npm test && npm run build`

```bash
git add src/components/descriptions src/components/index.ts tests/descriptions.spec.ts site/src/views/descriptions site/src/docs/catalog.ts site/src/router/index.ts site/scripts/generate-api.mjs
git commit -m "feat: add descriptions components"
```

### Task 2: Collapse and CollapseItem

**Files:**
- Create: `src/components/collapse/{types.ts,context.ts,ZtCollapse.vue,ZtCollapseItem.vue,collapse.scss,index.ts}`
- Modify: `src/components/index.ts`
- Test: `tests/collapse.spec.ts`
- Create: `site/src/views/collapse/Index.vue`
- Modify: `site/src/docs/catalog.ts`
- Modify: `site/src/router/index.ts`
- Modify: `site/scripts/generate-api.mjs`

**Interfaces:**
- Produces `ZtCollapseName = string | number`, `ZtCollapseProps`, `ZtCollapseItemProps`, `ZtCollapse`, and `ZtCollapseItem`.
- Non-accordion v-model is `ZtCollapseName[]`; accordion v-model is `ZtCollapseName | null`.
- Emits `update:modelValue` then `change` with the normalized public value.

- [ ] **Step 1: Write failing state and keyboard tests**

```ts
it('keeps only one accordion item open and skips disabled headers', async () => {
  const wrapper = mount(ZtCollapse, { props: { modelValue: 'a', accordion: true }, slots: { default: () => [
    h(ZtCollapseItem, { name: 'a', title: '甲' }, () => '甲内容'),
    h(ZtCollapseItem, { name: 'b', title: '乙', disabled: true }, () => '乙内容'),
    h(ZtCollapseItem, { name: 'c', title: '丙' }, () => '丙内容'),
  ] } })
  const headers = wrapper.findAll('.zt-collapse-item__header')
  await headers[0].trigger('keydown', { key: 'ArrowDown' })
  expect(headers[2].element).toBe(document.activeElement)
  await headers[2].trigger('click')
  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['c'])
})
```

Add tests for multi-open arrays, closing active accordion item to null, Enter/Space, Home/End, disabled pointer behavior, controlled external changes, slots, status, border, and inherited size.

- [ ] **Step 2: Run RED and implement registration/state**

Run: `npm test -- --run tests/collapse.spec.ts`

Expected: FAIL because Collapse is missing.

Normalize model values without mutating prop arrays. Register item header refs for roving focus. Generate stable header/panel ids, set aria-expanded/controls/labelledby, and toggle only enabled items.

- [ ] **Step 3: Implement measured transitions**

On enter, animate height from 0 to scrollHeight then set auto; on leave, start at scrollHeight and end at 0. Cancel stale transition handlers on rapid toggles. Under reduced motion, render state immediately. Tests should dispatch `transitionend` and verify the final inline height is auto or zero.

- [ ] **Step 4: Verify, document, and commit**

Run: `npm test -- --run tests/collapse.spec.ts && npm run typecheck`

Document multi-open, accordion, disabled, title slots, status/border, and dynamic content. Register both components in API generation.

Run: `cd site && npm test && npm run build`

```bash
git add src/components/collapse src/components/index.ts tests/collapse.spec.ts site/src/views/collapse site/src/docs/catalog.ts site/src/router/index.ts site/scripts/generate-api.mjs
git commit -m "feat: add collapse components"
```

### Task 3: Result

**Files:**
- Create: `src/components/result/{types.ts,ZtResult.vue,result.scss,index.ts}`
- Modify: `src/components/index.ts`
- Test: `tests/result.spec.ts`
- Create: `site/src/views/result/Index.vue`
- Modify: `site/src/docs/catalog.ts`
- Modify: `site/src/router/index.ts`
- Modify: `site/scripts/generate-api.mjs`

**Interfaces:**
- Produces `ZtResultStatus`, `ZtResultProps`, and `ZtResult`.
- Status values: `default | primary | success | warning | danger | info | 403 | 404 | 500`.

- [ ] **Step 1: Write failing status and slot tests**

```ts
it.each([
  ['success', '操作成功'], ['warning', '需要处理'], ['404', '页面不存在'],
] as const)('renders %s with accessible status content', (status, title) => {
  const wrapper = mount(ZtResult, { props: { status, title, description: '补充说明' } })
  expect(wrapper.attributes('role')).toBe('status')
  expect(wrapper.get('.zt-result__title').text()).toBe(title)
  expect(wrapper.get('.zt-result__icon').text() || wrapper.get('.zt-result__icon').html()).not.toBe('')
})
```

Add tests for icon/title/description/extra/default slot precedence, inherited size, status classes, and HTTP status number output.

- [ ] **Step 2: Run RED and implement Result**

Run: `npm test -- --run tests/result.spec.ts`

Expected: FAIL because Result is missing.

Map semantic statuses to named Icon components and HTTP statuses to large text illustrations. Render sections only when their prop or slot exists. Keep actions entirely in `extra`; do not add router or retry logic.

- [ ] **Step 3: Verify, document, and commit**

Run: `npm test -- --run tests/result.spec.ts && npm run typecheck`

Document six semantic statuses, three HTTP states, custom icon/content, and action buttons. Register route/catalog/API.

Run: `cd site && npm test && npm run build`

```bash
git add src/components/result src/components/index.ts tests/result.spec.ts site/src/views/result site/src/docs/catalog.ts site/src/router/index.ts site/scripts/generate-api.mjs
git commit -m "feat: add result component"
```

### Task 4: Data display regression gate

- [ ] Run: `npm test -- --run tests/descriptions.spec.ts tests/collapse.spec.ts tests/result.spec.ts`
- [ ] Run: `npm test && npm run build`
- [ ] Run: `cd site && npm test && npm run build`
- [ ] Inspect `/descriptions`, `/collapse`, and `/result` at narrow and wide widths in light/dark themes.
- [ ] Commit integration fixes only when needed with `git commit -m "fix: complete data display component integration"`.
