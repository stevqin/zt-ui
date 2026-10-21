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
  { id: 1, name: '杭州旗舰店', permission: '可授权' },
  { id: 2, name: '上海静安店', permission: '已锁定，不可选择' },
  { id: 3, name: '深圳中心店', permission: '可授权' },
];
</script>
<template>
  <div class="example">
    <div class="controls">
      <ZtButton size="small" @click="selected = [1, 3]">选择可授权门店</ZtButton
      ><ZtButton
        size="small"
        :disabled="!selected.length"
        @click="selected = []"
        >清空多选</ZtButton
      >
    </div>
    <ZtTable
      v-model:selected-keys="selected"
      :data="data"
      :selectable="(row) => row.id !== 2"
    >
      <ZtTableColumn type="selection" :width="52" />
      <ZtTableColumn prop="name" label="门店" />
      <ZtTableColumn prop="permission" label="授权状态" />
    </ZtTable>
    <p role="status">
      模板多选：已选 {{ selected.length }} 家，keys = {{ selected }}
    </p>
    <p>
      type="selection" 自动启用复选列，支持全选、半选和 selectable；无需再写
      selection 属性。
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
