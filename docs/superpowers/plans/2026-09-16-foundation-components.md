# Foundation Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add production-ready Icon, Link, Text, and Scrollbar components with consistent configuration, accessibility, documentation, and tests.

**Architecture:** Each component owns a focused Vue SFC, public types, and SCSS. Icon provides the shared visual primitive used by later plans; Link optionally consumes an injected Vue Router without adding a dependency; Scrollbar preserves a native scrolling element while rendering platform-independent tracks.

**Tech Stack:** Vue 3.5, TypeScript 5.8, SCSS, Vitest, Vue Test Utils, Vite.

**Spec:** `docs/superpowers/specs/2026-09-16-display-navigation-components-design.md`

## Global Constraints

- Preserve the existing public exports and do not add runtime dependencies.
- Use `useZtSize` and existing CSS tokens for size, theme, status, and radius behavior.
- Use TDD: add one observable failing behavior, run it, then implement the behavior.
- Support `prefers-reduced-motion` and semantic keyboard/focus behavior.
- Add each component to the site catalog, router, generated API configuration, and a dedicated demo page.

---

### Task 1: Icon

**Files:**
- Create: `src/components/icon/types.ts`
- Create: `src/components/icon/icons.ts`
- Create: `src/components/icon/ZtIcon.vue`
- Create: `src/components/icon/icon.scss`
- Create: `src/components/icon/index.ts`
- Modify: `src/components/index.ts`
- Test: `tests/icon.spec.ts`
- Create: `site/src/views/icon/Index.vue`
- Modify: `site/src/docs/catalog.ts`
- Modify: `site/src/router/index.ts`
- Modify: `site/scripts/generate-api.mjs`
- Modify: `README.md`

**Interfaces:**
- Produces `ZtIconName`, `ZtIconStatus`, `ZtIconProps`, `ZtIcon`, and named icon components such as `ZtSearchIcon` and `ZtCloseIcon`.
- `ZtIconProps`: `name?`, `component?`, `size?`, `color?`, `status?`, `rotate?`, `spin?`, `strokeWidth?`, `label?`.

- [ ] **Step 1: Write failing public-behavior tests**

```ts
it('renders a named icon with inherited size and accessible labeling', () => {
  const wrapper = mount(ZtConfigProvider, {
    props: { size: 'large' },
    slots: { default: () => h(ZtIcon, { name: 'search', label: '搜索' }) },
  })
  const icon = wrapper.get('[role="img"]')
  expect(icon.attributes('aria-label')).toBe('搜索')
  expect(icon.classes()).toContain('zt-icon--large')
  expect(icon.find('svg').exists()).toBe(true)
})

it('prefers slot content and hides decorative icons from assistive technology', () => {
  const wrapper = mount(ZtIcon, { slots: { default: '<b>自定义</b>' } })
  expect(wrapper.attributes('aria-hidden')).toBe('true')
  expect(wrapper.text()).toBe('自定义')
})
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- --run tests/icon.spec.ts`

Expected: FAIL because `ZtIcon` is not exported.

- [ ] **Step 3: Implement the icon registry and component**

Define a literal `iconPaths` registry for all names in the spec and a factory that renders the shared `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"` SVG contract. `ZtIcon.vue` must choose slot → component → name, normalize numeric size to pixels, clamp non-finite rotation to zero, and use this accessibility expression:

```ts
const accessibility = computed(() => props.label
  ? { role: 'img', 'aria-label': props.label }
  : { 'aria-hidden': 'true' })
```

Export the registry names and named components from `src/components/icon/index.ts`; export that module from the component barrel.

- [ ] **Step 4: Run focused tests and typecheck**

Run: `npm test -- --run tests/icon.spec.ts && npm run typecheck`

Expected: PASS.

- [ ] **Step 5: Add the Icon documentation page and API registration**

Demonstrate the icon gallery, custom component, slot, sizes, statuses, rotation, spin, and accessible label. Register `/icon`, `Icon` catalog metadata, and generator config `icon:['icon','ZtIcon']`.

- [ ] **Step 6: Verify documentation and commit**

Run: `cd site && npm test && npm run build`

Commit:

```bash
git add src/components/icon src/components/index.ts tests/icon.spec.ts site/src/views/icon site/src/docs/catalog.ts site/src/router/index.ts site/scripts/generate-api.mjs README.md
git commit -m "feat: add icon component"
```

