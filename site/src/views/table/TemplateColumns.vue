<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtButton,
  ZtCheckbox,
  ZtIcon,
  ZtTable,
  ZtTableColumn,
  ZtTag,
} from '@ztechjs/zt-ui';
const showRegion = ref(true);
const feedback = ref('点击操作按钮查看当前行。');
const data = [
  {
    id: 1,
    name: '杭州旗舰店',
    code: 'HZ-001',
    region: '华东',
    sales: 12500,
    active: true,
  },
  {
    id: 2,
    name: '上海静安店',
    code: 'SH-002',
    region: '华东',
    sales: 25300,
    active: true,
  },
  {
    id: 3,
    name: '深圳中心店',
    code: 'SZ-003',
    region: '华南',
    sales: 18600,
    active: false,
  },
];
</script>
<template>
  <div class="example">
    <ZtCheckbox v-model="showRegion">显示区域列</ZtCheckbox>
    <ZtTable :data="data" border resizable>
      <ZtTableColumn
        prop="name"
        label="门店"
        :width="200"
        :min-width="160"
        fixed="left"
        sortable
      >
        <template #default="{ row, value }">
          <div class="store">
            <strong>{{ value }}</strong
            ><span>{{ row.code }}</span>
          </div>
        </template>
      </ZtTableColumn>
      <ZtTableColumn
        v-if="showRegion"
        prop="region"
        label="区域"
        :width="100"
      />
      <ZtTableColumn
        prop="sales"
        label="销售额"
        :width="160"
        align="right"
        sortable
      >
        <template #header="{ column }"
          ><span class="heading"
            ><ZtIcon name="filter-list" :size="14" />{{ column.label }}</span
          ></template
        >
        <template #default="{ value }"
          >¥{{ Number(value).toLocaleString('zh-CN') }}</template
        >
      </ZtTableColumn>
      <ZtTableColumn prop="active" label="经营状态" :width="130">
        <template #default="{ value }"
          ><ZtTag :status="value ? 'success' : 'default'">{{
            value ? '营业中' : '暂停营业'
          }}</ZtTag></template
        >
      </ZtTableColumn>
      <ZtTableColumn
        prop="actions"
        label="操作"
        :width="120"
        fixed="right"
        :resizable="false"
      >
        <template #default="{ row }"
          ><ZtButton size="small" @click="feedback = `查看：${row.name}`"
            >查看</ZtButton
          ></template
        >
      </ZtTableColumn>
    </ZtTable>
    <p role="status">{{ feedback }}</p>
    <p>
      在默认插槽内使用 ZtTableColumn；#default 接收
      row、column、value、index，#header 接收 column。支持 v-if /
      v-for；排序、固定列和调宽与 columns 方式一致。若同时传入
      columns，以数组配置为准。
    </p>
  </div>
</template>
<style scoped>
.example {
  display: grid;
  gap: 16px;
}
.store {
  display: grid;
  gap: 4px;
}
.store span,
p {
  color: var(--zt-text-muted, #626262);
  font-size: 12px;
}
.store strong {
  font-weight: 600;
}
p {
  margin: 0;
  line-height: 1.7;
}
.heading {
  display: inline-flex;
  gap: 6px;
  align-items: center;
}
</style>
