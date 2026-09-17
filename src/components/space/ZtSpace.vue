<script setup lang="ts">
import { Comment, Text, Fragment, computed, type VNode } from 'vue';
import { useZtSize } from '../config-provider/context';
import type { ZtSpaceProps } from './types';
const props = withDefaults(defineProps<ZtSpaceProps>(), {
  direction: 'horizontal',
  align: 'center',
  justify: 'start',
  wrap: false,
});
const slots = defineSlots<{
    default?: () => VNode[];
    separator?: () => VNode[];
  }>(),
  size = useZtSize(props);
function flatten(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) =>
    node.type === Comment ||
    (node.type === Text && !String(node.children).trim())
      ? []
      : node.type === Fragment && Array.isArray(node.children)
        ? flatten(node.children as VNode[])
        : [node],
  );
}
const nodes = () => flatten(slots.default?.() ?? []);
const gap = computed(
  () =>
    props.gap ??
    { mini: 4, small: 6, default: 8, medium: 12, large: 16 }[size.value],
);
const gapStyle = computed(() =>
  Array.isArray(gap.value)
    ? `${gap.value[1]}px ${gap.value[0]}px`
    : `${gap.value}px`,
);
</script>
<template>
  <div
    class="zt-space"
    :style="{
      flexDirection: direction === 'vertical' ? 'column' : 'row',
      gap: gapStyle,
      alignItems: align,
      justifyContent: justify,
      flexWrap: wrap ? 'wrap' : 'nowrap',
    }"
  >
    <template v-for="(node, index) in nodes()" :key="node.key ?? index"
      ><span
        v-if="index > 0 && $slots.separator"
        class="zt-space__separator"
        aria-hidden="true"
        ><slot name="separator"
      /></span>
      <div class="zt-space__item"><component :is="node" /></div
    ></template>
  </div>
</template>
<style scoped lang="scss">
.zt-space {
  display: flex;
  min-width: 0;
}
.zt-space__item {
  min-width: 0;
}
.zt-space__separator {
  flex: none;
}
</style>
