<script setup lang="ts">
import { ref } from 'vue';
import { ZtSelect } from '@ztechjs/zt-ui';
const selected = ref<number[]>([9000]);
const options = Array.from({ length: 10000 }, (_, index) => ({
  value: index,
  label: `门店 ${index + 1}`,
  disabled: index % 100 === 99,
}));
</script>
<template>
  <div class="virtual-demo">
    <ZtSelect
      aria-label="虚拟列表门店选择"
      v-model="selected"
      :options="options"
      virtual
      multiple
      filterable
      clearable
      :item-height="40"
      :height="240"
      placeholder="搜索一万个门店"
    />
    <p role="status">已选门店键：{{ selected.join('、') || '无' }}</p>
  </div>
</template>
<style scoped>
.virtual-demo {
  display: grid;
  gap: 12px;
  max-width: 520px;
}
.virtual-demo p {
  overflow-wrap: anywhere;
  font-size: 13px;
}
</style>
