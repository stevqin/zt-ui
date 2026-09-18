<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtEntryStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtMention } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtEntryStatus>('primary');
const value = ref('请 @al 审核此方案'),
  event = ref('');
const options = [
  { value: 'alice', label: 'Alice · 设计' },
  { value: 'alex', label: 'Alex · 研发' },
  { value: 'bob', disabled: true },
];
</script>
<template>
  <div class="entry-demo">
    <ZtMention
      :status="demoStatus"
      v-model="value"
      :options="options"
      :prefixes="['@', '#']"
      clearable
      aria-label="评论"
      @select="(option, prefix) => (event = `${prefix}${option.value}`)"
      ><template #option="{ option }">{{
        option.label ?? option.value
      }}</template></ZtMention
    >
    <p>点击 al 后方并用方向键 / Enter 选择。最近选择：{{ event || '无' }}</p>
    <pre>{{ value }}</pre>
  </div>
</template>
<style scoped>
.entry-demo {
  display: grid;
  gap: 14px;
  width: min(100%, 480px);
}
p {
  margin: 0;
  color: var(--zt-text-secondary, #667085);
  font-size: 13px;
}
pre {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
label {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
