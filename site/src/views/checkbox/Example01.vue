<script setup lang="ts">
import { ref } from 'vue';
import { ZtCheckbox } from '@ztechjs/zt-ui';
const checked = ref(true);
const unchecked = ref(false);
</script>

<template>
  <div class="demo-row">
    <ZtCheckbox v-model="unchecked">选项一</ZtCheckbox
    ><ZtCheckbox v-model="checked">选项二（默认选中）</ZtCheckbox>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.demo-row:last-child {
  margin-bottom: 0;
}
</style>
