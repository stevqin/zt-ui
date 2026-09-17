<script setup lang="ts">
import { ref } from 'vue';
import { ZtCollapse, ZtCollapseItem, ZtTag } from '@ztechjs/zt-ui';
const expanded = ref<string[]>([]);
</script>

<template>
  <div class="example-stack">
    <ZtCollapse v-model="expanded">
      <ZtCollapseItem name="lazy" title="详情" lazy
        ><template #title
          ><span>订单详情 <ZtTag size="mini">懒渲染</ZtTag></span></template
        >首次展开时创建内容，收起后保留。</ZtCollapseItem
      >
      <ZtCollapseItem name="locked" title="无权查看" disabled>禁用面板的内容</ZtCollapseItem>
    </ZtCollapse>
    <p>已展开：{{ expanded }}</p>
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
