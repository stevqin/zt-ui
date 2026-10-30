# Navigation and Selection Components Implementation Plan

**Goal:** Add accessible Tabs, Breadcrumb, and Segmented components with controlled state, keyboard navigation, overflow handling, and optional routing.

**Architecture:** Tabs and Breadcrumb use parent/child registration contexts so slots remain declarative while parents own ordering and navigation. Segmented accepts normalized option data and uses a real radiogroup with a visual indicator layered behind controls.

**Tech Stack:** Vue 3.5, TypeScript, SCSS, Vitest, Vue Test Utils.

**Spec:** `docs/superpowers/specs/2026-09-16-display-navigation-components-design.md`

## Global Constraints

- Complete the foundation plan first and use `ZtIcon` and `ZtScrollbar` where appropriate.
- Do not require Vue Router at runtime; use optional router injection matching Menu and Link.
- All controlled values emit updates before their corresponding change events.
- Disabled items are skipped by pointer and keyboard interactions.
- Register every component page in catalog, router, and API generation.

---

### Task 1: Tabs and TabPane



**Interfaces:**
- Produces `ZtTabsProps`, `ZtTabPaneProps`, `ZtTabName`, `ZtTabsType`, `ZtTabsPosition`, `ZtTabs`, `ZtTabPane`.
- Context registers `{ uid, name, label, disabled, closable, lazy, labelSlot, panelId, tabId }` and exposes active state.
- Emits `update:modelValue`, `tab-change`, `tab-click`, `tab-remove`, and `tab-add`.

- [ ] **Step 1: Write failing selection and accessibility tests**

```ts
it('links tabs to panels and skips a disabled tab with arrows', async () => {
  const wrapper = mount(defineComponent({
    setup: () => { const active = ref('a'); return () => h(ZtTabs, {
      modelValue: active.value,
      'onUpdate:modelValue': value => { active.value = value },
    }, () => [
      h(ZtTabPane, { name: 'a', label: '甲' }, () => '甲内容'),
      h(ZtTabPane, { name: 'b', label: '乙', disabled: true }, () => '乙内容'),
      h(ZtTabPane, { name: 'c', label: '丙' }, () => '丙内容'),
    ]) },
  }), { attachTo: document.body })
  const tabs = wrapper.findAll('[role="tab"]')
  expect(tabs[0].attributes('aria-controls')).toBe(wrapper.get('[role="tabpanel"]').attributes('id'))
  await tabs[0].trigger('keydown', { key: 'ArrowRight' })
  expect(tabs[2].element).toBe(document.activeElement)
})
```

Add tests for beforeLeave false/rejection, lazy mounting, closable precedence, add/remove events, Home/End, vertical arrow mapping, card/border-card classes, and active-tab scrolling.

- [ ] **Step 2: Run RED and implement registration/state**

Run: `npm test -- --run tests/tabs.spec.ts`

Expected: FAIL because Tabs is missing.

Use provide/inject registration with stable component uid ordering. Render pane slot content inside each TabPane so scoped state remains owned by the pane; inactive non-lazy panes use `v-show`, while lazy panes mount after first activation. Serialize `beforeLeave` attempts so stale Promise results cannot activate the wrong tab.

- [ ] **Step 3: Implement overflow and keyboard behavior**

Measure nav scrollWidth/clientWidth after registration, active changes, and ResizeObserver callbacks. Use ZtIcon buttons to scroll by 80% of the viewport and call `scrollIntoView({ block:'nearest', inline:'nearest' })` for the active tab. Keep roving tabindex on the active tab, or the first enabled tab when no active value exists.

- [ ] **Step 4: Verify, document, and commit**

Run: `npm test -- --run tests/tabs.spec.ts && npm run typecheck`

Document line/card/border-card, positions, disabled/lazy, closable/editable, overflow, dynamic panes, and beforeLeave. Register both `ZtTabs` and `ZtTabPane` in API generation.

Run: `cd site && npm test && npm run build`



### Task 2: Breadcrumb and BreadcrumbItem



**Interfaces:**
- Produces `ZtBreadcrumbItemData`, `ZtBreadcrumbProps`, `ZtBreadcrumbItemProps`, `ZtBreadcrumb`, `ZtBreadcrumbItem`.
- Supports either `items` data or declarative item children; data mode wins when non-empty.

