<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtEntryStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtInputTag } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtEntryStatus>('primary');
const values = ref(['设计']),
  duplicates = ref(['A', 'A']);
</script>
<template>
  <div class="entry-demo">
    <ZtInputTag
      :status="demoStatus"
      v-model="values"
      :separators="['/', ';']"
      aria-label="自定义分隔符"
      ><template #tag="{ value }">#{{ value }}</template></ZtInputTag
    >
    <p>可粘贴：设计/研发;生产</p>
    <ZtInputTag
      :status="demoStatus"
      v-model="duplicates"
      :deduplicate="false"
      aria-label="允许重复"
    />
    <p>第二组允许重复标签。</p>
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
