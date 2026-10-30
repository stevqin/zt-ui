<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtScrollbar, ZtSpace, ZtButton } from '@ztechjs/zt-ui';
import type { ZtScrollbarInstance } from '@ztechjs/zt-ui';
const scrollbar = ref<ZtScrollbarInstance>();
</script>
<template>
  <ZtSpace>
    <ZtButton @click="scrollbar?.setScrollTop(0)">顶部</ZtButton>
    <ZtButton @click="scrollbar?.scrollTo({ top: 1000, behavior: 'smooth' })">
      底部
    </ZtButton>
  </ZtSpace>
  <ZtScrollbar ref="scrollbar" :height="180" aria-label="库存流水">
    <div
      v-for="n in 18"
      :key="n"
      style="padding: 12px; min-width: 650px; border-bottom: 1px solid #8883"
    >
      流水 {{ n }}　华东仓　DEMO202610001　入库 20 件　2026-10-30 09:00
    </div>
  </ZtScrollbar>
</template>
