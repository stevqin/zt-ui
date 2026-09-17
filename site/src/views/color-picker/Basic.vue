<script setup lang="ts">
import { ref } from 'vue';
import { ZtColorPicker } from '@ztechjs/zt-ui';
const value = ref('#245edb'),
  alpha = ref('#16a34a80');
</script>
<template>
  <div class="picker-demo">
    <ZtColorPicker
      v-model="value"
      clearable
      :presets="['#245edb', '#16a34a', '#ef4444']"
    /><ZtColorPicker v-model="alpha" show-alpha clearable />
    <p>不透明：{{ value }}；含透明度：{{ alpha }}</p>
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
