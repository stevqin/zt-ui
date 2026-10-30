<script setup lang="ts">
import { ref } from 'vue';
import { ZtTransfer, type ZtTransferKey } from '@ztechjs/zt-ui';
const value = ref<ZtTransferKey[]>([2]);
const data = Array.from({ length: 8 }, (_, index) => ({
  key: index + 1,
  label: `门店 ${index + 1}`,
  disabled: index === 4,
}));
</script>

<template>
  <div class="demo">
    <ZtTransfer
      v-model="value"
      :data="data"
      filterable
      :titles="['候选门店', '授权门店']"
    />
    <p>授权门店：{{ value }}</p>
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
