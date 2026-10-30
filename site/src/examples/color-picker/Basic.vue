<script setup lang="ts">
import { ref } from 'vue';
import { ZtColorPicker } from '@ztechjs/zt-ui';
const color = ref('#1677ff');
</script>

<template>
  <div class="demo">
    <ZtColorPicker
      v-model="color"
      :presets="['#1677ff', '#52c41a', '#faad14', '#f5222d']"
      clearable
    />
    <p>颜色：{{ color || '未设置' }}</p>
    <div :style="{ background: color, height: '32px', borderRadius: '4px' }" />
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 16px;
  max-width: 100%;
}
.demo p {
  margin: 0;
}
</style>
