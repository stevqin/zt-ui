<script setup lang="ts">
import { ref } from 'vue';
import {
  ZtButton,
  ZtTable,
  ZtTableColumn,
  ZtTag,
  type ZtTableKey,
} from '@ztechjs/zt-ui';
const expanded = ref<ZtTableKey[]>([1]);
const data = [
  {
    id: 1,
    name: '杭州旗舰店',
    owner: '陈经理',
    address: '浙江省杭州市上城区',
    description: '华东品牌形象店，提供全系列商品与会员预约服务。',
  },
  {
    id: 2,
    name: '上海静安店',
    owner: '李经理',
    address: '上海市静安区南京西路',
    description: '城市精品门店，提供新品展示及会员专属服务。',
  },
];
</script>
<template>
  <div class="example">
    <div class="controls">
      <ZtButton size="small" @click="expanded = [1, 2]">展开全部门店</ZtButton
      ><ZtButton
        size="small"
        :disabled="!expanded.length"
        @click="expanded = []"
        >收起全部门店</ZtButton
      >
    </div>
    <ZtTable v-model:expanded-keys="expanded" :data="data" border>
      <ZtTableColumn prop="name" label="门店" :width="200" fixed="left" />
      <ZtTableColumn type="expand" :width="52">
        <template #default="{ row, index }"
          ><div class="details">
            <ZtTag size="small">门店 {{ index + 1 }}</ZtTag
            ><strong>{{ row.address }}</strong>
            <p>{{ row.description }}</p>
          </div></template
        >
      </ZtTableColumn>
      <ZtTableColumn prop="owner" label="负责人" />
    </ZtTable>
    <p role="status">模板展开：当前 {{ expanded.length }} 家门店展开</p>
    <p>
      工具列按模板声明顺序显示。type="expand" 的默认插槽提供行详情，无需
      expandable；也可继续使用 Table 的 #expand
      插槽。与旧属性同时使用不会生成重复列；同类声明以第一列为准。
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
.details {
  display: grid;
  gap: 10px;
  justify-items: start;
  padding: 8px 12px;
}
p {
  margin: 0;
  color: var(--zt-text-muted, #626262);
  font-size: 12px;
  line-height: 1.7;
}
</style>
