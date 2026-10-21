<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  ZtButton,
  ZtTable,
  type ZtTableColumn,
  type ZtTableKey,
} from '@ztechjs/zt-ui';
const selected = ref<ZtTableKey[]>([]);
const data = [
  { id: 1, name: '杭州旗舰店', region: '华东', permission: '可授权' },
  { id: 2, name: '上海静安店', region: '华东', permission: '已锁定，不可选择' },
  { id: 3, name: '深圳中心店', region: '华南', permission: '可授权' },
];
const columns: ZtTableColumn[] = [
  { prop: 'name', label: '门店' },
  { prop: 'region', label: '区域' },
  { prop: 'permission', label: '授权状态' },
];
const names = computed(() =>
  data
    .filter((row) => selected.value.includes(row.id))
    .map((row) => row.name)
    .join('、'),
);
</script>
<template>
  <div class="example">
    <div class="controls">
      <ZtButton size="small" @click="selected = [1, 3]">选择可授权门店</ZtButton
      ><ZtButton
        size="small"
        :disabled="!selected.length"
        @click="selected = []"
        >清空选择</ZtButton
      >
    </div>
    <ZtTable
      v-model:selected-keys="selected"
      :data="data"
      :columns="columns"
      selection
      :selectable="(row) => row.id !== 2"
    />
    <p role="status">
      已选 {{ selected.length }} 家：{{ names || '尚未选择' }}
    </p>
    <p>
      表头全选会跳过禁用行；部分选择时显示半选状态。selected-keys
      完全受控，业务可主动更新或清空。
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
  flex-wrap: wrap;
  gap: 10px;
}
p {
  margin: 0;
  color: var(--zt-text-muted, #626262);
  font-size: 12px;
  line-height: 1.7;
}
</style>
