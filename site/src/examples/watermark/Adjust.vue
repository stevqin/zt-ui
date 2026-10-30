<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtWatermark } from '@ztechjs/zt-ui';
const rotate = ref(-22);
</script>
<template>
  <label>
    角度
    <input v-model.number="rotate" type="range" min="-60" max="0" />
    {{ rotate }}°
  </label>
  <ZtWatermark content="仅限内部查阅" :rotate="rotate" :gap="[40, 40]" :opacity="0.2">
    <div style="height: 200px; padding: 24px">2026 秋冬订货分析 · 内部资料</div>
  </ZtWatermark>
</template>
