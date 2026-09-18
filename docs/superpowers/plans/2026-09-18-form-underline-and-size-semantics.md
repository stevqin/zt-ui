# Form Underline and Size Semantics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Separate physical and density sizing for Drawer, detach Icon and Alert from global sizing, add Form-driven underline controls, and narrow the zt-alert boundary to feedback services.

**Architecture:** Drawer uses `width` / `height` for geometry and a scoped ConfigProvider size for density. Form publishes `underline`; supported public controls claim one internal appearance boundary so nested helper controls stay outlined. zt-ui keeps its own Modal/Drawer overlay implementation and removes all zt-alert Drawer-specific portal, focus, and z-index branches.

**Tech Stack:** Vue 3.5, TypeScript 5.8, SCSS, Vite 6, Vitest 3, Vue Test Utils, Happy DOM, Playwright/browser QA through the documentation site.

**Spec:** `docs/superpowers/specs/2026-09-18-form-underline-and-size-semantics-design.md`

## Global Constraints

- zt-ui is new: do not retain compatibility aliases for old Drawer geometry `size`, Icon preset sizes, Alert size, old CSS classes, or old documentation.
- Drawer `width` applies only to left/right and defaults to `420`; `height` applies only to top/bottom and defaults to `420`.
- Drawer `size` is exclusively `ZtComponentSize` density and inherits ConfigProvider.
- Icon size is `number | string`, defaults to `1em`, and never reads ConfigProvider.
- ZtAlert exposes no size prop and uses one default density.
- Form underline is enabled only by `<ZtForm underline>`; supported child components do not gain a public underline prop.
- Internal popup/search/pagination controls stay outlined.
- Underline multi-select tags use the approved low-saturation, borderless “A” visual.
- `@ztechjs/zt-alert` is used only for Message, Notification, MessageBox, and fullscreen Loading.
- ZtModal and ZtDrawer remain declarative zt-ui components and do not call or adapt zt-alert Drawer/Dialog methods.
- Every behavior change follows RED → GREEN and every task ends with a focused commit and independent review.

## File Structure

- `src/components/config-provider/context.ts`: add an internal scoped-size provider used by overlays.
- `src/components/form/context.ts`: publish Form underline state and the internal control-boundary key.
- `src/components/form/useFormControlAppearance.ts`: centralize “nearest Form + first public control boundary” resolution.
- `src/styles/_form-underline.scss`: shared underline surface/focus/disabled mixins; component SCSS owns selectors.
- Each supported component root: opt into the appearance hook and style only its public visible control.
- `src/components/drawer/*`, `src/components/modal/*`: geometry and density behavior.
- `src/components/icon/*`, `src/components/alert/*`: independent/default size behavior.
- `src/components/selection/useAnchoredDropdown.ts`, `src/components/overlay/resolvePopupZIndex.ts`: remove external zt-alert Drawer-specific paths.
- `tests/form-underline-*.spec.ts`: behavioral and style contracts split by component family.
- `site/src/views/form/*`, component docs, API metadata, README: public examples and final contracts.

---

### Task 1: Drawer Geometry and Overlay Density Scope

**Files:**
- Modify: `src/components/config-provider/context.ts`
- Modify: `src/components/drawer/types.ts`
- Modify: `src/components/drawer/ZtDrawer.vue`
- Modify: `src/components/drawer/drawer.scss`
- Modify: `src/components/modal/ZtModal.vue`
- Modify: `src/components/modal/modal.scss`
- Test: `tests/drawer-size-semantics.spec.ts`
- Test: `tests/config-provider.spec.ts`
- Test: `tests/modal.spec.ts`
- Test: `tests/drawer.spec.ts`

**Interfaces:**
- Produces: `provideZtSizeScope(size: ComputedRef<ZtComponentSize>): void`.
- Produces: `ZtDrawerProps.width?: number | string`, `height?: number | string`, `size?: ZtComponentSize`.
- Preserves: child explicit size > overlay size > outer ConfigProvider size.

- [ ] **Step 1: Write failing geometry and density tests**

Create `tests/drawer-size-semantics.spec.ts` with real mounts that assert:

