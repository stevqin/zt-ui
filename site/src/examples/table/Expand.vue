<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtCheckbox,
  ZtChevronDownIcon,
  ZtChevronRightIcon,
  ZtTable,
  ZtTableColumn,
  type ZtTableKey,
} from '@ztechjs/zt-ui';

const expanded = ref<ZtTableKey[]>(['A']);
const customIcons = ref(false);
const rows = [
  { id: 'A', name: '便携水杯', spec: '450 mL', detail: '带有防漏杯盖，适合通勤携带。' },
  { id: 'B', name: '帆布提袋', spec: '35 × 38 cm', detail: '内置小口袋，可分开放置钥匙和卡片。' },
];
</script>
<template>
  <div class="table-demo">
    <ZtCheckbox v-model="customIcons">使用导入的箭头图标</ZtCheckbox>
    <ZtTable :data="rows" v-model:expanded-keys="expanded">
      <ZtTableColumn
        type="expand"
        :collapsed-icon="customIcons ? ZtChevronRightIcon : undefined"
        :expanded-icon="customIcons ? ZtChevronDownIcon : undefined"
      >
        <template #default="{ row }">
          <dl class="table-demo__detail">
            <div>
              <dt>规格</dt>
              <dd>{{ row.spec }}</dd>
            </div>
            <div>
              <dt>商品说明</dt>
              <dd>{{ row.detail }}</dd>
            </div>
          </dl>
        </template>
      </ZtTableColumn>
      <ZtTableColumn prop="id" label="编号" :width="72" />
      <ZtTableColumn prop="name" label="商品" :width="180" />
    </ZtTable>
    <p class="table-demo__state">已展开：{{ expanded.length ? expanded.join('、') : '无' }}</p>
  </div>
</template>
<style scoped>
.table-demo {
  display: grid;
  gap: 12px;
  min-width: 0;
}
.table-demo__detail {
  display: flex;
  flex-wrap: wrap;
  gap: 10px clamp(24px, 5vw, 64px);
  margin: 0;
  padding-inline-start: 12px;
  border-inline-start: 2px solid var(--zt-border, #dcdfe6);
}
.table-demo__detail dt,
.table-demo__state {
  color: var(--zt-text-muted, #626262);
}
.table-demo__detail dt {
  font-size: 12px;
}
.table-demo__detail dd {
  margin: 4px 0 0;
}
.table-demo__state {
  margin: 0;
  font-size: 13px;
}
</style>
