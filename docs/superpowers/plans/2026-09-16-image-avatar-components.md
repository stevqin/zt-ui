# Image and Avatar Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add resilient image display, a full accessible image viewer, and flexible avatars with deterministic fallbacks.

**Architecture:** `ZtImage` owns loading state and delegates preview UI to a focused internal `ZtImageViewer`. A pure transform module handles index, scale, rotation, and pan normalization. Avatar remains independent and lightweight, sharing only public Icon and size/token conventions.

**Tech Stack:** Vue 3.5, TypeScript, SCSS, Vitest, Vue Test Utils, existing overlay manager primitives.

**Spec:** `docs/superpowers/specs/2026-09-16-display-navigation-components-design.md`

## Global Constraints

- Complete Icon before this plan.
- Do not fetch remote demo assets; add deterministic SVG files under `site/public/image-demo/`.
- Preview must lock body scrolling, remain topmost with existing overlays, restore focus, and release listeners on every close path.
- Use native image loading and decoding behavior; do not add an image processing dependency.
- Register dedicated Image and Avatar pages and generated API entries.

---

### Task 1: Image loading states

**Files:**
- Create: `src/components/image/types.ts`
- Create: `src/components/image/ZtImage.vue`
- Create: `src/components/image/image.scss`
- Create: `src/components/image/index.ts`
- Modify: `src/components/index.ts`
- Test: `tests/image.spec.ts`

**Interfaces:**
- Produces `ZtImageFit`, `ZtImageProps`, `ZtImage`, and events `load`, `error`, `show`, `switch`, `close`.
- Image props include all values in the Image section of the spec; `previewSrcList` defaults to `[]`.

- [ ] **Step 1: Write failing loading/error/reset tests**

```ts
it('moves from placeholder to image and resets when src changes', async () => {
  const wrapper = mount(ZtImage, {
    props: { src: '/first.svg', alt: '第一张' },
    slots: { placeholder: '<span>正在加载</span>', error: '<span>加载失败</span>' },
  })
  expect(wrapper.text()).toContain('正在加载')
  await wrapper.get('img').trigger('load')
  expect(wrapper.text()).not.toContain('正在加载')
  await wrapper.setProps({ src: '/second.svg' })
  expect(wrapper.text()).toContain('正在加载')
  await wrapper.get('img').trigger('error')
  expect(wrapper.text()).toContain('加载失败')
})
```

Add tests for fit/objectPosition, lazy → `loading="lazy"`, forwarded image attributes, load/error event payloads, and no interactive tabindex when previewSrcList is empty.

- [ ] **Step 2: Run RED and implement loading states**

Run: `npm test -- --run tests/image.spec.ts`

Expected: FAIL because Image is missing.

Track `loading` and `failed`, reset both on src changes, render the img throughout loading so native events can fire, and overlay placeholder/error content. Apply `object-fit` and `object-position` to the img. Only make the root button-like when a non-empty preview list exists.

- [ ] **Step 3: Run focused tests**

Run: `npm test -- --run tests/image.spec.ts && npm run typecheck`

Expected: PASS for loading-state tests.

### Task 2: Image viewer

**Files:**
- Create: `src/components/image/transform.ts`
- Create: `src/components/image/ZtImageViewer.vue`
- Modify: `src/components/image/ZtImage.vue`
- Modify: `src/components/image/image.scss`
- Test: `tests/image-viewer.spec.ts`
- Modify: `tests/image.spec.ts`

**Interfaces:**
- Pure `normalizeViewerIndex(index, length, infinite)` and `nextViewerTransform(current, action, options)`.
- Viewer props: `urls`, `initialIndex`, `infinite`, `zoomRate`, `minScale`, `maxScale`, `hideOnClickModal`, `closeOnPressEscape`, `zIndex`.
- Viewer emits `switch(index)` and `close()`.

- [ ] **Step 1: Write failing transform tests**

```ts
it('clamps scale and resets translation after rotation reset', () => {
  const start = { scale: 1, rotate: 90, x: 30, y: -10 }
  expect(nextViewerTransform(start, { type: 'zoom', direction: -1 }, {
    zoomRate: 1.2, minScale: 0.5, maxScale: 2,
  }).scale).toBeCloseTo(1 / 1.2)
  expect(nextViewerTransform(start, { type: 'reset' }, {
    zoomRate: 1.2, minScale: 0.5, maxScale: 2,
  })).toEqual({ scale: 1, rotate: 0, x: 0, y: 0 })
})
```

- [ ] **Step 2: Run RED and implement transform functions**

Run: `npm test -- --run tests/image-viewer.spec.ts`

Expected: FAIL because transform module is missing.

Normalize invalid scales/rates to spec defaults, clamp scale, rotate in 90-degree steps, and reset pan whenever the active index changes.

- [ ] **Step 3: Write failing viewer interaction tests**

Mount a real `ZtImage`, trigger preview, then assert: initialIndex chooses the literal URL; ArrowRight changes image and emits index; `+`, `-`, rotate, and reset buttons update the image transform; wheel zoom clamps; pointer drag updates translation; Escape closes and restores trigger focus; modal click obeys hideOnClickModal; non-infinite edge buttons disable; unmount restores body overflow and removes key listeners.