### Task 2: Link and Text

**Files:**
- Create: `src/components/link/{ZtLink.vue,index.ts,link.scss,types.ts}`
- Create: `src/components/text/{ZtText.vue,index.ts,text.scss,types.ts}`
- Modify: `src/components/index.ts`
- Test: `tests/link-text.spec.ts`
- Create: `site/src/views/link/Index.vue`
- Create: `site/src/views/text/Index.vue`
- Modify: `site/src/docs/catalog.ts`
- Modify: `site/src/router/index.ts`
- Modify: `site/scripts/generate-api.mjs`
- Modify: `README.md`

**Interfaces:**
- Produces `ZtLinkProps`, `ZtLinkStatus`, `ZtTextProps`, `ZtTextTag`, `ZtTextStatus`, `ZtLink`, and `ZtText`.
- Link consumes the existing optional injected router convention used by Menu; it must not import `vue-router`.
- Link uses `ZtIcon` for `icon` and `suffixIcon` values and also exposes icon slots.

- [ ] **Step 1: Write failing Link and Text behavior tests**

```ts
it('makes disabled links non-navigable and secures blank targets', async () => {
  const disabled = mount(ZtLink, { props: { href: '/delete', disabled: true } })
  expect(disabled.attributes('href')).toBeUndefined()
  expect(disabled.attributes('aria-disabled')).toBe('true')
  await disabled.trigger('click')
  expect(disabled.emitted('click')).toBeUndefined()
  const blank = mount(ZtLink, { props: { href: 'https://example.com', target: '_blank' } })
  expect(blank.attributes('rel')).toBe('noopener noreferrer')
})

it('applies line clamp and derives a title from plain text', () => {
  const wrapper = mount(ZtText, { props: { lineClamp: 2 }, slots: { default: '一段较长文字' } })
  expect(wrapper.attributes('title')).toBe('一段较长文字')
  expect(wrapper.attributes('style')).toContain('-webkit-line-clamp: 2')
})
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- --run tests/link-text.spec.ts`

Expected: FAIL because both components are missing.

- [ ] **Step 3: Implement Link**

Render an anchor for navigable values and prevent activation when disabled. Compute rel as:

```ts
const safeRel = computed(() => props.rel ?? (props.target === '_blank' ? 'noopener noreferrer' : undefined))
```

For `to`, read the optional router via the same injection key used by Menu; string values become href when no router exists, while object values remain without href and warn once in development. Apply status, size, underline, and focus classes.

- [ ] **Step 4: Implement Text**

Whitelist the tags from the spec, fall back to `span`, normalize lineClamp to a positive integer, and use `-webkit-box` only when lineClamp is active. Derive title only when the default slot consists entirely of text VNodes.

- [ ] **Step 5: Run focused tests and typecheck**

Run: `npm test -- --run tests/link-text.spec.ts && npm run typecheck`

Expected: PASS.

- [ ] **Step 6: Add both documentation pages and commit**

Register `/link`, `/text`, their catalog entries, and generator entries. Each page must show states, sizes, icons, disabled behavior, semantic tags, and truncation.

Run: `cd site && npm test && npm run build`

Commit:

```bash
git add src/components/link src/components/text src/components/index.ts tests/link-text.spec.ts site/src/views/link site/src/views/text site/src/docs/catalog.ts site/src/router/index.ts site/scripts/generate-api.mjs README.md
git commit -m "feat: add link and text components"
```

### Task 3: Scrollbar

**Files:**
- Create: `src/components/scrollbar/types.ts`
- Create: `src/components/scrollbar/scrollbar.ts`
- Create: `src/components/scrollbar/ZtScrollbar.vue`
- Create: `src/components/scrollbar/scrollbar.scss`
- Create: `src/components/scrollbar/index.ts`
- Modify: `src/components/index.ts`
- Test: `tests/scrollbar.spec.ts`
- Create: `site/src/views/scrollbar/Index.vue`
- Modify: `site/src/docs/catalog.ts`
- Modify: `site/src/router/index.ts`
- Modify: `site/scripts/generate-api.mjs`
- Modify: `site/scripts/api-overrides.mjs`
- Modify: `README.md`

