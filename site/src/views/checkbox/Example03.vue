<script setup lang="ts">
import { ref } from 'vue';
import { ZtCheckbox, ZtCheckboxGroup } from '@ztechjs/zt-ui';
const group = ref(['A']);
</script>

<template>
  <div class="demo-row">
    <ZtCheckboxGroup v-model="group"
      ><ZtCheckbox value="A">选项 A</ZtCheckbox><ZtCheckbox value="B">选项 B</ZtCheckbox
      ><ZtCheckbox value="C">选项 C</ZtCheckbox></ZtCheckboxGroup
    >
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