- [ ] **Step 1: Write failing navigation, current-item, and collapse tests**

```ts
it('marks the final item current and expands collapsed middle items', async () => {
  const wrapper = mount(ZtBreadcrumb, { props: {
    maxItems: 3,
    items: [
      { label: '首页', href: '/' },
      { label: '组织' },
      { label: '团队' },
      { label: '成员' },
      { label: '详情' },
    ],
  } })
  expect(wrapper.findAll('.zt-breadcrumb__item')).toHaveLength(3)
  expect(wrapper.get('[aria-current="page"]').text()).toBe('详情')
  await wrapper.get('button[aria-label="展开完整路径"]').trigger('click')
  expect(wrapper.findAll('.zt-breadcrumb__item')).toHaveLength(5)
})
```

Add tests for custom separator slot, disabled item, string to fallback, injected router push/replace, href/download passthrough, and declarative children.

- [ ] **Step 2: Run RED and implement normalized items**

Run: `npm test -- --run tests/breadcrumb.spec.ts`

Expected: FAIL because Breadcrumb is missing.

Normalize both API forms to ordered records. Collapse only when `maxItems >= 2` and item count exceeds it: preserve the first item and final `maxItems - 1` items, inserting one expansion button. The final visible real item gets `aria-current="page"`; separators are `aria-hidden`.

- [ ] **Step 3: Verify routing, docs, and commit**

Run: `npm test -- --run tests/breadcrumb.spec.ts && npm run typecheck`

Document standard paths, custom separator, icon labels, collapsed paths, href and Router examples. Register both components in API generation.

Run: `cd site && npm test && npm run build`



### Task 3: Segmented



**Interfaces:**
- Produces `ZtSegmentedValue = string | number`, `ZtSegmentedOption`, `ZtSegmentedProps`, and `ZtSegmented`.
- Emits `update:modelValue` and `change` with the selected literal value.

- [ ] **Step 1: Write failing option and keyboard tests**

```ts
it('normalizes primitive options and skips disabled choices', async () => {
  const wrapper = mount(ZtSegmented, { props: {
    modelValue: 'list',
    options: ['list', { label: '看板', value: 'board', disabled: true }, 'calendar'],
  } })
  const radios = wrapper.findAll('[role="radio"]')
  expect(radios[0].attributes('aria-checked')).toBe('true')
  await radios[0].trigger('keydown', { key: 'ArrowRight' })
  expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['calendar'])
})
```

Add tests for numeric values, Home/End, all-disabled options, block, inherited size, all statuses, icon/label slots, and indicator transform after mocked element rectangles.

- [ ] **Step 2: Run RED and implement options/selection**

Run: `npm test -- --run tests/segmented.spec.ts`

Expected: FAIL because Segmented is missing.

Normalize primitives to `{ label:String(value), value }`; preserve object labels and disabled flags. Render buttons with radiogroup/radio semantics and roving tabindex. On keyboard movement, select the next enabled value immediately and emit update then change.

- [ ] **Step 3: Implement and verify the indicator**

Use a ResizeObserver on the root and selected element. Set CSS variables for x, y, width, height from root-relative rectangles; hide the indicator when no option matches. Disable transition under reduced motion.

Run: `npm test -- --run tests/segmented.spec.ts && npm run typecheck`

- [ ] **Step 4: Add docs and commit**

Document primitive/object options, icons, block, statuses, sizes, disabled states, and keyboard behavior. Register route/catalog/API.

Run: `cd site && npm test && npm run build`



### Task 4: Navigation regression gate

- [ ] Run: `npm test -- --run tests/tabs.spec.ts tests/breadcrumb.spec.ts tests/segmented.spec.ts tests/menu.spec.ts tests/menu-horizontal.spec.ts`
- [ ] Run: `npm test && npm run build`
- [ ] Run: `cd site && npm test && npm run build`
- [ ] Inspect `/tabs`, `/breadcrumb`, and `/segmented` under every header size and both themes, including a narrow viewport.
- [ ] Commit integration fixes only when needed with `git commit -m "fix: complete navigation component integration"`.
