# Zt UI API Documentation Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the split and ambiguous API reference with one precise, continuous component document for all 38 stable components.

**Architecture:** Keep source extraction for structural truth, then merge it with typed documentation metadata for semantics that TypeScript cannot express. Render the merged document through reusable API components appended to every component page, while `/api` remains only an index and all deep links use component-page anchors.

**Tech Stack:** Vue 3, TypeScript, Vite, Vue Router, Vitest, Vue Test Utils, TypeScript compiler API, Vue compiler-sfc.

**Spec:** `docs/superpowers/specs/2026-09-17-api-documentation-rebuild-design.md`

## Global Constraints

- `/:component` is the only component detail route; `/api/:component` must not exist or redirect.
- `/api` remains an index and links to `/:component#api`.
- Every public API row has a concrete Chinese description, exact type or signature, and an explicit default behavior.
- Generated defaults use literal values, `必填`, `无默认值`, `继承 ConfigProvider（最终为 …）`, `运行时计算：…`, or `受组合组件控制：…`; `未设置` is forbidden.
- `Function`, `object`, and `array` cannot stand alone as an API type when a concrete public type or signature exists.
- Source declarations remain authoritative for API names and public exported types.
- Existing Header, global appearance settings, component grouping, scenarios, and roadmap remain intact.

---

### Task 1: Build the normalized API document model and validation gate

**Files:**
- Create: `site/scripts/api/model.mjs`
- Create: `site/scripts/api/normalize.mjs`
- Create: `site/scripts/api/validate.mjs`
- Create: `site/scripts/api/normalize.spec.ts`
- Modify: `site/scripts/generate-api.mjs`
- Modify: `site/src/docs/reference.ts`

**Interfaces:**
- Produces `normalizeApiDocument(raw, metadata): ApiDocument`.
- Produces `validateApiDocuments(documents): string[]`; an empty array is valid.
- Produces rows shaped as `{ name, templateName, kind, type, description, default, required }`.

- [ ] **Step 1: Write failing normalization and validation tests**

```ts
expect(toTemplateName('modelValue')).toBe('model-value')
expect(normalizeDefault({ required: true })).toBe('必填')
expect(normalizeDefault({ required: false })).toBe('无默认值')
expect(() => assertValidApi({ description: '', type: 'Function', default: '未设置' }))
  .toThrow(/description|concrete type|default/)
```

- [ ] **Step 2: Run the focused test and confirm it fails because the modules do not exist**

Run: `cd site && npm test -- --run scripts/api/normalize.spec.ts`

- [ ] **Step 3: Implement canonical names, defaults, row kinds, and validation**

```js
export const toTemplateName = name => name.replace(/[A-Z]/g, value => `-${value.toLowerCase()}`)
export function normalizeDefault(row) {
  if (row.required) return '必填'
  if (row.inherit) return `继承 ConfigProvider（最终为 ${row.inherit}）`
  if (row.runtimeDefault) return `运行时计算：${row.runtimeDefault}`
  if (row.parentDefault) return `受组合组件控制：${row.parentDefault}`
  return row.defaultValue === undefined ? '无默认值' : String(row.defaultValue)
}
```

- [ ] **Step 4: Split the current generator into collection, normalization, validation, and output stages**

The generator must call validation before `writeFileSync`; when errors exist it prints every `component.section.row: reason` and exits non-zero.

- [ ] **Step 5: Update `reference.ts` to expose the normalized schema**

```ts
export type ApiRowKind = 'prop' | 'event' | 'slot' | 'method' | 'property'
export interface ApiRow {
  name: string
  templateName?: string
  kind: ApiRowKind
  type: string
  description: string
  default?: string
  required?: boolean
}
```

- [ ] **Step 6: Run focused tests and regenerate the API JSON**

Run: `cd site && npm test -- --run scripts/api/normalize.spec.ts && npm run docs:api`

- [ ] **Step 7: Commit the normalized API pipeline**

```bash
git add site/scripts site/src/docs/reference.ts site/src/docs/api.generated.json
git commit -m "refactor(docs): normalize API reference data"
```

### Task 2: Add complete semantic metadata for all stable components

