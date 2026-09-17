<script setup lang="ts">
import { ZtButton } from '@ztechjs/zt-ui';
import { ref } from 'vue';
const loading = ref(false);
const circleLoading = ref(false);
function toggleLoading() {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
}
function toggleCircleLoading() {
  circleLoading.value = true;
  setTimeout(() => {
    circleLoading.value = false;
  }, 2000);
}
</script>

<template>
  <div class="demo-row">
    <ZtButton status="primary" :loading="loading" @click="toggleLoading">点击加载</ZtButton>
    <ZtButton status="success" :loading="loading" loading-text="处理中…" @click="toggleLoading"
      >提交</ZtButton
    >
    <ZtButton
      status="primary"
      circle
      :loading="circleLoading"
      @click="toggleCircleLoading"
      aria-label="刷新"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M16 16h5v5" />
      </svg>
    </ZtButton>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.demo-row:last-child {
  margin-bottom: 0;
}
</style>
