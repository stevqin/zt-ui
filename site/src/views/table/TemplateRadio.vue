<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtButton,
  ZtTable,
  ZtTableColumn,
  type ZtTableKey,
} from '@ztechjs/zt-ui';
const selected = ref<ZtTableKey[]>([1]);
const data = [
  { id: 1, name: '杭州旗舰店', status: '可设为默认' },
  { id: 2, name: '上海静安店', status: '已停用，不可选择' },
  { id: 3, name: '深圳中心店', status: '可设为默认' },
];
</script>
<template>
  <div class="example">
    <div class="controls">
      <ZtButton size="small" @click="selected = [3]">选择深圳门店</ZtButton
      ><ZtButton
        size="small"
        :disabled="!selected.length"
        @click="selected = []"
        >清空单选</ZtButton
      >
    </div>
    <ZtTable
      v-model:selected-keys="selected"
      :data="data"
      :selectable="(row) => row.id !== 2"
    >
      <ZtTableColumn type="radio" :width="52" />
      <ZtTableColumn prop="name" label="默认门店" />
      <ZtTableColumn prop="status" label="状态" />
    </ZtTable>
    <p role="status">
      模板单选：{{
        data.find((row) => row.id === selected[0])?.name || '尚未选择'
      }}
    </p>
    <p>
      type="radio" 自动启用单选列，不显示全选；仍使用 selected-keys
      数组读取和更新，选择变化只提交一个 key。
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
