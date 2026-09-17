<script setup lang="ts">
import { ref } from 'vue';
import { ZtButton, ZtResult } from '@ztechjs/zt-ui';
const message = ref('');
</script>

<template>
  <ZtResult status="success" title="提交成功" sub-title="数据已经保存，可以安全返回列表。"
    ><template #extra
      ><ZtButton status="primary" @click="message = '已返回列表（演示）'"
        >返回列表</ZtButton
      ></template
    ></ZtResult
  >
  <p role="status">{{ message }}</p>
</template>
