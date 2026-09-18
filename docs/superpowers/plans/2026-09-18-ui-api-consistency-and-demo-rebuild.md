# Zt UI API Consistency and Demo Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give underline-capable controls independent overrides, remove duplicate compatibility APIs, fix popup and component visuals, enforce library-wide contracts, and rebuild every component documentation page around a shared shell and contextual status controller.

**Architecture:** Public controls resolve local appearance before the nearest Form boundary. Shared overlay, configuration, and documentation infrastructure own geometry, radius depth, sizing, and status behavior. A checked-in contract audit and generated documentation tests keep runtime, types, examples, and public guidance synchronized.

**Tech Stack:** Vue 3, TypeScript, SCSS, Vite 6, Vitest 3, Vue Test Utils, Happy DOM, generated documentation metadata, Chromium browser QA.

**Spec:** `docs/superpowers/specs/2026-09-18-ui-api-consistency-and-demo-rebuild-design.md`

## Global Constraints

- Remove duplicate legacy APIs without aliases, warnings, forwarding branches, or compatibility documentation.
- Preserve the existing distinction between visual-theme `danger` and validation `error`.
- `underline` is tri-state: explicit component `true` or `false` wins; omission inherits the nearest Form.
- Only the 15 controls named in the spec expose `underline`; popup internals and excluded controls remain ordinary.
- Button depth thresholds use ConfigProvider `borderRadius`: `<5`, `5–8`, and `>8` pixels.
- SelectBox popup chrome stays fixed and its options list is the sole vertical scroll owner.
- Tooltip numeric dimensions become pixels; string dimensions remain CSS lengths.
- Button and Tag documentation pages keep their status matrices; workflow statuses never use the visual-theme controller.
- Do not push, deploy Pages, or publish npm in this plan.

---

### Task 1: Public Tri-state Underline Overrides

**Files:**
- Modify: `src/components/form/useFormControlAppearance.ts`
- Modify: `src/components/input/{types.ts,ZtInput.vue,ZtPassword.vue}`
- Modify: `src/components/input-number/{types.ts,ZtInputNumber.vue}`
- Modify: `src/components/input-tag/{types.ts,ZtInputTag.vue}`
- Modify: `src/components/input-otp/{types.ts,ZtInputOtp.vue}`
- Modify: `src/components/select/{types.ts,ZtSelect.vue}`
- Modify: `src/components/select-box/{types.ts,ZtSelectBox.vue}`
- Modify: `src/components/autocomplete/{types.ts,ZtAutocomplete.vue}`
- Modify: `src/components/cascader/{types.ts,ZtCascader.vue}`
- Modify: `src/components/tree-select/{types.ts,ZtTreeSelect.vue}`
- Modify: `src/components/date-picker/{types.ts,ZtDatePicker.vue,ZtDateTimePicker.vue}`
- Modify: `src/components/time-picker/{types.ts,ZtTimePicker.vue}`
- Modify: `src/components/time-select/{types.ts,ZtTimeSelect.vue}`
- Modify: `src/components/mention/{types.ts,ZtMention.vue}`
- Create: `tests/form-underline-public-api.spec.ts`
- Modify: `tests/form-underline-{core,selection,date-time}.spec.ts`

**Interfaces:**
- Produces internal `useFormControlAppearance(local?: MaybeRefOrGetter<boolean | undefined>)`.
- Produces `underline?: boolean` on exactly the 15 public component prop types.
- Preserves the private Form appearance key and nested-Form reset behavior.

- [ ] **Step 1: Write failing public API and precedence tests**

For every supported control cover explicit true outside Form, explicit false inside underline Form, omitted inheritance, reactive changes, nested Form reset, disabled/validation styles, and popup isolation. Assert excluded controls do not expose `underline`.

- [ ] **Step 2: Verify RED**

```bash
npm test -- tests/form-underline-public-api.spec.ts tests/form-underline-core.spec.ts tests/form-underline-selection.spec.ts tests/form-underline-date-time.spec.ts
```

- [ ] **Step 3: Implement one resolver**

Resolve `toValue(local) ?? inherited.value`. Pass `toRef(props, 'underline')` from each public boundary. Wrappers forward only an internal resolved marker so implementation children cannot claim Form again.

- [ ] **Step 4: Verify GREEN and types**

```bash
npm test -- tests/form-underline-public-api.spec.ts tests/form-underline-core.spec.ts tests/form-underline-selection.spec.ts tests/form-underline-date-time.spec.ts tests/form-size-production-css.spec.ts
npm run typecheck
```

