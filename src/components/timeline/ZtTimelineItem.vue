<script setup lang="ts">
import type { ZtTimelineItemProps, ZtTimelineItemScope } from './types';
defineOptions({ name: 'ZtTimelineItem' });
defineProps<ZtTimelineItemProps>();
defineSlots<{
  /** 自定义该节点内容，接收 item 和 index。 */
  default?: (scope: ZtTimelineItemScope) => unknown;
  /** 自定义该节点图标，接收 item 和 index；优先于 Timeline 的 node 插槽。 */
  node?: (scope: ZtTimelineItemScope) => unknown;
}>();
</script>
<template></template>
