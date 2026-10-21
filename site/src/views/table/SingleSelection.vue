<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtButton,
  ZtTable,
  type ZtTableColumn,
  type ZtTableKey,
} from '@ztechjs/zt-ui';
const selected = ref<ZtTableKey[]>([1]);
const data = [
  { id: 1, name: '杭州旗舰店', region: '华东', status: '可设为默认' },
  { id: 2, name: '上海静安店', region: '华东', status: '已停用，不可选择' },
  { id: 3, name: '深圳中心店', region: '华南', status: '可设为默认' },
];
const columns: ZtTableColumn[] = [
  { prop: 'name', label: '默认门店' },
  { prop: 'region', label: '区域' },
  { prop: 'status', label: '状态' },
];
</script>
<template>
  <div class="example">
    <div class="controls">
      <ZtButton size="small" @click="selected = [3]">设深圳为默认门店</ZtButton>
      <ZtButton size="small" :disabled="!selected.length" @click="selected = []"
        >清空选择</ZtButton
      >
    </div>
    <ZtTable
      v-model:selected-keys="selected"
      :data="data"
      :columns="columns"
      selection
      selection-type="radio"
      :selectable="(row) => row.id !== 2"
    />
    <p role="status">
      默认门店：{{
        data.find((row) => row.id === selected[0])?.name || '尚未选择'
      }}
    </p>
    <p>
      selection-type="radio" 使用 ZtRadio，一次选择一行，不显示全选。仍通过
      selected-keys 数组读取和更新，禁用行不可选。
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
