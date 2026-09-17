<script setup lang="ts">
import { computed, provide } from 'vue';
import type { ZtRowProps } from './types';
import { rowGutterKey } from './context';
const props = withDefaults(defineProps<ZtRowProps>(), {
  gutter: 0,
  justify: 'start',
  align: 'top',
  wrap: true,
});
const horizontal = computed(() =>
  Math.max(0, Array.isArray(props.gutter) ? props.gutter[0] : props.gutter),
);
const vertical = computed(() =>
  Array.isArray(props.gutter) ? Math.max(0, props.gutter[1]) : 0,
);
provide(rowGutterKey, horizontal);
const alignment = computed(
  () =>
    ({
      top: 'flex-start',
      middle: 'center',
      bottom: 'flex-end',
      center: 'center',
      stretch: 'stretch',
    })[props.align],
);
</script>
<template>
  <div
    class="zt-row"
    :style="{
      marginLeft: -horizontal / 2 + 'px',
      marginRight: -horizontal / 2 + 'px',
      rowGap: vertical + 'px',
      justifyContent: justify,
      alignItems: alignment,
      flexWrap: wrap ? 'wrap' : 'nowrap',
    }"
  >
    <slot />
  </div>
</template>
<style scoped lang="scss">
.zt-row {
  display: flex;
  box-sizing: border-box;
  min-width: 0;
}
</style>
