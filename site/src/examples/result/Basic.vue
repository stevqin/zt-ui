<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtResult, ZtButton } from '@ztechjs/zt-ui';
const created = ref(0);
</script>
<template>
  <ZtResult
    status="success"
    title="调拨单已提交"
    sub-title="单据 DEMO202610001 已进入审批流程。"
  >
    <template #extra>
      <ZtButton status="primary" @click="created++">继续新建</ZtButton>
    </template>
  </ZtResult>
  <p role="status">已开始 {{ created }} 份新单据</p>
</template>
