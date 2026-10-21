<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtButton,
  ZtIcon,
  ZtTable,
  ZtTag,
  type ZtTableColumn,
} from '@ztechjs/zt-ui';
const last = ref('通过表头、单元格与操作列插槽组合业务信息。');
const data = [
  {
    id: 'HZ-001',
    name: '杭州旗舰店',
    address: '杭州 · 湖滨商圈',
    sales: 12500,
    active: true,
  },
  {
    id: 'SH-002',
    name: '上海静安店',
    address: '上海 · 南京西路',
    sales: 25300,
    active: true,
  },
  {
    id: 'SZ-003',
    name: '深圳中心店',
    address: '深圳 · 福田中心区',
    sales: 18600,
    active: false,
  },
];
const columns: ZtTableColumn[] = [
  { prop: 'name', label: '门店信息', width: 240 },
  { prop: 'sales', label: '本月销售额', width: 170, sortable: true },
  { prop: 'active', label: '经营状态', width: 120 },
  { prop: 'action', label: '操作', width: 140 },
];
</script>
<template>
  <div class="example">
    <ZtTable :data="data" :columns="columns"
      ><template #header-name
        ><span class="header"
          ><ZtIcon name="user" />门店信息<ZtTag size="mini"
            >{{ data.length }} 家</ZtTag
          ></span
        ></template
      ><template #name="{ row }"
        ><div class="store">
          <strong>{{ row.name }}</strong
          ><span>{{ row.id }} · {{ row.address }}</span>
        </div></template
      ><template #sales="{ value }"
        ><strong class="amount"
          >¥{{ Number(value).toLocaleString('zh-CN') }}</strong
        ></template
      ><template #active="{ row }"
        ><ZtTag :status="row.active ? 'success' : 'default'">{{
          row.active ? '营业中' : '暂停营业'
        }}</ZtTag></template
      ><template #action="{ row }"
        ><ZtButton
          text
          size="small"
          status="primary"
          @click="last = `查看门店：${row.name}`"
          >查看</ZtButton
        ><ZtButton
          text
          size="small"
          :disabled="!row.active"
          @click="last = `编辑门店：${row.name}`"
          >编辑</ZtButton
        ></template
      ></ZtTable
    >
    <p role="status">{{ last }}</p>
  </div>
</template>
<style scoped>
.example {
  display: grid;
  gap: 16px;
}
.header {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.store {
  display: grid;
  gap: 5px;
}
.store strong,
.amount {
  font-weight: 500;
}
.store span,
p {
  color: var(--zt-text-muted, #626262);
  font-size: 12px;
}
.amount {
  font-variant-numeric: tabular-nums;
}
p {
  margin: 0;
  line-height: 1.7;
}
</style>
