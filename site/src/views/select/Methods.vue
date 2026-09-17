<script setup lang="ts">
import { ref } from 'vue';
import { ZtSelect, ZtButton } from '@ztechjs/zt-ui';
const select = ref<InstanceType<typeof ZtSelect>>();
const value = ref<string | number | null>(null);
const options = [
  { label: '杭州', value: 'hangzhou' },
  { label: '上海', value: 'shanghai' },
];
</script>

<template>
  <div class="example-stack">
    <div class="example-row">
      <ZtButton @click="select?.focus()">聚焦</ZtButton
      ><ZtButton @click="select?.open()">打开下拉</ZtButton
      ><ZtButton @click="select?.close()">关闭下拉</ZtButton>
    </div>
    <ZtSelect
      ref="select"
      v-model="value"
      :options="options"
      filterable
      clearable
      no-data-text="没有匹配的城市，请换个关键词"
      aria-label="城市方法演示"
    />
    <p>输入不存在的城市可查看无数据状态。</p>
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
