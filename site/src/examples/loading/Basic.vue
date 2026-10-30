<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtLoading, ZtButton } from '@ztechjs/zt-ui';
const loading = ref(true);
</script>
<template>
  <ZtButton @click="loading = !loading">{{ loading ? '结束加载' : '开始加载' }}</ZtButton>
  <ZtLoading :loading="loading" text="正在汇总销售数据">
    <div class="report">华东区域销售额：¥128,600</div>
  </ZtLoading>
</template>
<style scoped>
.report {
  padding: 48px 20px;
  margin-top: 12px;
  border: 1px solid #8884;
}
</style>
