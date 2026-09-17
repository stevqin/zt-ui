<script setup lang="ts">
import { ref } from 'vue';
import { ZtAutocomplete } from '@ztechjs/zt-ui';
const value = ref(''),
  selected = ref('');
const options = [
  { value: '杭州' },
  { value: '上海' },
  { value: '北京', disabled: true },
];
</script>
<template>
  <div class="entry-demo">
    <ZtAutocomplete
      v-model="value"
      :options="options"
      clearable
      aria-label="城市"
      @select="selected = $event.value"
      ><template #option="{ option }"
        >📍 {{ option.value }}</template
      ></ZtAutocomplete
    >
    <p>输入：{{ value }}；已选：{{ selected || '无' }}</p>
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
