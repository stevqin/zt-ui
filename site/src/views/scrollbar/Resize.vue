<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { ZtScrollbar, ZtButton } from '@ztechjs/zt-ui';
import type { ZtScrollbarInstance } from '@ztechjs/zt-ui';
const bar = ref<ZtScrollbarInstance>(),
  count = ref(5);
async function append() {
  count.value += 5;
  await nextTick();
  bar.value?.update();
}
</script>

<template>
  <div class="example-stack">
    <div class="example-row">
      <ZtButton @click="append">增加内容并更新</ZtButton
      ><ZtButton @click="bar?.scrollTo({ top: 120, left: 200, behavior: 'smooth' })"
        >平滑滚动</ZtButton
      ><ZtButton
        @click="
          bar?.setScrollLeft(0);
          bar?.setScrollTop(0);
        "
        >回到原点</ZtButton
      >
    </div>
    <ZtScrollbar
      ref="bar"
      :height="200"
      :min-size="30"
      noresize
      always
      tag="section"
      wrap-class="example-scroll-wrap"
      :wrap-style="{ background: 'var(--zt-surface-soft)' }"
      view-class="example-scroll-view"
      :view-style="{ padding: '12px' }"
      aria-label="手动更新的滚动区域"
      ><p v-for="item in count" :key="item" style="width: 680px; padding: 12px">
        第 {{ item }} 条横向宽内容
      </p></ZtScrollbar
    >
  </div>
</template>

<style scoped>
.example-stack {
  display: grid;
  gap: 16px;
  min-width: 0;
}
.example-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.example-note {
  color: var(--zt-text-muted, #68768a);
  font-size: 13px;
  overflow-wrap: anywhere;
}
</style>
