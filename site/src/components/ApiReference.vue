<script setup lang="ts">
import type { ApiComponent, ApiRow } from "../app/types";
import { apiPresentation } from "../app/api";
defineProps<{ components: ApiComponent[] }>();
const sections = [
  { key: "props", title: "Props", type: "属性类型" },
  { key: "events", title: "Events", type: "事件签名" },
  { key: "slots", title: "Slots", type: "作用域参数" },
  { key: "exposes", title: "Exposes", type: "方法 / 状态类型" },
  { key: "types", title: "Types", type: "类型定义" },
] as const;
const rows = (
  component: ApiComponent,
  key: (typeof sections)[number]["key"],
): ApiRow[] =>
  key === "types"
    ? apiPresentation.visibleTypes(component).filter((row) => !row.fields?.length)
    : component[key] ?? [];
const structures = (component: ApiComponent) =>
  apiPresentation.visibleTypes(component).filter((row) => row.fields?.length);
</script>
<template>
  <section id="api" class="api-reference">
    <h2>API</h2>
    <p class="section-description">
      接口名称、类型与默认值来自组件库当前公开契约。
    </p>
    <div
      v-for="component in components"
      :key="component.name"
      :id="`api-${component.name}`"
      class="api-component"
    >
      <h3>{{ component.name }}</h3>
      <template v-for="section in sections" :key="section.key"
        ><section
          v-if="rows(component, section.key).length"
          :id="`api-${component.name}-${section.key}`"
          class="api-section"
        >
          <h4>
            {{
              component.kind === "service"
                ? section.key === "props"
                  ? "Options"
                  : section.key === "exposes"
                    ? "Methods"
                    : section.title
                : section.title
            }}
            <code
              v-if="section.key === 'props' && apiPresentation.propsTypeName(component)"
              class="api-props-type"
            >{{ apiPresentation.propsTypeName(component) }}</code>
          </h4>
          <div
            class="api-table-wrap"
            tabindex="0"
            :aria-label="`${component.name} ${section.title}`"
          >
            <table class="api-table">
              <thead>
                <tr>
                  <th>名称</th>
                  <th>说明</th>
                  <th>{{ section.type }}</th>
                  <th v-if="section.key === 'props'">默认值</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="row in rows(component, section.key)" :key="row.name">
                <tr>
                  <td>
                    <code>{{ row.name }}</code
                    ><span v-if="row.required" class="required-mark">必填</span>
                  </td>
                  <td>
                    {{ row.description }}
                  </td>
                  <td>
                    <details v-if="row.type.length > 100">
                      <summary>
                        <code>{{ row.type.slice(0, 80) }}…</code>
                      </summary>
                      <pre>{{ row.type }}</pre>
                    </details>
                    <code v-else>{{ row.type }}</code>
                  </td>
                  <td v-if="section.key === 'props'">
                    <code>{{ row.defaultValue ?? "—" }}</code>
                  </td>
                </tr>
                </template>
              </tbody>
            </table>
          </div>
        </section></template
      >
      <section
        v-if="structures(component).length"
        :id="`api-${component.name}-data-structures`"
        class="api-section"
      >
        <h4>数据结构</h4>
        <section
          v-for="structure in structures(component)"
          :key="structure.name"
          :id="`api-${component.name}-${structure.name}`"
          class="api-data-structure"
        >
          <h5><code>{{ structure.name }}</code></h5>
          <p v-if="structure.description" class="section-description">{{ structure.description }}</p>
          <div class="api-table-wrap" tabindex="0" :aria-label="`${structure.name} 字段表格`">
            <table class="api-table" :aria-label="`${structure.name} 字段`">
              <thead><tr><th>字段</th><th>说明</th><th>类型</th><th>必填</th></tr></thead>
              <tbody>
                <tr v-for="field in structure.fields" :key="field.name">
                  <td><code>{{ field.name }}</code></td>
                  <td>{{ field.description }}</td>
                  <td><code>{{ field.type }}</code></td>
                  <td>{{ field.required ? '必填' : '可选' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <details class="api-data-definition">
            <summary>查看 TypeScript 定义</summary>
            <pre>{{ structure.type }}</pre>
          </details>
        </section>
      </section>
    </div>
  </section>
</template>

<style scoped>
.api-data-structure { margin-top: 24px; }
.api-data-structure h5 { margin: 0 0 10px; font-size: 14px; font-weight: 500; }
.api-data-definition { margin-top: 10px; color: var(--doc-muted); font-size: 12px; }
.api-data-definition summary { cursor: pointer; }
.api-data-definition pre { margin: 10px 0 0; padding: 16px; border: 1px solid var(--doc-border); border-radius: 4px; white-space: pre-wrap; overflow-wrap: anywhere; background: var(--doc-surface); font: 12px/1.7 ui-monospace, monospace; }
.api-props-type {
  margin-left: 0.5rem;
  font-size: 0.75em;
  font-weight: 400;
  color: var(--doc-muted);
}
</style>
