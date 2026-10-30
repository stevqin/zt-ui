<script setup lang="ts">
import { ref } from 'vue';
import { ZtCascader, type ZtCascaderValue } from '@ztechjs/zt-ui';
const options = [
  {
    key: 'demo',
    label: '示例组织',
    children: [
      { key: 'goods', label: '商品部' },
      {
        key: 'retail',
        label: '零售部',
        children: [
          { key: 'hz', label: '杭州门店' },
          { key: 'sh', label: '上海门店' },
        ],
      },
      { key: 'archive', label: '归档部门', disabled: true },
    ],
  },
];
const value = ref<ZtCascaderValue>([]);
</script>

<template>
  <div class="demo">
    <ZtCascader v-model="value" :options="options" multiple check-strictly clearable />
    <p>{{ value }}</p>
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
