<script setup lang="ts">
import { ref } from 'vue';
import { ZtPopconfirm, ZtButton } from '@ztechjs/zt-ui';
const attempts = ref(0);
const result = ref('');
async function beforeConfirm() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  attempts.value++;
  if (attempts.value === 1) {
    result.value = '检查失败，请再次确认';
    return false;
  }
  return true;
}
</script>

<template>
  <div class="demo">
    <ZtPopconfirm
      title="提交审核？"
      :before-confirm="beforeConfirm"
      @confirm="result = '已提交审核'"
    >
      <ZtButton>提交审核</ZtButton>
    </ZtPopconfirm>
    <p>{{ result }}</p>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 16px;
  max-width: 100%;
}
.demo p {
  margin: 0;
}
</style>
