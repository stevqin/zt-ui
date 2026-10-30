<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtScrollbar } from '@ztechjs/zt-ui';
const top = ref(0);
</script>
<template>
  <ZtScrollbar
    :height="220"
    always
    aria-label="门店列表"
    @scroll="top = Math.round($event.scrollTop)"
  >
    <div v-for="n in 20" :key="n" class="row">门店 {{ String(n).padStart(3, '0') }}</div>
  </ZtScrollbar>
  <p>滚动位置 {{ top }}px</p>
</template>
<style scoped>
.row {
  padding: 12px 16px;
  border-bottom: 1px solid #8883;
}
</style>
