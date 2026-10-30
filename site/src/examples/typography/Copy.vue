<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtTypography } from '@ztechjs/zt-ui';
const result = ref('点击复制按钮获取订单号');
</script>
<template>
  <ZtTypography
    code
    copyable
    text="订单 DEMO202610001"
    copy-text="DEMO202610001"
    @copy="result = `已复制：${$event}`"
    @copy-error="result = '复制失败，请手动选择文本'"
  />
  <p role="status">{{ result }}</p>
</template>
