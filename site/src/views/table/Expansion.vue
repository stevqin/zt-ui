<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtButton,
  ZtTable,
  type ZtTableColumn,
  type ZtTableKey,
} from '@ztechjs/zt-ui';
const expanded = ref<ZtTableKey[]>([1]);
const data = [
  {
    id: 1,
    name: '杭州旗舰店',
    manager: '陈经理',
    address: '浙江省杭州市上城区',
    opened: '2022-04-18',
    description: '华东区域品牌形象店，提供全系列商品与会员预约服务。',
  },
  {
    id: 2,
    name: '上海静安店',
    manager: '李经理',
    address: '上海市静安区',
    opened: '2023-09-12',
    description: '以通勤与商务系列为主，支持线上订单到店自提。',
  },
];
const columns: ZtTableColumn[] = [
  { prop: 'name', label: '门店' },
  { prop: 'manager', label: '负责人' },
  { prop: 'opened', label: '开业日期' },
];
</script>
<template>
  <div class="example">
    <div class="controls">
      <ZtButton size="small" @click="expanded = [1]">仅展开杭州店</ZtButton
      ><ZtButton size="small" @click="expanded = []">全部收起</ZtButton>
    </div>
    <ZtTable
      v-model:expanded-keys="expanded"
      :data="data"
      :columns="columns"
      expandable
      ><template #expand="{ row }"
        ><div class="details">
          <div>
            <span>门店地址</span><strong>{{ row.address }}</strong>
          </div>
          <div>
            <span>经营说明</span><strong>{{ row.description }}</strong>
          </div>
        </div></template
      ></ZtTable
    >
    <p>通过 expand 插槽放置业务详情；expanded-keys 支持默认展开和外部控制。</p>
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
.details {
  display: grid;
  grid-template-columns: minmax(120px, 1fr) 2fr;
  gap: 20px;
  padding: 10px;
}
.details span {
  display: block;
  color: var(--zt-text-muted, #626262);
  font-size: 12px;
  margin-bottom: 8px;
}
.details strong {
  font-size: 13px;
  font-weight: 400;
}
p {
  margin: 0;
  color: var(--zt-text-muted, #626262);
  font-size: 12px;
  line-height: 1.7;
}
@media (max-width: 600px) {
  .details {
    grid-template-columns: 1fr;
  }
}
</style>
