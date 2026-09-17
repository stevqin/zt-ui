<script setup lang="ts">
import type { ZtMainProps } from './types';
defineOptions({ name: 'ZtMain' });
defineProps<ZtMainProps>();
</script>
<template>
  <main class="zt-main"><slot /></main>
</template>
<style scoped lang="scss">
.zt-main {
  box-sizing: border-box;
  min-width: 0;
  flex: 1;
  overflow: auto;
}
</style>