- [ ] **Step 5: Commit**

```bash
git add src/components tests/form-underline-public-api.spec.ts tests/form-underline-core.spec.ts tests/form-underline-selection.spec.ts tests/form-underline-date-time.spec.ts
git commit -m "feat: add component underline overrides"
```

---

### Task 2: Remove Duplicate Compatibility APIs

**Files:**
- Modify: `src/components/radio/{types.ts,ZtRadioGroup.vue}`
- Modify: `src/components/pagination/{types.ts,ZtPagination.vue}`
- Modify: `src/components/badge/{types.ts,ZtBadge.vue}`
- Modify: `tests/{breadcrumb-segmented,pagination,size,display-components}.spec.ts`
- Create: `tests/public-api-standard.spec.ts`
- Modify: `site/scripts/api/metadata/{shared,form}.mjs`
- Modify: `site/src/docs/reference.ts`
- Modify: `site/src/views/{radio,pagination,badge}/Index.vue`
- Modify: `site/src/views/radio/Example04.vue`
- Modify: `site/src/views/examples-audit.spec.ts`
- Modify: `README.md`

**Interfaces:**
- Removes `ZtRadioGroupProps.variant`, `ZtPaginationProps.small`, and `ZtBadgeProps.type` including runtime reads.
- Keeps `segmented`, `size`, and `status` as the sole APIs.
- Preserves current `danger` and `error` status behavior.

- [ ] **Step 1: Add failing type/runtime/docs audits**

Assert public types, compiled behavior, generated API, README, and examples contain none of the removed props. Reject `@deprecated`, “兼容旧版”, “兼容的小尺寸”, and equivalent alias recommendations in public API sources.

- [ ] **Step 2: Verify RED**

```bash
npm test -- tests/public-api-standard.spec.ts tests/breadcrumb-segmented.spec.ts tests/pagination.spec.ts tests/size.spec.ts tests/display-components.spec.ts
cd site && npm test -- src/views/examples-audit.spec.ts
```

- [ ] **Step 3: Remove every duplicate branch and regenerate API**

Do not add warnings. Keep prose about historical user data, browser history, and local import naming when it is not an API alias.

- [ ] **Step 4: Verify GREEN**

```bash
cd site && npm run docs:api && npm test -- src/views/examples-audit.spec.ts src/docs/api-completeness.spec.ts
cd .. && npm run typecheck
```

- [ ] **Step 5: Commit**

```bash
git add src/components/radio src/components/pagination src/components/badge tests site README.md
git commit -m "refactor: remove duplicate compatibility props"
```

---

### Task 3: SelectBox Viewport Geometry and Single-scroll Panel

**Files:**
- Modify: `src/components/selection/useAnchoredDropdown.ts`
- Modify: `src/components/select-box/{ZtSelectBox.vue,SelectBoxPanel.vue,select-box.scss}`
- Create: `tests/select-box-viewport.spec.ts`
- Modify: `tests/select-box-{panel,integration,remote}.spec.ts`

**Interfaces:**
- Uses shared anchored placement and unconstrained desired-height measurement.
- Guarantees popup root and panel do not scroll; `.zt-select-box-panel__list` is the sole vertical scroll owner.

- [ ] **Step 1: Add failing geometry/overflow tests**

Cover enough space, flip above, constrained both sides, narrow viewport, fixed header/footer/pager, remote loading/error, paste, selected-only, resize, scroll, and pagination. Assert popup and panel use `overflow:hidden`, the list uses `overflow:auto`, and page height does not grow.

- [ ] **Step 2: Verify RED**

```bash
npm test -- tests/select-box-viewport.spec.ts tests/select-box-panel.spec.ts tests/select-box-integration.spec.ts tests/select-box-remote.spec.ts
```

- [ ] **Step 3: Implement column layout and remeasurement**

Use `display:flex; flex-direction:column; min-height:0; overflow:hidden` on popup/panel and `flex:1; min-height:0; overflow:auto` on the list. Preserve an unconstrained desired height so previous clipping cannot block flipping or re-expansion.

- [ ] **Step 4: Verify overlays and focus**

```bash
npm test -- tests/select-box-viewport.spec.ts tests/select-box-panel.spec.ts tests/select-box-integration.spec.ts tests/select-box-remote.spec.ts tests/select-box-nested-focus.spec.ts tests/selection-dropdown.spec.ts tests/overlay-popup-layer.spec.ts
npm run typecheck
```

- [ ] **Step 5: Commit**

