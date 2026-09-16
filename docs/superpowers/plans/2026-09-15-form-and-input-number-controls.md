# Form and InputNumber Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three InputNumber control layouts and a typed, dependency-free Form/FormItem/FormGroup system with validation and complete documentation.

**Architecture:** InputNumber remains self-contained and selects a grid layout from `controlsPosition`. Form uses provide/inject contexts: the root registers fields and coordinates public methods, each item owns path resolution and rule execution, and compatible inputs notify their item of change or blur.

**Tech Stack:** Vue 3 Composition API, TypeScript, SCSS, Vitest, Vue Test Utils, Vite.

**Spec:** `docs/superpowers/specs/2026-09-15-form-and-input-number-controls-design.md`

## Global Constraints

- Do not add runtime dependencies.
- Preserve `controlsPosition="default"` behavior.
- Every new density-aware component supports `mini`, `small`, `default`, `medium`, and `large`.
- Every visual demo contains complete copyable Vue and TypeScript source.
- Use tests against rendered components and public methods rather than implementation mocks.

---

### Task 1: InputNumber control positions

**Files:**
- Modify: `src/components/input-number/types.ts`
- Modify: `src/components/input-number/ZtInputNumber.vue`
- Modify: `src/components/input-number/input-number.scss`
- Modify: `tests/input-number.spec.ts`

**Interfaces:**
- Produces: `ZtInputNumberControlsPosition = 'default' | 'left' | 'right'`.

- [ ] Add a failing component test asserting left and right modifier classes and increase/decrease DOM order.
- [ ] Run `npx vitest run tests/input-number.spec.ts` and confirm the new case fails because left is unsupported.
- [ ] Add the union member, left modifier class, mirrored grid rules, and wider size-aware control columns.
- [ ] Run `npx vitest run tests/input-number.spec.ts` and confirm every InputNumber test passes.

### Task 2: Validation primitives

**Files:**
- Create: `src/components/form/types.ts`
- Create: `src/components/form/path.ts`
- Create: `src/components/form/validation.ts`
- Create: `tests/form-validation.spec.ts`

**Interfaces:**
- Produces: `ZtFormRule`, `ZtFormRules`, `ZtFormValidationErrors`, `getPathValue`, `setPathValue`, `validateValue`.

- [ ] Add failing tests for nested paths, required/length/pattern/type rules, trigger filtering, and async custom validators.
- [ ] Run `npx vitest run tests/form-validation.spec.ts` and confirm imports fail.
- [ ] Implement safe dot/bracket path traversal and dependency-free rule evaluation returning the first error message.
- [ ] Run the focused test and confirm all primitive cases pass.

### Task 3: Form components and public methods

**Files:**
- Create: `src/components/form/context.ts`
- Create: `src/components/form/ZtForm.vue`
- Create: `src/components/form/ZtFormItem.vue`
- Create: `src/components/form/ZtFormGroup.vue`
- Create: `src/components/form/form.scss`
- Create: `src/components/form/index.ts`
- Modify: `src/components/index.ts`
- Create: `tests/form.spec.ts`
- Modify: `tests/size.spec.ts`

**Interfaces:**
- Produces: `validate`, `validateField`, `resetFields`, `clearValidate`, `scrollToField` through the `ZtForm` exposed instance.
- Consumes: path and validation helpers from Task 2.

- [ ] Add failing mounted-component tests for field registration, merged rules, error rendering, nested values, reset, clear, scroll, label layouts, group semantics, disabled inheritance, and five sizes.
- [ ] Run `npx vitest run tests/form.spec.ts tests/size.spec.ts` and confirm the missing exports fail.
- [ ] Implement reactive form and item contexts, public methods, semantic templates, and shared SCSS modifiers.
- [ ] Export all components and public types from the package.
- [ ] Run the focused tests and confirm all form and size cases pass.

### Task 4: Automatic input validation triggers

**Files:**
- Modify: `src/components/input/ZtInput.vue`
- Modify: `src/components/input-number/ZtInputNumber.vue`
- Modify: `tests/form.spec.ts`

**Interfaces:**
- Consumes: optional `FormItemContext` with `validate(trigger: 'change' | 'blur')`.

- [ ] Add a failing integration test showing a required field validates after input blur and clears after a valid change.
- [ ] Run `npx vitest run tests/form.spec.ts` and confirm the expected state change is absent.
- [ ] Inject the optional item context and request validation after emitted changes and blur events.
- [ ] Run the focused integration test and confirm it passes without duplicate validation.

### Task 5: Site documentation

**Files:**
- Create: `site/src/views/form/Index.vue`
- Modify: `site/src/views/input-number/Index.vue`
- Modify: `site/src/App.vue`
- Modify: `site/src/router/index.ts`
- Modify: `site/src/views/examples-audit.spec.ts`
- Modify: `README.md`

**Interfaces:**
- Consumes: all public components, rule types, and exposed form methods from Tasks 1–4.

- [ ] Extend the site audit test to require a routed Form page and complete copyable demos.
- [ ] Run the focused site test and confirm it fails because the page and route are absent.
- [ ] Add the Form page, InputNumber layout demo, API tables, navigation, route, and README entries.
- [ ] Run site tests and type checking until they pass.

### Task 6: Complete verification

**Files:**
- Verify all modified and created files.

**Interfaces:**
- Produces: a clean build and reviewable working tree.

- [ ] Run `npm test` in the package root and require zero failures.
- [ ] Run `npm run build` in the package root and require successful type declarations and bundles.
- [ ] Run `npm test` and `npm run build` in `site/` and require zero failures.
- [ ] Inspect `/input-number` and `/form` in the browser, exercise representative interactions, and require no console errors.
- [ ] Run `git diff --check` and review `git status` plus the complete diff before reporting completion.
