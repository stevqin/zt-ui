<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtEntryStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtTimeSelect } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtEntryStatus>('primary');
const value = ref<string | null>(null);
</script>
<template>
  <div class="entry-demo">
    <ZtTimeSelect
      :status="demoStatus"
      v-model="value"
      start="08:00"
      end="18:00"
      step="00:15"
      clearable
      aria-label="预约时间"
    />
    <p>已选：{{ value ?? '未选择' }}。输入时间文字可搜索。</p>
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