```bash
git add src/components/selection src/components/select-box tests/select-box-viewport.spec.ts tests/select-box-panel.spec.ts tests/select-box-integration.spec.ts tests/select-box-remote.spec.ts
git commit -m "fix: constrain SelectBox to one scroll region"
```

---

### Task 4: Radius-dependent Button Depth

**Files:**
- Modify: `src/components/config-provider/{theme.ts,context.ts,ZtConfigProvider.vue}`
- Modify: `src/components/button/button.scss`
- Create: `tests/button-radius-depth.spec.ts`
- Modify: `tests/{config-provider,feedback-css,close-icon-animation}.spec.ts`

**Interfaces:**
- Produces inherited Button depth CSS variables from ConfigProvider `borderRadius`.
- Preserves all public props and supports nested provider overrides.

- [ ] **Step 1: Add a failing production CSS matrix**

Assert computed background, shadow, hover, active, disabled, loading, focus, and reduced-motion behavior at radii `0`, `3`, `4`, `8`, `9`, and `16px`, across sizes and statuses.

- [ ] **Step 2: Verify RED**

```bash
npm test -- tests/button-radius-depth.spec.ts tests/config-provider.spec.ts tests/feedback-css.spec.ts
```

- [ ] **Step 3: Emit and consume the three depth bands**

`configStyle(theme, radius)` emits flat/light/raised variables. Rectangular and circle variants consume the same contract; reduced-motion removes movement without removing feedback.

- [ ] **Step 4: Verify and build**

```bash
npm test -- tests/button-radius-depth.spec.ts tests/config-provider.spec.ts tests/feedback-css.spec.ts tests/close-icon-animation.spec.ts
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/components/config-provider src/components/button tests/button-radius-depth.spec.ts tests/config-provider.spec.ts tests/feedback-css.spec.ts tests/close-icon-animation.spec.ts
git commit -m "feat: scale Button depth with radius"
```

---

### Task 5: Content-sized Tooltip with Explicit Dimensions

**Files:**
- Modify: `src/components/tooltip/{types.ts,ZtTooltip.vue}`
- Modify: `src/components/popover/{types.ts,ZtPopover.vue,popover.scss,position.ts}`
- Create: `tests/tooltip-sizing.spec.ts`
- Modify: `tests/{popover,popover-overlay-layer}.spec.ts`

**Interfaces:**
- Adds `ZtTooltipProps.width?: number | string` and `height?: number | string`.
- Adds low-level `ZtPopoverProps.height?: number | string` beside existing width.
- Default Tooltip uses content width with a viewport-safe maximum.

- [ ] **Step 1: Add failing sizing/position tests**

Cover short content, long wrapping text, numeric and CSS-length dimensions, dynamic content/props, content overflow, four-side flips, arrow alignment, nested overlays, and keyboard dismissal.

- [ ] **Step 2: Verify RED**

```bash
npm test -- tests/tooltip-sizing.spec.ts tests/popover.spec.ts tests/popover-overlay-layer.spec.ts
```

- [ ] **Step 3: Normalize dimensions in Popover**

Default only Tooltip to `max-content`. Put overflow on `.zt-popover__content`, observe content resizing, and recalculate position after dimensions/content change.

- [ ] **Step 4: Verify and typecheck**

```bash
npm test -- tests/tooltip-sizing.spec.ts tests/popover.spec.ts tests/popover-overlay-layer.spec.ts tests/feedback-consumer-build.spec.ts
npm run typecheck
```

- [ ] **Step 5: Commit**

```bash
git add src/components/tooltip src/components/popover tests/tooltip-sizing.spec.ts tests/popover.spec.ts tests/popover-overlay-layer.spec.ts
git commit -m "feat: add adaptive Tooltip dimensions"
```

---

### Task 6: Whole-library Contract Audit and Focused Remediation

**Files:**
- Create: `scripts/audit-component-contracts.mjs`
- Create: `tests/component-contract-audit.spec.ts`
- Create: `docs/ui-api-consistency-audit.md`
- Modify: `package.json`
- Modify only when reported by the audit: `src/components/*/{types.ts,*.vue,*.scss}`
- Modify only when reported by the audit: related `tests/*.spec.ts`

**Interfaces:**
- Produces `npm run audit:components`, failing on unwaived contract violations.
- Produces a checked-in matrix covering every public component and every spec dimension.

- [ ] **Step 1: Write a failing complete audit**

Inventory public exports and check common prop spelling/type conversion, size inheritance, radius tokens, status-family membership, focus-visible, disabled/readonly/loading, reduced-motion, overlay ownership, and generated metadata coverage. Fail if any public component is absent.