**Interfaces:**
- Produces `ZtScrollbarProps`, `ZtScrollbarScroll`, `ZtScrollbarInstance`, `ZtScrollbar`, and pure `calculateThumb(viewport, content, offset, minSize)` geometry.
- Instance methods: `update(): void`, `scrollTo(optionsOrX, y?): void`, `setScrollTop(value): void`, `setScrollLeft(value): void`; readonly `wrapRef`.

- [ ] **Step 1: Write failing geometry and component tests**

```ts
it('derives a minimum thumb and maps scroll to its track', () => {
  expect(calculateThumb(100, 1000, 450, 20)).toEqual({ size: 20, offset: 40 })
  expect(calculateThumb(100, 100, 0, 20)).toEqual({ size: 0, offset: 0 })
})

it('emits native scroll positions and exposes scrolling methods', async () => {
  const wrapper = mount(ZtScrollbar, { props: { height: 100 }, slots: { default: '<div style="height:500px">内容</div>' } })
  const wrap = wrapper.get('.zt-scrollbar__wrap').element as HTMLElement
  Object.assign(wrap, { scrollTop: 36, scrollLeft: 4 })
  await wrapper.get('.zt-scrollbar__wrap').trigger('scroll')
  expect(wrapper.emitted('scroll')?.[0]).toEqual([{ scrollTop: 36, scrollLeft: 4 }])
  wrapper.vm.setScrollTop(72)
  expect(wrap.scrollTop).toBe(72)
})
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- --run tests/scrollbar.spec.ts`

Expected: FAIL because the geometry helper and component do not exist.

- [ ] **Step 3: Implement geometry, native wrapper, and instance methods**

Use literal geometry formulas with finite guards:

```ts
const ratio = viewport / content
const size = Math.max(minSize, viewport * ratio)
const offset = content <= viewport ? 0 : (scroll / (content - viewport)) * (viewport - size)
```

Keep `.zt-scrollbar__wrap` as the actual `overflow:auto` element. Render custom tracks only when `native` is false. Forward `$attrs` to the wrap element and expose the methods from the interface.

- [ ] **Step 4: Add ResizeObserver, pointer dragging, and track paging tests**

Extend `tests/scrollbar.spec.ts` with a controllable ResizeObserver fake and literal pointer coordinates. Assert that observer callbacks update thumb styles, pointer movement changes scrollTop, track click changes it by exactly one clientHeight, and unmount disconnects the observer and document listeners.

- [ ] **Step 5: Implement observer and pointer lifecycle**

Observe both wrap and view unless `noresize`; always update on native scroll and window resize. Capture pointer id on thumb, calculate scroll delta by `(pointerDelta / availableTrack) * availableScroll`, and remove listeners on pointerup, pointercancel, and unmount.

- [ ] **Step 6: Run tests, add docs, and commit**

Run: `npm test -- --run tests/scrollbar.spec.ts && npm run typecheck`

Create examples for fixed height, max height, horizontal content, always-visible tracks, native mode, and imperative scrolling. Register API method signatures in `api-overrides.mjs`.

Run: `cd site && npm test && npm run build`

Commit:

```bash
git add src/components/scrollbar src/components/index.ts tests/scrollbar.spec.ts site/src/views/scrollbar site/src/docs/catalog.ts site/src/router/index.ts site/scripts/generate-api.mjs site/scripts/api-overrides.mjs README.md
git commit -m "feat: add scrollbar component"
```

### Task 4: Foundation regression gate

**Files:**
- Modify only files required by observed failures.

- [ ] **Step 1: Run full library verification**

Run: `npm test && npm run build`

Expected: all tests and type generation pass.

- [ ] **Step 2: Run full documentation verification**

Run: `cd site && npm test && npm run build`

Expected: API generation includes Icon, Link, Text, and Scrollbar; all site tests and build pass.

- [ ] **Step 3: Inspect the four pages in light/dark and mini/large settings**

Use the running site at `/icon`, `/link`, `/text`, and `/scrollbar`. Verify header settings affect page examples and no page-level scrollbar replaces the content-area scrollbar.

- [ ] **Step 4: Commit only regression fixes if needed**

```bash
git add src tests site README.md
git commit -m "fix: complete foundation component integration"
```
