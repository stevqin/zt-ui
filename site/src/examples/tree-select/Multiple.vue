<script setup lang="ts">
import { ref } from 'vue';
import { ZtTreeSelect, type ZtTreeSelectValue } from '@ztechjs/zt-ui';
const data = [
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
const value = ref<ZtTreeSelectValue>([]);
</script>

<template>
  <div class="demo">
    <ZtTreeSelect
      v-model="value"
      :data="data"
      multiple
      check-strategy="leaf"
      filterable
      clearable
      :collapse-tags="2"
    />
    <p>叶节点：{{ value }}</p>
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