- [ ] **Step 2: Record baseline findings**

```bash
npm run audit:components
npm test -- tests/component-contract-audit.spec.ts
```

Record severity, evidence, target contract, and file for every finding. Do not suppress findings to obtain green output.

- [ ] **Step 3: Fix findings by component family**

Prefer shared tokens/helpers. Modify component code only where semantics require it. Add a computed-style or behavioral regression for every modified component. Preserve the approved `danger`/`error` distinction.

- [ ] **Step 4: Complete the matrix**

Every component in `src/index.ts` must be marked `compliant` or `fixed` for density, radius/depth, status/validation, interaction/accessibility, overlay, and API language. No Critical or Important row remains.

- [ ] **Step 5: Verify the audit and library**

```bash
npm run audit:components
npm test
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add scripts tests/component-contract-audit.spec.ts docs/ui-api-consistency-audit.md package.json src/components tests
git commit -m "refactor: enforce component design contracts"
```

---

### Task 7: Shared Documentation Page Shell and Catalog-driven Routes

**Files:**
- Create: `site/src/components/ComponentPageShell.vue`
- Create: `site/src/components/ComponentPageShell.spec.ts`
- Modify: `site/src/App.vue`
- Modify: `site/src/docs/{catalog.ts,docs.scss}`
- Modify: `site/src/router/index.ts`
- Modify: all 80 component pages at `site/src/views/*/Index.vue`
- Modify: `site/src/views/{examples-audit,examples-mount}.spec.ts`
- Modify: `site/scripts/audit-examples.mjs`

**Interfaces:**
- Produces a shell with purpose, guidance, examples, design/accessibility notes, API, and related scenarios.
- Extends `ComponentMeta` with page-shell and optional visual-status metadata.
- Generates component routes from catalog metadata plus the existing import glob.

- [ ] **Step 1: Add failing shell/catalog completeness tests**

Require every catalog route to render exactly one shared shell, one component heading, examples, design/accessibility notes, API, and related content. Reject duplicated shell-owned headings or API scaffolding.

- [ ] **Step 2: Verify RED**

```bash
cd site && npm test -- src/components/ComponentPageShell.spec.ts src/views/examples-audit.spec.ts src/views/examples-mount.spec.ts
```

- [ ] **Step 3: Implement the shell and catalog-driven routes**

Move component identity and capabilities into catalog metadata. Keep guides/scenarios as explicit routes.

- [ ] **Step 4: Migrate all 80 Index pages**

Remove repeated framing while preserving component-specific guidance, executable examples, descriptions, and source parity. Make the audit fail on missing/double shells.

- [ ] **Step 5: Verify all pages**

```bash
cd site && npm test -- src/components/ComponentPageShell.spec.ts src/views/examples-audit.spec.ts src/views/examples-mount.spec.ts src/components/DocSearch.spec.ts
npm run typecheck
```

- [ ] **Step 6: Commit**

```bash
git add site/src/components/ComponentPageShell.vue site/src/components/ComponentPageShell.spec.ts site/src/App.vue site/src/docs site/src/router site/src/views site/scripts/audit-examples.mjs
git commit -m "refactor: rebuild component documentation pages"
```

---

### Task 8: Contextual Documentation Status Controller

**Files:**
- Create: `site/src/components/DemoStatusController.vue`
- Create: `site/src/components/DemoStatusController.spec.ts`
- Create: `site/src/docs/{demo-status.ts,demo-status.spec.ts,useDemoStatus.ts}`
- Create: `site/scripts/{render-example-source.mjs,render-example-source.spec.ts}`
- Modify: `site/src/components/{ComponentPageShell.vue,DemoBlock.vue}`
- Modify: `site/src/docs/{catalog.ts,docs.scss}`
- Modify: visual-theme examples selected by catalog metadata under `site/src/views/*/*.vue`
- Modify: `site/scripts/audit-examples.mjs`
- Modify: `site/src/views/{examples-audit,example-interactions}.spec.ts`

**Interfaces:**
- Produces site-only status state persisted across routes and `useDemoStatus<T>()` for live examples.
- Produces standalone displayed source without site-only imports.
- Excludes Button, Tag, Steps, Result, and pages without six visual-theme statuses.

- [ ] **Step 1: Add failing UI/state tests**

Cover the desktop three-by-two color/text grid, selected background/outline/check, synchronized examples, persistence, defaults, exclusions, keyboard use, focus-visible, and mobile `状态 · primary` pill/bottom panel.

