<script setup lang="ts">
import { ref } from 'vue';
import { ZtSwitch } from '@ztechjs/zt-ui';
const value = ref<string | number | boolean>('enabled');
</script>

<template>
  <div class="demo">
    <ZtSwitch
      v-model="value"
      active-value="enabled"
      inactive-value="disabled"
      active-text="启用"
      inactive-text="停用"
    />
    <p>业务值：{{ value }}</p>
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