```ts
it.each([
  ['left', '360px', 'width'],
  ['right', '40%', 'width'],
  ['top', '280px', 'height'],
  ['bottom', '35vh', 'height'],
] as const)('uses the %s axis only', async (placement, expected, axis) => {
  const wrapper = mount(ZtDrawer, {
    props: { modelValue: true, placement, width: placement === 'left' ? 360 : '40%', height: placement === 'top' ? 280 : '35vh' },
    global: { stubs: { teleport: true }, components: { ZtButton } },
  })
  const style = wrapper.get('.zt-drawer-surface__panel').attributes('style')
  expect(style).toContain(`${axis}: ${expected}`)
  expect(style).not.toContain(`${axis === 'width' ? 'height' : 'width'}:`)
})

it('uses 420px defaults without reading density as geometry', () => {
  // left/right width is 420px; top/bottom height is 420px.
})

it('inherits overlay density and lets a child explicit size win', () => {
  // ConfigProvider large -> Drawer class large -> implicit Button large;
  // Drawer size small -> implicit Input small; explicit Input large remains large.
})
```

Add the equivalent child inheritance assertion for `ZtModal` to `tests/config-provider.spec.ts`.

- [ ] **Step 2: Run the tests and verify RED**

Run:

```bash
npm test -- tests/drawer-size-semantics.spec.ts tests/config-provider.spec.ts tests/modal.spec.ts tests/drawer.spec.ts
```

Expected failures: Drawer still interprets `size` as geometry, has no `height`, and overlay slot children do not inherit an explicit overlay density.

- [ ] **Step 3: Add the internal scoped-size provider**

In `config-provider/context.ts`, add:

```ts
export function provideZtSizeScope(size: ComputedRef<ZtComponentSize>) {
  const parent = useZtConfig()
  provide(configProviderKey, { ...parent, size })
}
```

Import `provide` and `ZtComponentSize`. This helper changes only descendant size; theme, radius, and style refs remain the parent refs.

- [ ] **Step 4: Replace Drawer geometry semantics**

In `drawer/types.ts`, replace the geometry `size` and width alias with:

```ts
size?: ZtComponentSize
width?: number | string
height?: number | string
```

In `ZtDrawer.vue`:

```ts
const resolvedSize = useZtSize(props)
provideZtSizeScope(resolvedSize)

const panelStyle = computed(() => isVertical.value
  ? { height: cssLength(props.height) }
  : { width: cssLength(props.width) })
```

Use defaults `width: 420`, `height: 420`. Add `zt-drawer-surface--${resolvedSize.value}` to the root classes. Do not read `props.size` in `panelStyle`.

- [ ] **Step 5: Apply the same descendant density scope to Modal**

After `const configSize = useZtSize(props)`, call `provideZtSizeScope(configSize)`. Keep Modal `width` and public `size` behavior otherwise unchanged.

Add Drawer SCSS density rules matching Modal’s existing header/footer/body rhythm for mini, small, medium, and large. Refactor repeated numeric rules into local CSS variables if the computed styles remain identical.

- [ ] **Step 6: Verify GREEN and regressions**

Run the focused command from Step 2, then:

```bash
npm run typecheck
```

Expected: all focused tests pass; generated TypeScript rejects numeric Drawer density while accepting `size="small"`, `width="40%"`, and `height="35vh"`.

- [ ] **Step 7: Commit**

```bash
git add src/components/config-provider/context.ts src/components/drawer src/components/modal tests/drawer-size-semantics.spec.ts tests/config-provider.spec.ts tests/modal.spec.ts tests/drawer.spec.ts
git commit -m "refactor: separate Drawer geometry from density"
```

---

### Task 2: Independent Icon Size and Fixed Alert Density

**Files:**
- Modify: `src/components/icon/types.ts`
- Modify: `src/components/icon/ZtIcon.vue`
- Modify: `src/components/icon/icon.scss`
- Modify: `src/components/alert/types.ts`
- Modify: `src/components/alert/ZtAlert.vue`
- Modify: `src/components/alert/alert.scss`
- Test: `tests/icon.spec.ts`
- Create: `tests/alert-size.spec.ts`
- Modify: `tests/config-provider.spec.ts`

**Interfaces:**
- Produces: `ZtIconProps.size?: number | string`, default visual size `1em`.
- Produces: `ZtAlertProps` without `size`.

- [ ] **Step 1: Write failing size-independence tests**

Add to `tests/icon.spec.ts`:

