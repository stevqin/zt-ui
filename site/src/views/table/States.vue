<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtButton,
  ZtCheckbox,
  ZtConfigProvider,
  ZtEmpty,
  ZtSelect,
  ZtTable,
  type ZtTableColumn,
} from '@ztechjs/zt-ui';
const mode = ref('data'),
  dark = ref(false);
const modes = [
  { label: '正常数据', value: 'data' },
  { label: '加载中', value: 'loading' },
  { label: '默认空状态', value: 'empty' },
  { label: '自定义空状态', value: 'custom' },
];
const data = [
  { id: 1, name: '杭州旗舰店', sales: 12500 },
  { id: 2, name: '上海静安店', sales: 25300 },
];
const columns: ZtTableColumn[] = [
  { prop: 'name', label: '门店', sortable: true },
  { prop: 'sales', label: '销售额', sortable: true, align: 'right' },
];
</script>
<template>
  <div class="example">
    <div class="controls">
      <ZtSelect
        v-model="mode"
        :options="modes"
        aria-label="表格数据状态"
        style="width: 180px"
      /><ZtCheckbox v-model="dark">局部暗色主题</ZtCheckbox>
    </div>
    <ZtConfigProvider :theme="dark ? 'dark' : 'light'"
      ><ZtTable
        :data="mode === 'empty' || mode === 'custom' ? [] : data"
        :columns="columns"
        :loading="mode === 'loading'"
        selection
        ><template v-if="mode === 'custom'" #empty
          ><ZtEmpty
            description="没有匹配的门店，请调整筛选条件。"
            :image-size="56"
            ><ZtButton size="small" @click="mode = 'data'"
              >恢复示例数据</ZtButton
            ></ZtEmpty
          ></template
        ></ZtTable
      ></ZtConfigProvider
    >
    <p>
      loading 显示遮罩并禁用选择、排序；空数据默认展示 empty-text，也可用 empty
      插槽提供操作入口。
    </p>
  </div>
</template>
<style scoped>
.example {
  display: grid;
  gap: 16px;
}
.controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
}
p {
  margin: 0;
  color: var(--zt-text-muted, #626262);
  font-size: 12px;
  line-height: 1.7;
}
</style>
