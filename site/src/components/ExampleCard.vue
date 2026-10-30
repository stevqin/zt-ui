<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  ref,
  onBeforeUnmount,
  watch,
} from "vue";
import type { DocExampleMeta } from "../app/types";
import { providerConfig } from "../app/appearance";
import { copyText, highlightCode, formatStandaloneSource } from "../app/source";
const props = defineProps<{ example: DocExampleMeta }>();
const modules = import.meta.glob("../examples/**/*.vue");
const sources = import.meta.glob("../examples/**/*.vue", {
  query: "?raw",
  import: "default",
});
const file = computed(() => props.example.file.replace("src/", "../"));
const component = computed(() =>
  defineAsyncComponent({
    loader: modules[file.value] as any,
    loadingComponent: {
      template: '<div class="example-loading">正在加载示例…</div>',
    },
    errorComponent: {
      template: '<div role="alert">示例加载失败，请刷新页面重试。</div>',
    },
  }),
);
const open = ref(false),
  raw = ref(""),
  formatted = ref(""),
  copyState = ref(""),
  instance = ref(0),
  formatting = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined,
  request = 0,
  alive = true;
let cacheKey = "",
  cache: Promise<string> | undefined;
async function loadSource() {
  if (!raw.value) {
    const load = sources[file.value];
    if (!load) throw Error("示例源码不可用");
    raw.value = String(await load());
  }
}
async function refreshCode() {
  const current = ++request,
    config = { ...providerConfig.value },
    key = JSON.stringify([raw.value, config]);
  formatting.value = true;
  try {
    if (!cache || cacheKey !== key) {
      cacheKey = key;
      cache = formatStandaloneSource(raw.value, config);
    }
    const code = await cache;
    if (alive && current === request) formatted.value = code;
    return code;
  } catch (error) {
    cache = undefined;
    throw error;
  } finally {
    if (alive && current === request) formatting.value = false;
  }
}
async function toggle() {
  if (open.value) {
    open.value = false;
    return;
  }
  try {
    await loadSource();
    await refreshCode();
    if (alive) open.value = true;
  } catch {
    copyState.value = "源码格式化失败，请重试";
  }
}
async function copy() {
  try {
    await loadSource();
    const code = await refreshCode();
    await copyText(code);
    if (alive) copyState.value = "已复制完整示例";
  } catch (error) {
    if (alive)
      copyState.value =
        error instanceof Error ? error.message : "复制失败，请展开源码手动复制";
  }
  clearTimeout(timer);
  timer = setTimeout(() => (copyState.value = ""), 3000);
}
watch(providerConfig, () => {
  if (open.value && raw.value)
    void refreshCode().catch(() => {
      copyState.value = "源码格式化失败，请重试";
    });
});
onBeforeUnmount(() => {
  alive = false;
  request++;
  clearTimeout(timer);
});
</script>
<template>
  <section :id="`example-${example.id}`" class="example-section">
    <h2>
      {{ example.title
      }}<RouterLink
        class="heading-anchor"
        :to="{ hash: `#example-${example.id}` }"
        aria-label="章节链接"
        >#</RouterLink
      >
    </h2>
    <p class="section-description">{{ example.description }}</p>
    <div class="example-card">
      <div
        class="example-preview"
        :class="{ 'example-preview--wide': example.wide }"
      >
        <component :is="component" :key="example.file + instance" />
      </div>
      <div class="example-toolbar">
        <span class="example-file">{{ example.file.split("/").at(-1) }}</span
        ><span v-if="copyState" role="status" class="copy-status">{{
          copyState
        }}</span>
        <button
          class="example-action"
          @click="instance++"
          aria-label="重置当前示例"
        >
          重置
        </button>
        <button class="example-action" :disabled="formatting" @click="copy">
          复制完整示例
        </button>
        <button
          class="example-action code-toggle"
          :class="{ 'is-expanded': open }"
          :disabled="formatting"
          :aria-expanded="open"
          :aria-controls="`source-${example.id}`"
          @click="toggle"
        >
          <span>{{
            formatting ? "格式化中" : open ? "收起代码" : "展开代码"
          }}</span
          ><svg
            class="code-toggle-icon"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </button>
      </div>
      <div
        v-if="open"
        :id="`source-${example.id}`"
        class="example-source"
        :aria-busy="formatting"
      >
        <p class="source-context">
          源码包含当前配置：{{ providerConfig.size }} ·
          {{ providerConfig.borderRadius }}px · {{ providerConfig.theme }}
        </p>
        <pre tabindex="0"><code v-html="highlightCode(formatted)"></code></pre>
      </div>
    </div>
  </section>
</template>
