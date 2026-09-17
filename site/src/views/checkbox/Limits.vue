<script setup lang="ts">
import { ref } from 'vue';
import { ZtCheckbox, ZtCheckboxGroup } from '@ztechjs/zt-ui';
const selected = ref(['设计']),
  message = ref('');
</script>

<template>
  <div class="example-stack">
    <ZtCheckboxGroup v-model="selected" :min="1" :max="2" @change="message = JSON.stringify($event)"
      ><ZtCheckbox v-for="item in ['设计', '开发', '测试']" :key="item" :value="item">{{
        item
      }}</ZtCheckbox></ZtCheckboxGroup
    >
    <p>至少选择 1 项、最多 2 项。当前：{{ selected }}</p>
    <p role="status">最近 change：{{ message }}</p>
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
