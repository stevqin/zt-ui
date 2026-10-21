<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtCheckbox,
  ZtSelect,
  ZtTable,
  type ZtComponentSize,
  type ZtTableColumn,
} from '@ztechjs/zt-ui';
const border = ref(true),
  stripe = ref(true),
  size = ref<ZtComponentSize>('default');
const sizes = ['mini', 'small', 'default', 'medium', 'large'].map((value) => ({
  label: value,
  value,
}));
const data = [
  { id: 1, name: '杭州旗舰店', category: '直营', members: 2680 },
  { id: 2, name: '上海静安店', category: '直营', members: 3120 },
  { id: 3, name: '深圳中心店', category: '联营', members: 1840 },
  { id: 4, name: '南京新街口店', category: '直营', members: 2260 },
];
const columns: ZtTableColumn[] = [
  { prop: 'name', label: '门店', sortable: true },
  { prop: 'category', label: '经营类型' },
  { prop: 'members', label: '会员数', align: 'right', sortable: true },
];
</script>
<template>
  <div class="example">
    <div class="controls">
      <ZtCheckbox v-model="border">列边框</ZtCheckbox
      ><ZtCheckbox v-model="stripe">斑马纹</ZtCheckbox
      ><ZtSelect
        v-model="size"
        :options="sizes"
        aria-label="表格尺寸"
        style="width: 150px"
      />
    </div>
    <ZtTable
      :data="data"
      :columns="columns"
      :border="border"
      :stripe="stripe"
      :size="size"
    />
    <p>
      排序图标跟随 size 缩放；未指定 size 时继承 ConfigProvider 的尺寸配置。
    </p>
  </div>
</template>
<style scoped>
.example {
  display: grid;
  gap: 16px;
}
p {
  margin: 0;
  color: var(--zt-text-muted, #626262);
  font-size: 12px;
  line-height: 1.7;
}
.controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
}
</style>
