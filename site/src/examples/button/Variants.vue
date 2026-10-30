<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtButton, ZtSpace } from '@ztechjs/zt-ui';
const saving = ref(false),
  saved = ref(false);
async function save() {
  saving.value = true;
  await new Promise((resolve) => setTimeout(resolve, 700));
  saved.value = true;
  saving.value = false;
}
</script>
<template>
  <ZtSpace wrap>
    <ZtButton status="success" plain>审核通过</ZtButton>
    <ZtButton status="primary" dashed>添加条件</ZtButton>
    <ZtButton status="danger" text>删除</ZtButton>
    <ZtButton color="#7c3aed">自定义颜色</ZtButton>
    <ZtButton status="primary" :loading="saving" loading-text="保存中" @click="save">
      {{ saved ? '已保存' : '保存草稿' }}
    </ZtButton>
  </ZtSpace>
</template>
