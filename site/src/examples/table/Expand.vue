<script setup lang="ts">
import { ref } from 'vue';
import { ZtTable, ZtTableColumn, type ZtTableKey } from '@ztechjs/zt-ui';
const expanded = ref<ZtTableKey[]>(['A']);
const rows = [
  { id: 'A', name: '便携水杯', detail: '容量 450ml，适合通勤使用。' },
  { id: 'B', name: '帆布提袋', detail: '内置小口袋，便于收纳钥匙。' },
];
</script>
<template>
  <div class="table-demo">
    <ZtTable :data="rows" v-model:expanded-keys="expanded"
      ><ZtTableColumn type="expand"
        ><template #default="{ row }"
          ><p>{{ row.detail }}</p></template
        ></ZtTableColumn
      ><ZtTableColumn prop="id" label="编号" /><ZtTableColumn
        prop="name"
        label="商品"
    /></ZtTable>
    <p>展开行：{{ expanded }}</p>
  </div>
</template>
<style scoped>
.table-demo {
  display: grid;
  gap: 16px;
  min-width: 0;
}
.table-demo p {
  margin: 0;
}
</style>