```ts
it.each([
  [undefined, '1em'],
  [24, '24px'],
  ['18px', '18px'],
  ['1.5em', '1.5em'],
  ['50%', '50%'],
] as const)('resolves independent icon size %s', (size, expected) => {
  const wrapper = mount({ template: '<ZtConfigProvider size="large"><ZtIcon name="check" :size="size" /></ZtConfigProvider>', setup: () => ({ size }) }, { global: { components: { ZtConfigProvider, ZtIcon } } })
  expect(wrapper.get('.zt-icon-glyph').attributes('style')).toContain(`--zt-icon-size: ${expected}`)
})
```

Also assert empty strings, zero, negative numbers, and non-finite numbers resolve to `1em`, and no `zt-icon-glyph--mini|small|default|medium|large` class is emitted.

Create `tests/alert-size.spec.ts` that mounts ZtAlert under mini and large providers and asserts identical classes/computed padding/font size, plus a TypeScript/public-metadata assertion that `size` is absent.

- [ ] **Step 2: Run tests and verify RED**

```bash
npm test -- tests/icon.spec.ts tests/alert-size.spec.ts tests/config-provider.spec.ts
```

Expected: Icon inherits provider size/preset classes; Alert emits provider-size classes and its public type still contains `size`.

- [ ] **Step 3: Implement Icon’s independent resolver**

Remove `useZtConfig`, `ZtComponentSize`, `presetSize`, and five preset SCSS selectors. Resolve:

```ts
const cssSize = computed(() => {
  if (typeof props.size === 'number') return Number.isFinite(props.size) && props.size > 0 ? `${props.size}px` : '1em'
  return typeof props.size === 'string' && props.size.trim() ? props.size.trim() : '1em'
})
```

Always write `--zt-icon-size`. Preserve status, color, rotate, spin, component, slot, and accessibility behavior.

- [ ] **Step 4: Remove Alert sizing**

Delete the size prop/type import, `useZtSize`, size class, and five SCSS variants. Keep current default values (`13px`, `14px 16px`, 20px semantic icon) as the sole layout.

- [ ] **Step 5: Verify GREEN and commit**

```bash
npm test -- tests/icon.spec.ts tests/alert-size.spec.ts tests/config-provider.spec.ts
npm run typecheck
git add src/components/icon src/components/alert tests/icon.spec.ts tests/alert-size.spec.ts tests/config-provider.spec.ts
git commit -m "refactor: decouple Icon and Alert sizing"
```

---

### Task 3: Form Appearance Boundary and Core Text Controls

**Files:**
- Modify: `src/components/form/types.ts`
- Modify: `src/components/form/context.ts`
- Modify: `src/components/form/ZtForm.vue`
- Create: `src/components/form/useFormControlAppearance.ts`
- Create: `src/styles/_form-underline.scss`
- Modify: `src/components/input/ZtInput.vue`
- Modify: `src/components/input/ZtPassword.vue`
- Modify: `src/components/input/input.scss`
- Modify: `src/components/input-number/ZtInputNumber.vue`
- Modify: `src/components/input-number/input-number.scss`
- Modify: `src/components/input-otp/ZtInputOtp.vue`
- Modify: `src/components/input-otp/input-otp.scss`
- Modify: `src/components/mention/ZtMention.vue`
- Modify: `src/components/mention/mention.scss`
- Create: `tests/form-underline-core.spec.ts`
- Modify: `tests/form.spec.ts`

**Interfaces:**
- Produces: `ZtFormProps.underline?: boolean`.
- Produces in `ZtFormContext`: `underline: ComputedRef<boolean>`.
- Produces: `useFormControlAppearance(): { underline: ComputedRef<boolean> }`.
- Internal rule: the first supported public control in a Vue descendant chain claims the boundary; nested helper controls read `false`.

- [ ] **Step 1: Write failing Form and core-control tests**

Create table-driven mounts in `tests/form-underline-core.spec.ts`:

```ts
it.each([
  ['input', ZtInput, '.zt-input'],
  ['password', ZtPassword, '.zt-input'],
  ['number', ZtInputNumber, '.zt-input-number'],
  ['otp', ZtInputOtp, '.zt-input-otp'],
  ['mention', ZtMention, '.zt-mention'],
])('marks only the public %s control', (_, component, selector) => {
  const wrapper = mount({ template: '<ZtForm underline><ZtFormItem><Control /></ZtFormItem></ZtForm>', components: { ZtForm, ZtFormItem, Control: component } })
  expect(wrapper.get(selector).classes()).toContain('is-form-underline')
})
```

