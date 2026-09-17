<script setup lang="ts">
import { ref } from 'vue';
import { ZtCheckbox, ZtCheckboxGroup } from '@ztechjs/zt-ui';
const bordered = ref(['阅读']);
</script>

<template>
  <div class="demo-row">
    <ZtCheckboxGroup v-model="bordered" size="mini"
      ><ZtCheckbox value="阅读" border>Mini</ZtCheckbox></ZtCheckboxGroup
    ><ZtCheckboxGroup v-model="bordered" size="small"
      ><ZtCheckbox value="阅读" border>Small</ZtCheckbox></ZtCheckboxGroup
    ><ZtCheckboxGroup v-model="bordered" size="medium"
      ><ZtCheckbox value="阅读" border>Medium</ZtCheckbox></ZtCheckboxGroup
    ><ZtCheckboxGroup v-model="bordered" size="large"
      ><ZtCheckbox value="阅读" border>Large</ZtCheckbox></ZtCheckboxGroup
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
