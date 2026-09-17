<script setup lang="ts">
import { ref } from 'vue';
import { ZtColorPickerPanel } from '@ztechjs/zt-ui';
const value = ref('#245edb80'),
  event = ref('');
</script>
<template>
  <div class="picker-demo">
    <ZtColorPickerPanel
      v-model="value"
      show-alpha
      clearable
      :presets="['#245edb', '#16a34a', '#ef4444']"
      @cancel="event = '草稿已重置'"
      @confirm="event = `已提交 ${$event}`"
    />
    <p>{{ event }}；绑定值：{{ value || '空' }}</p>
  </div>
</template>
<style scoped>
.picker-demo {
  display: grid;
  gap: 14px;
  max-width: 100%;
}
p {
  margin: 0;
  color: var(--zt-muted, #667085);
  font-size: 13px;
  overflow-wrap: anywhere;
}
label {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
