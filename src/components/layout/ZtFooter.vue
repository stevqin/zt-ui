<script setup lang="ts">
import type { ZtFooterProps } from './types';
defineOptions({ name: 'ZtFooter' });
const props = withDefaults(defineProps<ZtFooterProps>(), { height: 60 });
</script>
<template>
  <footer
    class="zt-footer"
    :style="{
      height:
        typeof props.height === 'number' ? props.height + 'px' : props.height,
    }"
  >
    <slot />
  </footer>
</template>
<style scoped lang="scss">
.zt-footer {
  box-sizing: border-box;
  min-width: 0;
  flex-shrink: 0;
}
</style>
