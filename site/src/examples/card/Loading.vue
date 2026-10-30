<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtCard, ZtButton } from '@ztechjs/zt-ui';
const loading = ref(true);
</script>
<template>
  <ZtCard title="库存汇总" shadow="hover" :loading="loading">
    <template #extra>
      <ZtButton text @click="loading = !loading">切换加载</ZtButton>
    </template>
    <p>当前可用库存 2,840 件</p>
    <template #footer>库存单位：件</template>
  </ZtCard>
</template>
