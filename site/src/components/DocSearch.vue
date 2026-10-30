<script setup lang="ts">
import { computed, ref, nextTick, watch } from "vue";
import { useRouter } from "vue-router";
import { ZtModal } from "@ztechjs/zt-ui";
import { pages } from "../content/components";
import { guides } from "../content/guides";
import { apiDocuments } from "../app/api";
import { buildSearchIndex, searchDocuments } from "../app/search";
const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ close: [] }>();
const router = useRouter(),
  query = ref(""),
  index = ref(0);
const records = buildSearchIndex(pages, guides, apiDocuments);
const results = computed(() => searchDocuments(records, query.value));
watch(results, () => { index.value = Math.max(0, Math.min(index.value, results.value.length - 1)); });
watch(() => props.open, open => { if (open) index.value = 0; });
function go(i: number) {
  const result = results.value[i];
  if (result) {
    void router.push(result.path);
    emit("close");
  }
}
function keys(e: KeyboardEvent) {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    index.value = Math.max(0, Math.min(index.value + 1, results.value.length - 1));
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    index.value = Math.max(0, index.value - 1);
  } else if (e.key === "Enter") {
    e.preventDefault();
    go(index.value);
  }
  if (e.key === "ArrowDown" || e.key === "ArrowUp")
    void nextTick(() =>
      document
        .getElementById(`search-result-${index.value}`)
        ?.scrollIntoView({ block: "nearest" }),
    );
}
</script>
<template>
  <ZtModal :model-value="props.open" title="搜索文档" mask-closable :width="760" max-height="min(680px, calc(100dvh - 48px))" :show-footer="false" :show-fullscreen-button="false" :class-names="{ panel: 'docs-search-modal' }" @update:model-value="!$event && emit('close')"
    ><input
      class="search-input"
      autofocus
      placeholder="搜索组件、用法或 API…"
      aria-label="搜索关键词"
      role="combobox"
      aria-controls="search-results"
      :aria-expanded="true"
      :aria-activedescendant="
        results.length ? `search-result-${index}` : undefined
      "
      v-model="query"
      @input="index = 0"
      @keydown="keys"
    />
    <div id="search-results" class="search-results" role="listbox">
      <button
        v-for="(result, i) in results"
        :id="`search-result-${i}`"
        :key="result.path + result.title"
        role="option"
        :aria-selected="i === index"
        :class="{ active: i === index }"
        @click="go(i)"
      >
        <strong>{{ result.title }}</strong
        ><span>{{ result.detail }}</span
        ><b aria-hidden="true">↗</b>
      </button>
      <p v-if="!results.length" class="empty-search">
        没有找到结果，试试组件名称或属性名称。
      </p>
    </div>
    <p class="search-help">↑ ↓ 选择 · Enter 打开 · Escape 关闭</p></ZtModal
  >
</template>
