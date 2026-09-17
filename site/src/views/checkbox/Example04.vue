<script setup lang="ts">
import { ref } from 'vue';
import { ZtCheckbox, ZtCheckboxGroup } from '@ztechjs/zt-ui';
const statusGroup = ref(['A', 'B']);
</script>

<template>
  <div class="demo-row">
    <ZtCheckboxGroup v-model="statusGroup" status="primary"
      ><ZtCheckbox value="A">Primary</ZtCheckbox
      ><ZtCheckbox value="B">选项 B</ZtCheckbox></ZtCheckboxGroup
    >
  </div>
  <div class="demo-row">
    <ZtCheckboxGroup v-model="statusGroup" status="success"
      ><ZtCheckbox value="A">Success</ZtCheckbox
      ><ZtCheckbox value="B">选项 B</ZtCheckbox></ZtCheckboxGroup
    >
  </div>
  <div class="demo-row">
    <ZtCheckboxGroup v-model="statusGroup" status="danger"
      ><ZtCheckbox value="A">Danger</ZtCheckbox
      ><ZtCheckbox value="B">选项 B</ZtCheckbox></ZtCheckboxGroup
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
