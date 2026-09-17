<script setup lang="ts">
import { ref } from 'vue';
import { ZtTabs, ZtTabPane, ZtSelect } from '@ztechjs/zt-ui';
import type { ZtTabsPosition, ZtTabsType } from '@ztechjs/zt-ui';
const active = ref('orders');
const position = ref<ZtTabsPosition>('top');
const type = ref<ZtTabsType>('line');
const positions = ['top', 'right', 'bottom', 'left'].map((value) => ({ label: value, value }));
const types = ['line', 'card', 'border-card'].map((value) => ({ label: value, value }));
</script>

<template>
  <div class="example-stack">
    <div class="example-row">
      <ZtSelect v-model="position" :options="positions" aria-label="标签位置" /><ZtSelect
        v-model="type"
        :options="types"
        aria-label="标签外观"
      />
    </div>
    <ZtTabs v-model="active" :position="position" :type="type" stretch
      ><ZtTabPane name="orders" label="订单">订单内容</ZtTabPane
      ><ZtTabPane name="customers" label="客户">客户内容</ZtTabPane></ZtTabs
    >
  </div>
</template>

<style scoped>
.example-stack {
  display: grid;
  gap: 16px;
  min-width: 0;
}
.example-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.example-note {
  color: var(--zt-text-muted, #68768a);
  font-size: 13px;
  overflow-wrap: anywhere;
}
</style>
