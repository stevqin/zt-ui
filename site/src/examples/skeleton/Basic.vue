<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtSkeleton, ZtButton } from '@ztechjs/zt-ui';
const loading = ref(true);
</script>
<template>
  <ZtButton @click="loading = !loading">{{ loading ? '显示内容' : '显示骨架' }}</ZtButton>
  <ZtSkeleton :loading="loading" :rows="3" :widths="['80%', '100%', '60%']">
    <h3>秋冬订货会</h3>
    <p>订货会将于 11 月举行，请提前完成商品选款。</p>
  </ZtSkeleton>
</template>
