<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtLoading, ZtButton } from '@ztechjs/zt-ui';
const loading = ref(false),
  result = ref('尚未生成');
async function run() {
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 800));
  loading.value = false;
  result.value = '报表已生成';
}
</script>
<template>
  <ZtButton @click="run">生成报表</ZtButton>
  <ZtLoading :loading="loading" fullscreen lock text="正在生成报表，请稍候" />
  <p role="status">{{ result }}</p>
</template>