Add assertions for default Form, nested `<ZtForm :underline="false">`, error/success/disabled classes, no height change between focus states, Mention textarea, and OTP cells. Mount `ZtPassword` and assert only its public rendered input surface is marked once.

- [ ] **Step 2: Verify RED**

```bash
npm test -- tests/form-underline-core.spec.ts tests/form.spec.ts tests/input.spec.ts tests/input-number.spec.ts tests/input-otp.spec.ts tests/password.spec.ts
```

Expected: `underline` is not a Form prop/context value and no supported root has the state class.

- [ ] **Step 3: Implement context and boundary ownership**

Add `underline?: boolean` to Form props, default false, and publish `computed(() => props.underline)`.

Create `useFormControlAppearance.ts`:

```ts
const formControlAppearanceBoundaryKey: InjectionKey<boolean> = Symbol('ztFormControlAppearanceBoundary')

export function useFormControlAppearance() {
  const form = inject(ztFormKey, undefined)
  const insidePublicControl = inject(formControlAppearanceBoundaryKey, false)
  const underline = computed(() => Boolean(form?.underline.value && !insidePublicControl))
  provide(formControlAppearanceBoundaryKey, true)
  return { underline }
}
```

Do not export the boundary key from the public component index.

- [ ] **Step 4: Add the shared SCSS contract**

Create `_form-underline.scss` with concrete mixins:

```scss
@mixin surface {
  border-width: 0 0 1px;
  border-style: solid;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

@mixin focus($color: var(--glass-accent)) {
  border-bottom-color: $color;
  box-shadow: inset 0 -1px 0 $color;
}

@mixin disabled {
  border-bottom-style: dashed;
  background: transparent;
  box-shadow: none;
}
```

The second focus pixel is an inset shadow, so layout height never changes.

- [ ] **Step 5: Opt core controls into the boundary**

Each public component calls `useFormControlAppearance`, adds `is-form-underline` only when true, and supplies a parent class to a rendered primitive when the public component has no wrapper (for example Password).

Use component-local selectors:

```scss
.zt-input.is-form-underline .zt-input__wrapper { @include underline.surface; }
.zt-input.is-form-underline:focus-within .zt-input__wrapper { @include underline.focus; }
.zt-input.is-form-underline.is-disabled .zt-input__wrapper { @include underline.disabled; }
```

Implement equivalent selectors for InputNumber, every OTP cell, and Mention textarea. Preserve addons; if prepend/append exist, keep their content but remove their outer box edges so the complete compound input has one continuous bottom line.

- [ ] **Step 6: Verify GREEN, exclusions, and commit**

Run Step 2’s command. Also mount Button, Rate, Switch, Slider, Upload, Segmented, Radio, Checkbox, Transfer, and ColorPicker under underline Form and assert none contains `is-form-underline`.

```bash
npm run typecheck
git add src/components/form src/styles/_form-underline.scss src/components/input src/components/input-number src/components/input-otp src/components/mention tests/form-underline-core.spec.ts tests/form.spec.ts
git commit -m "feat: add Form underline appearance boundary"
```

---

### Task 4: Selection, Tags, Autocomplete, and Hierarchy Controls

**Files:**
- Modify: `src/components/select/ZtSelect.vue`
- Modify: `src/components/select/select.scss`
- Modify: `src/components/select-box/ZtSelectBox.vue`
- Modify: `src/components/select-box/select-box.scss`
- Modify: `src/components/input-tag/ZtInputTag.vue`
- Modify: `src/components/input-tag/input-tag.scss`
- Modify: `src/components/autocomplete/ZtAutocomplete.vue`
- Modify: `src/components/autocomplete/entry.scss`
- Modify: `src/components/cascader/ZtCascader.vue`
- Modify: `src/components/tree-select/ZtTreeSelect.vue`
- Modify: `src/components/tree-select/tree-select.scss`
- Create: `tests/form-underline-selection.spec.ts`
- Modify: `tests/select-style.spec.ts`
- Modify: `tests/select-box-integration.spec.ts`

**Interfaces:**
- Consumes: `useFormControlAppearance()` from Task 3.
- Produces: underline state on each public selection root while nested popup controls remain outlined.

- [ ] **Step 1: Write failing selection-family tests**

