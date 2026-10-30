<script setup lang="ts">
import { ref } from 'vue';
import { ZtTree, ZtInput, type ZtTreeKey } from '@ztechjs/zt-ui';
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
const checked = ref<ZtTreeKey[]>([]);
const selected = ref<ZtTreeKey[]>([]);
const filter = ref('');
</script>

<template>
  <div class="demo">
    <ZtInput v-model="filter" clearable placeholder="筛选部门" />
    <ZtTree
      :data="data"
      v-model:checked-keys="checked"
      v-model:selected-keys="selected"
      checkable
      :filter="filter"
      :default-expanded-keys="['demo', 'retail']"
    />
    <p>勾选：{{ checked }}；选中：{{ selected }}</p>
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
