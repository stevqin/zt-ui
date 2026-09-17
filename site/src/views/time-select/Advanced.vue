<script setup lang="ts">
import { ref } from 'vue';
import { ZtTimeSelect } from '@ztechjs/zt-ui';
const value = ref<string | null>('10:00'),
  invalid = ref(false);
</script>
<template>
  <div class="entry-demo">
    <ZtTimeSelect
      v-model="value"
      start="08:00"
      end="18:00"
      :step="invalid ? '00:00' : '00:30'"
      min-time="08:30"
      max-time="17:30"
      :disabled-ranges="[['12:00', '13:00']]"
      clearable
      aria-label="受限预约时间"
    /><label><input v-model="invalid" type="checkbox" />测试零步长</label>
    <p>08:30 及之前、17:30 及之后不可选；12:00–13:00（含端点）休息。</p>
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
