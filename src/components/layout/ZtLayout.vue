<script setup lang="ts">
import { computed, Fragment, type VNode } from 'vue';
import type { ZtLayoutProps } from './types';
defineOptions({ name: 'ZtLayout' });
const props = defineProps<ZtLayoutProps>(),
  slots = defineSlots<{ default?: () => VNode[] }>();
function hasVertical(nodes: VNode[]): boolean {
  return nodes.some((node) =>
    node.type === Fragment && Array.isArray(node.children)
      ? hasVertical(node.children as VNode[])
      : typeof node.type === 'object' &&
        ['ZtHeader', 'ZtFooter'].includes(
          (node.type as { name?: string }).name ?? '',
        ),
  );
}
const direction = computed(
  () =>
    props.direction ??
    (hasVertical(slots.default?.() ?? []) ? 'vertical' : 'horizontal'),
);
</script>
<template>
  <section :class="['zt-layout', `zt-layout--${direction}`]"><slot /></section>
</template>
<style scoped lang="scss">
@use '../../styles/tokens' as glass;
.zt-layout {
  @include glass.tokens;
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
  color: var(--glass-default-ink);
  font-family: var(--glass-font);
  &--vertical {
    flex-direction: column;
  }
}
</style>
