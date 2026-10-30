<script setup lang="ts">
import type {
  ZtTableColumnProps,
  ZtTableCellScope,
  ZtTableHeaderScope,
} from './types';
defineOptions({ name: 'ZtTableColumn' });
withDefaults(defineProps<ZtTableColumnProps>(), {
  resizable: true,
  type: 'default',
});
defineSlots<{
  /** 自定义单元格；type=expand 时为展开详情，接收 row、column、value、显示 index 和原始 rowIndex。 */
  default?: (scope: ZtTableCellScope) => unknown;
  /** 自定义表头，接收 column。 */
  header?: (scope: ZtTableHeaderScope) => unknown;
}>();
</script>
<template></template>