**Files:**
- Create: `site/scripts/api/metadata/shared.mjs`
- Create: `site/scripts/api/metadata/foundation.mjs`
- Create: `site/scripts/api/metadata/layout.mjs`
- Create: `site/scripts/api/metadata/form.mjs`
- Create: `site/scripts/api/metadata/data.mjs`
- Create: `site/scripts/api/metadata/navigation.mjs`
- Create: `site/scripts/api/metadata/feedback.mjs`
- Create: `site/scripts/api/metadata/overlay.mjs`
- Create: `site/scripts/api/metadata/media.mjs`
- Create: `site/scripts/api/metadata/index.mjs`
- Create: `site/src/docs/api-completeness.spec.ts`
- Modify: `site/scripts/generate-api.mjs`
- Modify: `site/src/docs/api.generated.json`

**Interfaces:**
- Metadata keys use `<componentId>.<owner>.<section>.<name>`.
- Each value may provide `{ description, default, type, kind }` but cannot add an API name missing from source extraction.
- Shared metadata supplies exact semantics for common `size`, `status`, `disabled`, `modelValue`, focus/blur, and `update:*` contracts.

- [ ] **Step 1: Write a failing completeness test across all 38 stable components**

```ts
for (const [id, document] of Object.entries(api)) {
  expect(document.components.length, id).toBeGreaterThan(0)
  for (const owner of document.components) for (const section of ['props','events','slots','exposes'] as const) {
    for (const row of owner[section]) {
      expect(row.description.trim(), `${id}.${owner.name}.${section}.${row.name}`).not.toBe('')
      expect(row.type, `${id}.${owner.name}.${section}.${row.name}`).not.toMatch(/^(Function|object|array)$/i)
      if (section === 'props') expect(row.default).not.toBe('未设置')
    }
  }
}
```

- [ ] **Step 2: Run the completeness test and record every existing ambiguous row**

Run: `cd site && npm test -- --run src/docs/api-completeness.spec.ts`

- [ ] **Step 3: Implement shared metadata and grouped component metadata**

Use specific semantic entries for complex contracts, for example:

```js
export const formMetadata = {
  'select.ZtSelect.props.modelValue': { description: '当前选中值；单选为一个选项值，多选为选项值数组，清空后分别为 null 和 []。' },
  'date-picker.ZtDatePicker.events.change': { description: '用户完成日期选择或执行清空后触发。', type: '(value: ZtDatePickerValue) => void' },
  'upload.ZtUpload.props.request': { description: '接管单个文件上传；可直接传入经过 Axios 拦截器封装的接口方法。', type: 'ZtUploadRequest' },
}
```

Every group file covers all stable components in that catalog group. Metadata focuses on behavior, empty values, units, boundaries, async outcomes, and parent/provider inheritance.

- [ ] **Step 4: Reject stale metadata keys during generation**

For every metadata key, verify that the extracted component, owner, section, and row exist; print the unmatched key and fail generation.

- [ ] **Step 5: Regenerate and run the completeness test**

Run: `cd site && npm run docs:api && npm test -- --run src/docs/api-completeness.spec.ts`

Expected: 38 documents, zero empty descriptions, zero `未设置`, zero bare `Function/object/array` types.

- [ ] **Step 6: Commit complete semantic API data**

```bash
git add site/scripts/api/metadata site/scripts/generate-api.mjs site/src/docs/api.generated.json site/src/docs/api-completeness.spec.ts
git commit -m "docs: define complete component API semantics"
```

### Task 3: Merge API reference into every component page and remove legacy detail routes

**Files:**
- Create: `site/src/components/ApiReference.vue`
- Create: `site/src/components/ApiTable.vue`
- Create: `site/src/components/ApiReference.spec.ts`
- Create: `site/src/components/ComponentDocument.vue`
- Modify: `site/src/router/index.ts`
- Modify: `site/src/App.vue`
- Modify: `site/src/views/Api.vue`
- Modify: all 38 `site/src/views/<component>/Index.vue` files
- Modify: `site/src/docs/search.ts`
- Modify: `site/src/components/DocSearch.spec.ts`
- Modify: `site/src/docs/architecture.spec.ts`

**Interfaces:**
- `<ApiReference component-id="select" />` renders the complete generated API at `id="api"`.
- `<ComponentDocument component-id="select">` wraps the existing introduction and demos, then appends `ApiReference`.
- `/api` cards target `${component.path}#api`.

