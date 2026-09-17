<script setup lang="ts">
import type { ZtAsideProps } from './types';
defineOptions({ name: 'ZtAside' });
const props = withDefaults(defineProps<ZtAsideProps>(), { width: 200 });
</script>
<template>
  <aside
    class="zt-aside"
    :style="{
      width: typeof props.width === 'number' ? props.width + 'px' : props.width,
    }"
  >
    <slot />
  </aside>
</template>
<style scoped lang="scss">
.zt-aside {
  box-sizing: border-box;
  min-width: 0;
  flex-shrink: 0;
}
</style>