Add table-driven tests for Select, SelectBox, InputTag, Autocomplete, Cascader, and TreeSelect under underline Form. Assert the public trigger is underline and the teleported popup/search/page-size controls are not.

For multi-select, assert:

```ts
expect(getComputedStyle(tag).borderTopWidth).toBe('0px')
expect(getComputedStyle(tag).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
expect(getComputedStyle(control).whiteSpace).toBe('nowrap')
```

Cover light/dark, 100px width, `collapseTags`, `+N`, hover/focus deletion animation, validation error, and disabled state. Assert ordinary outlined tags retain the existing border/background.

- [ ] **Step 2: Verify RED**

```bash
npm test -- tests/form-underline-selection.spec.ts tests/select-style.spec.ts tests/select-box-integration.spec.ts tests/select-collapse-tags.spec.ts tests/autocomplete.spec.ts src/components/tree-select/tree-select.spec.ts src/components/cascader/cascader.spec.ts
```

- [ ] **Step 3: Apply the appearance boundary to public roots**

Call the hook in each public component. Composite wrappers such as Autocomplete and InputTag own the class; their child ZtInput receives the boundary and remains unmarked. Time-independent popup descendants also receive the boundary and remain outlined.

Style the public surfaces only:

- Select: `.zt-select__control`.
- SelectBox: `.zt-select-box__trigger`.
- InputTag: the aggregate root and its nested input wrapper as one surface.
- Autocomplete: the visible nested Input wrapper selected through the public `.zt-entry.is-form-underline` root.
- Cascader / TreeSelect: `.zt-hierarchy__control`.

- [ ] **Step 4: Implement the approved tag visual**

Under `.is-form-underline` only, use a borderless tag with `background: var(--glass-accent-soft)` and an ink color derived from the current theme/status. Keep existing size variables, maximum widths, ellipsis, delete button animation, and `+N` calculation. Dark mode must use the provider’s accent-soft token rather than a hard-coded light color.

- [ ] **Step 5: Verify GREEN and internal isolation**

Run Step 2’s command. Specifically inspect SelectBox’s search input, page-size Select, separator Select, and batch textarea after opening the panel; none may have `is-form-underline` or borderless surface styles.

- [ ] **Step 6: Commit**

```bash
git add src/components/select src/components/select-box src/components/input-tag src/components/autocomplete src/components/cascader src/components/tree-select tests/form-underline-selection.spec.ts tests/select-style.spec.ts tests/select-box-integration.spec.ts
git commit -m "feat: style selection controls for underline forms"
```

---

### Task 5: Date and Time Controls

**Files:**
- Modify: `src/components/date-picker/ZtDatePickerBase.vue`
- Modify: `src/components/date-picker/ZtDatePicker.vue`
- Modify: `src/components/date-picker/ZtDateTimePicker.vue`
- Modify: `src/components/date-picker/date-picker.scss`
- Modify: `src/components/time-picker/ZtTimePicker.vue`
- Modify: `src/components/time-picker/time-picker.scss`
- Modify: `src/components/time-select/ZtTimeSelect.vue`
- Create: `tests/form-underline-date-time.spec.ts`
- Modify: `tests/date-picker.spec.ts`
- Modify: `src/components/time-picker/time-picker.spec.ts`

**Interfaces:**
- Consumes: Task 3 appearance boundary.
- Produces: underline public date/time triggers with outlined calendar/time/search panels.

- [ ] **Step 1: Write failing date/time tests**

Mount DatePicker, DateTimePicker, TimePicker, and TimeSelect inside underline Form. Assert:

- main trigger has the underline state;
- clear button, prefix icon, range separator, and keyboard focus remain usable;
- opened calendar/time panel inputs and buttons retain outlined/panel styling;
- mini through large height does not change between closed/focused/open;
- validation and disabled bottom-line styles match the FormItem state.

- [ ] **Step 2: Verify RED**

```bash
npm test -- tests/form-underline-date-time.spec.ts tests/date-picker.spec.ts tests/date-picker-size.spec.ts src/components/time-picker/time-picker.spec.ts src/components/time-select/time-select.spec.ts
```

- [ ] **Step 3: Implement public-boundary styling**

