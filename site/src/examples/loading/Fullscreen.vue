<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { ZtLoading, ZtButton } from "@ztechjs/zt-ui";
const loading = ref(false),
  result = ref("尚未生成");
let timer: ReturnType<typeof setTimeout> | undefined;
onBeforeUnmount(() => clearTimeout(timer));
function run() {
  if (loading.value) return;
  loading.value = true;
  result.value = "正在生成报表";
  timer = setTimeout(() => {
    loading.value = false;
    result.value = "报表已生成";
  }, 800);
}
</script>
<template>
  <ZtButton @click="run">生成报表</ZtButton>
  <ZtLoading :loading="loading" fullscreen lock text="正在生成报表，请稍候" />
  <p role="status">{{ result }}</p>
</template>
