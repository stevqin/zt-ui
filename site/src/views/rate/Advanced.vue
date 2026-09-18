<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtEntryStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtRate } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtEntryStatus>('primary');
const value = ref(3);
const texts = ['需改进', '一般', '满意', '很好', '优秀'];
</script>
<template>
  <div class="entry-demo">
    <ZtRate :status="demoStatus" v-model="value" :texts="texts" label="满意程度"
      ><template #icon>♥</template></ZtRate
    ><ZtRate
      :status="demoStatus"
      :model-value="8"
      :max="10"
      readonly
      show-score
      label="只读质量得分"
    />
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
