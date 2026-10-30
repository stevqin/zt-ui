<script setup lang="ts">
import { ref } from 'vue';
import { ZtTable, ZtTableColumn, ZtTag, type ZtTableKey } from '@ztechjs/zt-ui';
const expanded = ref<ZtTableKey[]>([]);
const rows = [
  {
    id: 'A01',
    name: '双面呢外套',
    price: 1299,
    detail: '华东仓 · 秋冬系列 · 可调拨',
  },
  {
    id: 'A02',
    name: '休闲西装',
    price: 899,
    detail: '华南仓 · 通勤系列 · 可调拨',
  },
];
</script>

<template>
  <div class="demo">
    <ZtTable :data="rows" v-model:expanded-keys="expanded">
      <ZtTableColumn type="expand">
        <template #default="{ row }">
          <p>{{ row.detail }}</p>
        </template>
      </ZtTableColumn>
      <ZtTableColumn prop="name" label="商品" />
      <ZtTableColumn prop="price" label="单价" sortable>
        <template #default="{ row }">¥ {{ row.price }}</template>
      </ZtTableColumn>
      <ZtTableColumn prop="id" label="编码">
        <template #default="{ row }">
          <ZtTag>{{ row.id }}</ZtTag>
        </template>
      </ZtTableColumn>
    </ZtTable>
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
