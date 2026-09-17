<script setup lang="ts">
import { ref } from 'vue';
import { ZtCard, ZtButton } from '@ztechjs/zt-ui';
const loading = ref(false);
</script>
<template>
  <ZtCard title="本月订单" :loading="loading" shadow="hover"
    ><template #extra
      ><ZtButton size="small" @click="loading = !loading">{{
        loading ? '显示内容' : '模拟加载'
      }}</ZtButton></template
    >已完成 128 笔订单。<template #footer>更新于今天 09:00</template></ZtCard
  >
</template>
