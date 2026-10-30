<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtTabs, ZtTabPane } from '@ztechjs/zt-ui';
const active = ref('info');
</script>
<template>
  <ZtTabs v-model="active">
    <ZtTabPane name="info" label="商品信息">
      <p>商品编号 DEMO202610001 · 机械键盘</p>
    </ZtTabPane>
    <ZtTabPane name="stock" label="库存明细" lazy>
      <p>华东仓 280 件 · 华南仓 160 件</p>
    </ZtTabPane>
    <ZtTabPane name="cost" label="成本信息" disabled />
  </ZtTabs>
  <p>当前页签：{{ active }}</p>
</template>
