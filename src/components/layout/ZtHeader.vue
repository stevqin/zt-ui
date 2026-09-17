<script setup lang="ts">
import type { ZtHeaderProps } from './types';
defineOptions({ name: 'ZtHeader' });
const props = withDefaults(defineProps<ZtHeaderProps>(), { height: 60 });
</script>
<template>
  <header
    class="zt-header"
    :style="{
      height:
        typeof props.height === 'number' ? props.height + 'px' : props.height,
    }"
  >
    <slot />
  </header>
</template>
<style scoped lang="scss">
.zt-header {
  box-sizing: border-box;
  min-width: 0;
  flex-shrink: 0;
}
</style>