The public DatePicker/DateTimePicker wrappers claim the boundary and pass an internal marker/class to `ZtDatePickerBase`; the calendar panel remains below the boundary. TimePicker owns its public trigger. TimeSelect owns the boundary and passes the class to its rendered ZtSelect while the nested ZtSelect does not independently claim Form underline.

Apply the shared surface/focus/disabled mixins only to `.zt-date-picker__trigger` (or the existing public root surface), TimePicker’s public trigger, and TimeSelect’s visible Select control.

- [ ] **Step 4: Verify GREEN and commit**

```bash
npm test -- tests/form-underline-date-time.spec.ts tests/date-picker.spec.ts tests/date-picker-size.spec.ts src/components/time-picker/time-picker.spec.ts src/components/time-select/time-select.spec.ts
npm run typecheck
git add src/components/date-picker src/components/time-picker src/components/time-select tests/form-underline-date-time.spec.ts tests/date-picker.spec.ts
git commit -m "feat: add underline date and time controls"
```

---

### Task 6: Remove zt-alert Drawer/Dialog Integration

**Files:**
- Modify: `src/components/overlay/resolvePopupZIndex.ts`
- Modify: `src/components/selection/useAnchoredDropdown.ts`
- Modify: `tests/overlay-popup-layer.spec.ts`
- Modify: `tests/feedback-consumer-build.spec.ts`
- Modify: `tests/feedback-boundary.spec.ts`
- Create: `tests/overlay-local-boundary.spec.ts`

**Interfaces:**
- Preserves: zt-ui Modal/Drawer overlay context, branch ownership, focus trap, z-index, body teleport, nested popup, scroll and resize behavior.
- Removes: `.zt-drawer`, `.zt-drawer__panel`, and zt-alert Drawer API knowledge from zt-ui runtime.

- [ ] **Step 1: Write local-overlay replacement regressions**

Mount real ZtDrawer and ZtModal containing Select, SelectBox, and DatePicker. Assert popups remain above the parent layer, stay in the correct focus scope, support Tab/Shift+Tab, and update position after resize/scroll. Assert source architecture contains neither `.zt-drawer__panel` nor zt-alert `ZtDrawer` imports.

- [ ] **Step 2: Run tests and verify the architecture assertion RED**

```bash
npm test -- tests/overlay-local-boundary.spec.ts tests/overlay-popup-layer.spec.ts tests/feedback-boundary.spec.ts tests/feedback-consumer-build.spec.ts
```

Expected: runtime source still contains external Drawer selectors and existing tests instantiate zt-alert Drawer.

- [ ] **Step 3: Remove external Drawer branches**

- In `resolvePopupZIndex.ts`, keep `.zt-modal`, `.zt-drawer-surface`, and `.zt-select__dropdown`; remove `.zt-drawer` and its comment.
- In `useAnchoredDropdown.ts`, remove `.zt-drawer__panel` portal-target selection and external absolute-coordinate conversion. Default to body/local zt-ui overlay behavior already carried by overlay context.
- Replace external Drawer tests with the real zt-ui Drawer/Modal cases from Step 1.
- Keep ESM externalization and SelectBox’s `ZtMessage` dependency unchanged.

- [ ] **Step 4: Verify GREEN and commit**

```bash
npm test -- tests/overlay-local-boundary.spec.ts tests/overlay-popup-layer.spec.ts tests/feedback-boundary.spec.ts tests/feedback-consumer-build.spec.ts tests/select-box-nested-focus.spec.ts tests/selection-dropdown.spec.ts
npm run typecheck
rg -n "zt-drawer__panel|closest<.*zt-drawer|ZtAlertDrawer|ZtDrawer as ZtAlert" src tests
git add src/components/overlay/resolvePopupZIndex.ts src/components/selection/useAnchoredDropdown.ts tests/overlay-local-boundary.spec.ts tests/overlay-popup-layer.spec.ts tests/feedback-boundary.spec.ts tests/feedback-consumer-build.spec.ts
git commit -m "refactor: keep Drawer and Modal inside zt-ui"
```

Expected `rg`: no matches.

---

### Task 7: Documentation, Generated API, and Final Visual QA