- [ ] **Step 2: Add failing source-renderer tests**

Assert code rendered from a provider-backed example removes site imports, compiles alone, and includes ordinary component status usage.

- [ ] **Step 3: Verify RED**

```bash
cd site && npm test -- src/components/DemoStatusController.spec.ts src/docs/demo-status.spec.ts scripts/render-example-source.spec.ts src/views/example-interactions.spec.ts src/views/examples-audit.spec.ts
```

- [ ] **Step 4: Implement the approved responsive controller**

Persist status in site storage, never public ConfigProvider. Use labels below colors and a non-color selected indicator.

- [ ] **Step 5: Migrate applicable demos**

Remove local status switches and repeated matrices. Keep Button/Tag matrices and workflow/domain-status demos unchanged.

- [ ] **Step 6: Verify all examples and source output**

```bash
cd site && npm run docs:examples
npm test -- src/components/DemoStatusController.spec.ts src/docs/demo-status.spec.ts scripts/render-example-source.spec.ts src/views/example-interactions.spec.ts src/views/examples-audit.spec.ts src/views/examples-mount.spec.ts
npm run typecheck
```

- [ ] **Step 7: Commit**

```bash
git add site/src/components site/src/docs site/src/views site/scripts
git commit -m "feat: add synchronized demo status controls"
```

---

### Task 9: Public Documentation, Generated API, and Browser QA

**Files:**
- Modify: `README.md`
- Modify: `site/scripts/api/metadata/*.mjs`
- Modify: `site/src/docs/reference.ts`
- Regenerate: `site/src/docs/api.generated.json`
- Modify: `site/src/views/{form,select-box,button,tooltip,popover,config-provider}/Index.vue`
- Modify: `site/src/views/Conventions.vue`
- Create: `site/src/views/ui-api-rebuild-audit.spec.ts`
- Create: `docs/qa/2026-09-18-ui-api-consistency-browser-matrix.md`

**Interfaces:**
- Documents all new props/precedence, removed APIs, popup scrolling, Button thresholds, Tooltip dimensions, and status-controller behavior.
- Produces generated API matching source types.

- [ ] **Step 1: Add failing docs/API audits**

Require all 15 underline props, absence of removed APIs/prose, exact Tooltip rules, SelectBox single-scroll guidance, Button thresholds, and controller exclusions.

- [ ] **Step 2: Verify RED**

```bash
cd site && npm test -- src/views/ui-api-rebuild-audit.spec.ts src/views/examples-audit.spec.ts src/docs/api-completeness.spec.ts
```

- [ ] **Step 3: Update docs and regenerate**

```bash
cd site && npm run docs:api && npm run docs:examples
```

Review generated diffs; never hand-edit generated JSON.

- [ ] **Step 4: Run real browser QA**

Record all sizes, themes, radii `0/3/4/8/9/16`, underline precedence, SelectBox flips/single scrolling/modes, Tooltip dimensions/placements, desktop/mobile status controls, every page shell, copied source, keyboard focus, and console/page errors.

- [ ] **Step 5: Run complete verification**

```bash
npm test
npm run build
cd site && npm test && npm run build
cd .. && npm run audit:components
git diff --check
```

- [ ] **Step 6: Commit**

```bash
git add README.md site docs/qa
git commit -m "docs: publish consistent component and demo contracts"
```

---

### Task 10: Final Independent Review and Fix Wave

**Files:**
- Review: all commits after `383678f`
- Modify: only files required by Critical or Important findings
- Create: `docs/qa/2026-09-18-ui-api-consistency-final-review.md`

**Interfaces:**
- Produces an independently reviewed branch with no open Critical or Important finding.

- [ ] **Step 1: Review the whole branch**

Review runtime, types, production CSS, accessibility, overlay geometry, all 80 pages, generated artifacts, audit completeness, and spec compliance.

- [ ] **Step 2: Fix Critical/Important findings in one bounded wave**

Add regressions, reproduce RED, apply minimal fixes, and run focused suites. Do not fold unrelated polish into the wave.

- [ ] **Step 3: Re-review independently**

Require explicit approval and no open Critical or Important finding.

- [ ] **Step 4: Verify exact HEAD**

```bash
npm test
npm run build
cd site && npm test && npm run build
cd .. && npm run audit:components
git diff --check
git status --short
```

- [ ] **Step 5: Commit final evidence if changed**

```bash
git add docs/qa/2026-09-18-ui-api-consistency-final-review.md
git commit -m "docs: record UI and API rebuild verification"
```