- [ ] **Step 4: Implement viewer and overlay lifecycle**

Render viewer via Teleport with `role="dialog"`, `aria-modal`, an accessible toolbar, current/total counter, and thumbnail-independent main image. Reuse overlay manager entry/leave and body lock functions so viewer stacks correctly. Use document keydown only while open; ArrowLeft/Right switch, Escape closes, and `+`, `-`, `0` manipulate transform. Capture pointer drag on the image stage and clear listeners on pointerup/cancel/close.

- [ ] **Step 5: Verify Image behavior**

Run: `npm test -- --run tests/image.spec.ts tests/image-viewer.spec.ts tests/overlay-manager.spec.ts && npm run typecheck`

Expected: PASS.

### Task 3: Avatar

**Files:**
- Create: `src/components/avatar/types.ts`
- Create: `src/components/avatar/ZtAvatar.vue`
- Create: `src/components/avatar/avatar.scss`
- Create: `src/components/avatar/index.ts`
- Modify: `src/components/index.ts`
- Test: `tests/avatar.spec.ts`

**Interfaces:**
- Produces `ZtAvatarShape`, `ZtAvatarStatus`, `ZtAvatarSize`, `ZtAvatarProps`, and `ZtAvatar`.
- Fallback priority: default slot → icon/component → first Unicode grapheme from trimmed alt → built-in user icon.

- [ ] **Step 1: Write failing image/fallback/size tests**

```ts
it('falls back after an error and retries after src changes', async () => {
  const wrapper = mount(ZtAvatar, { props: { src: '/bad.svg', alt: '林青' } })
  await wrapper.get('img').trigger('error')
  expect(wrapper.text()).toBe('林')
  expect(wrapper.emitted('error')).toHaveLength(1)
  await wrapper.setProps({ src: '/good.svg' })
  expect(wrapper.find('img').attributes('src')).toBe('/good.svg')
})

it('normalizes numeric size and preserves circle shape', () => {
  const wrapper = mount(ZtAvatar, { props: { size: 52, shape: 'circle' } })
  expect(wrapper.attributes('style')).toContain('--zt-avatar-size: 52px')
  expect(wrapper.classes()).toContain('zt-avatar--circle')
})
```

Add tests for slot/icon priority, srcSet, fit, alt grapheme with emoji, five inherited sizes, custom CSS length, all statuses, square radius, load event, and decorative/default aria behavior.

- [ ] **Step 2: Run RED and implement Avatar**

Run: `npm test -- --run tests/avatar.spec.ts`

Expected: FAIL because Avatar is missing.

Reset failure on src/srcSet changes. Use `Intl.Segmenter` when available and `Array.from(text)[0]` otherwise for the alt fallback. Render image only while src exists and has not failed. Normalize finite positive numeric sizes to pixels and accept non-empty string lengths unchanged.

- [ ] **Step 3: Verify Avatar**

Run: `npm test -- --run tests/avatar.spec.ts && npm run typecheck`

Expected: PASS.

### Task 4: Media documentation and integration

**Files:**
- Create: `site/src/views/image/Index.vue`
- Create: `site/src/views/avatar/Index.vue`
- Create: `site/public/image-demo/landscape.svg`
- Create: `site/public/image-demo/portrait.svg`
- Create: `site/public/image-demo/avatar.svg`
- Modify: `site/src/docs/catalog.ts`
- Modify: `site/src/router/index.ts`
- Modify: `site/scripts/generate-api.mjs`
- Modify: `site/scripts/api-overrides.mjs`
- Modify: `README.md`

- [ ] **Step 1: Add deterministic local SVG assets**

Create simple geometric illustrations with explicit viewBox, gradients that work in both themes, and no embedded text that examples depend on.

- [ ] **Step 2: Add Image scenarios**

Show fit modes in fixed frames, loading/error slots using controlled invalid src, native lazy loading, a three-image preview gallery, finite navigation, and exposed events. The demo must not call the network.

- [ ] **Step 3: Add Avatar scenarios**

Show all five sizes, numeric size, circle/square, image/initial/icon/slot fallbacks, six statuses, and a failed image. Use the new standalone Avatar rather than the Upload avatar example.

- [ ] **Step 4: Register routes, catalog, API, README**

Add `/image`, `/avatar`, and `/api/(image|avatar)` support through router and generator config. Document Image instance methods if exposed by the final SFC.

- [ ] **Step 5: Run complete verification**

Run: `npm test && npm run build`

Run: `cd site && npm test && npm run build`

Inspect `/image` viewer and `/avatar` at mini/default/large sizes and light/dark themes, including a narrow viewport.

- [ ] **Step 6: Commit**

```bash
git add src/components/image src/components/avatar src/components/index.ts tests/image.spec.ts tests/image-viewer.spec.ts tests/avatar.spec.ts site/src/views/image site/src/views/avatar site/public/image-demo site/src/docs/catalog.ts site/src/router/index.ts site/scripts README.md
git commit -m "feat: add image and avatar components"
```