**Files:**
- Modify: `README.md`
- Modify: `site/scripts/api/metadata/expansion.mjs`
- Modify: `site/src/docs/api.generated.json` (generated)
- Modify: `site/src/views/drawer/Index.vue`
- Modify: `site/src/views/drawer/Example01.vue`
- Modify: `site/src/views/drawer/Example02.vue`
- Modify: `site/src/views/drawer/Example03.vue`
- Modify: `site/src/views/drawer/CustomContent.vue`
- Modify: `site/src/views/icon/Index.vue`
- Modify: `site/src/views/icon/Example01.vue`
- Modify: `site/src/views/icon/Example02.vue`
- Modify: `site/src/views/icon/Example03.vue`
- Modify: `site/src/views/icon/Example04.vue`
- Modify: `site/src/views/icon/Slot.vue`
- Modify: `site/src/views/alert/Index.vue`
- Modify: `site/src/views/alert/Basic.vue`
- Modify: `site/src/views/alert/Custom.vue`
- Modify: `site/src/views/form/Index.vue`
- Create: `site/src/views/form/Underline.vue`
- Modify: `site/src/views/feedback/Index.vue`
- Modify: `site/src/views/feedback/Basic.vue`
- Modify: `site/src/views/examples-audit.spec.ts`
- Modify: `docs/component-examples-audit.md` (generated)

**Interfaces:**
- Consumes: all final public APIs and class behavior from Tasks 1–6.
- Produces: copyable docs that contain no old Drawer geometry, Icon preset, Alert size, or zt-alert Drawer/Dialog guidance.

- [ ] **Step 1: Add failing documentation audits**

In `examples-audit.spec.ts`, assert:

```ts
expect(sourceFor('drawer')).toContain('width=')
expect(sourceFor('drawer')).toContain('height=')
expect(sourceFor('form')).toContain('<ZtForm underline')
expect(sourceFor('icon')).toMatch(/:size="\d+"|size="\d+(px|em|%)"/)
expect(sourceFor('feedback')).not.toMatch(/ZtDrawer|Dialog|Modal/)
```

Inspect generated API and require Drawer `width`, `height`, density `size`, Form `underline`, Icon independent size, and no Alert size.

- [ ] **Step 2: Run site audits and verify RED**

```bash
cd site && npm test -- src/views/examples-audit.spec.ts src/docs/api-completeness.spec.ts
```

- [ ] **Step 3: Update copyable examples and prose**

The Form example must include all five sizes across its controls, light/dark providers, error/success/disabled states, Select multiple with collapse tags, SelectBox, DatePicker/DateTimePicker, Mention, InputOtp, and Button/Upload/Rate/Switch/Slider/Segmented examples that remain unchanged.

Drawer examples must show horizontal width, vertical height, density inherited from ConfigProvider, explicit Drawer size, implicit child size, and explicit child override.

Feedback examples import only Message, Notification, MessageBox, and fullscreen Loading from `@ztechjs/zt-alert`.

- [ ] **Step 4: Regenerate API and example audit**

```bash
cd site
npm run docs:api
npm run docs:examples
```

Inspect the generated JSON rather than hand-editing it after generation.

- [ ] **Step 5: Run complete automated verification**

From repository root:

```bash
npm test
npm run build
npm --prefix site test
npm --prefix site run build
git diff --check
rg -n "Drawer.*size.*width|五档预设尺寸.*Icon|Alert.*size|zt-alert.*(Drawer|Dialog|Modal)|zt-drawer__panel" README.md src site tests
```

The final search may contain explicit negative test assertions only; inspect every match.

- [ ] **Step 6: Perform browser visual and interaction QA**

Use the real documentation site at desktop and narrow viewport widths. Verify:

- all 15 supported controls in underline Form;
- all excluded controls remain outlined/unchanged;
- mini/small/default/medium/large, light/dark, radius 0/16;
- Select and SelectBox multi-tag approved A visual at 100px, 240px, and 100%;
- popup internals remain outlined;
- Drawer left/right width and top/bottom height;
- Drawer/Modal density inheritance, child explicit override, focus trap, nested popup, resize and scroll;
- Icon number, em, and percent examples;
- Alert appearance remains identical under mini and large ConfigProvider;
- no browser errors.

- [ ] **Step 7: Commit final documentation and generated artifacts**

```bash
git add README.md site docs/component-examples-audit.md
git commit -m "docs: document underline forms and explicit sizing"
```

- [ ] **Step 8: Request final whole-branch review**

Review from base `5bc5d64` to the final implementation head against the design spec. Fix every Critical and Important finding with a new RED/GREEN regression, re-run the full verification commands, and require an approving re-review before completion.
