<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtCollapse, ZtCollapseItem, ZtStatistic } from '@ztechjs/zt-ui';
const opened = ref<string | number | null>('sales');
</script>
<template>
  <ZtCollapse v-model="opened" accordion>
    <ZtCollapseItem name="sales" title="销售指标">
      <ZtStatistic title="本月销售额" :value="128600" prefix="¥" />
    </ZtCollapseItem>
    <ZtCollapseItem name="stock" title="库存指标" lazy>
      <ZtStatistic title="可用库存" :value="2840" suffix="件" />
    </ZtCollapseItem>
  </ZtCollapse>
  <p>展开项：{{ opened || '全部收起' }}</p>
</template>
