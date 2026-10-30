<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtCollapse, ZtCollapseItem } from '@ztechjs/zt-ui';
const opened = ref<string[]>([]);
</script>
<template>
  <ZtCollapse v-model="opened">
    <ZtCollapseItem name="export" title="如何导出报表？">
      <p>在报表工具栏点击导出，系统会生成当前筛选范围的 Excel 文件。</p>
    </ZtCollapseItem>
    <ZtCollapseItem name="range" title="可以查询多久的数据？">
      <p>默认展示近 30 天，可在筛选中调整日期范围。</p>
    </ZtCollapseItem>
    <ZtCollapseItem name="archive" title="归档设置（无权限）" disabled />
  </ZtCollapse>
</template>