- [ ] **Step 1: Write failing component rendering and route tests**

```ts
expect(router.getRoutes().some(route => route.path === '/api/:component(...)')).toBe(false)
expect(wrapper.get('#api').text()).toContain('Attributes')
expect(wrapper.text()).toContain('Events')
expect(wrapper.findAll('[data-api-row]').length).toBeGreaterThan(0)
```

- [ ] **Step 2: Run the focused tests and confirm failures against the split layout**

Run: `cd site && npm test -- --run src/components/ApiReference.spec.ts src/docs/architecture.spec.ts src/components/DocSearch.spec.ts`

- [ ] **Step 3: Implement `ApiTable` and `ApiReference`**

`ApiReference` omits empty sections, separates combination owners such as `ZtForm`, `ZtFormItem`, and `ZtFormGroup`, and renders public Types before dependency Types.

- [ ] **Step 4: Add the API reference to every stable component document**

Each component page ends with:

```vue
<ApiReference component-id="select" />
```

Remove old “查看完整 API” links and redundant local API summary tables after confirming their information exists in the generated reference.

- [ ] **Step 5: Remove the `/api/:component` route and the two-tab switch from `App.vue`**

`component` resolution only matches `route.path === component.path`; the page outline naturally includes the new API headings.

- [ ] **Step 6: Convert API index and search deep links**

Props, Events, Slots, Exposes, and Types resolve to `/${componentId}#<stable-anchor>`. The API index remains `/api` and every card action reads “查看组件 API”.

- [ ] **Step 7: Run route, search, page, and example audit tests**

Run: `cd site && npm test -- --run src/components/ApiReference.spec.ts src/docs/architecture.spec.ts src/components/DocSearch.spec.ts src/views/examples-audit.spec.ts`

- [ ] **Step 8: Commit unified component documents**

```bash
git add site/src
git commit -m "feat(docs): merge API into component pages"
```

### Task 4: Apply Element Plus-inspired API presentation and publish

**Files:**
- Modify: `site/src/docs/docs.scss`
- Modify: `site/src/docs/theme.scss`
- Modify: `site/src/style.scss`
- Modify: `README.md`

**Interfaces:**
- Desktop tables use columns `名称 / 说明 / 类型 / 默认值`.
- At `max-width: 600px`, each `[data-api-row]` becomes a labelled card without horizontal scrolling.
- Stable anchors support copy links and remain visible below the fixed header.

- [ ] **Step 1: Add rendering assertions for table headings, anchor targets, empty-section omission, and mobile labels**

```ts
expect(wrapper.findAll('th').map(node => node.text())).toEqual(['名称', '说明', '类型', '默认值'])
expect(wrapper.find('[data-api-section="events"]').exists()).toBe(true)
expect(wrapper.find('[data-api-section="empty"]').exists()).toBe(false)
```

- [ ] **Step 2: Implement the shared API visual system**

Use compact table rows, muted secondary names, readable monospace type pills, expandable long types, visible keyboard focus, sticky table headers, and `data-label` mobile cards. Dark mode uses document tokens rather than fixed light colors.

- [ ] **Step 3: Update maintenance documentation**

README documents the single component route, metadata ownership, generation command, validation failures, and rules for promoting a planned component to stable.

- [ ] **Step 4: Run all project verification**

```bash
npm test
npm run build
cd site
npm test
GITHUB_ACTIONS=true npm run build
```

- [ ] **Step 5: Inspect representative pages**

Check Select, DatePicker, Upload, Form, Modal, and VTableGrid at the default desktop viewport and 390×844, in Light and Dark themes. Verify the API appears below examples, the right outline reaches every section, no table requires mobile horizontal scrolling, and `/api/select` resolves to Not Found.

- [ ] **Step 6: Commit final styling and maintenance documentation**

```bash
git add site/src README.md
git commit -m "style(docs): clarify component API reference"
```

- [ ] **Step 7: Push and verify GitHub Pages**

Push `main`, wait for the Pages workflow for the exact HEAD SHA to complete successfully, then open `https://stevqin.github.io/zt-ui/` and verify one component deep link such as `#/select#api`.
