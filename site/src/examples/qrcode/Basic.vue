<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtQRCode, ZtInput } from '@ztechjs/zt-ui';
const value = ref('https://example.com/products/DEMO202610001');
</script>
<template>
  <ZtInput v-model="value" placeholder="输入需要编码的文本" aria-label="二维码内容" />
  <ZtQRCode :value="value" label="商品查询地址二维码" />
  <p>{{ value || '请输入内容' }}</p>
</template>
