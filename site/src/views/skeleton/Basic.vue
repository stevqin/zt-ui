<script setup lang="ts">
import { ref } from 'vue';
import { ZtSkeleton, ZtButton } from '@ztechjs/zt-ui';
const loading = ref(true);
</script>
<template>
  <div>
    <ZtButton @click="loading = !loading">{{
      loading ? '完成加载' : '重新加载'
    }}</ZtButton>
    <div class="body">
      <ZtSkeleton
        :loading="loading"
        :rows="4"
        :widths="['100%', '80%', '90%', '45%']"
        ><p>加载完成后的真实内容。</p></ZtSkeleton
      >
    </div>
  </div>
</template>
<style scoped>
.body {
  padding-top: 20px;
}
</style>
