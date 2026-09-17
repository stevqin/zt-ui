<script setup lang="ts">
import { ref } from 'vue';
import { ZtButton, ZtPopconfirm, ZtText } from '@ztechjs/zt-ui';
const message = ref('尚未操作');
const saving = ref(false);
function submit() {
  saving.value = true;
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      saving.value = false;
      message.value = '审批已提交';
      resolve();
    }, 700),
  );
}
</script>

<template>
  <div class="confirm-row">
    <ZtPopconfirm title="提交审批？" :before-confirm="submit"
      ><ZtButton :loading="saving">提交</ZtButton></ZtPopconfirm
    ><ZtText status="info">{{ message }}</ZtText>
  </div>
</template>

<style scoped>
.confirm-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
