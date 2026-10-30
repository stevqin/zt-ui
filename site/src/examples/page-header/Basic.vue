<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtPageHeader, ZtButton } from '@ztechjs/zt-ui';
const detail = ref(true);
</script>
<template>
  <ZtPageHeader
    v-if="detail"
    title="调拨单 DEMO202610001"
    description="华东仓 → 华南仓 · 待审批"
    @back="detail = false"
  />
  <div v-else>
    <h3>调拨单列表</h3>
    <ZtButton @click="detail = true">查看 DEMO202610001</ZtButton>
  </div>
</template>
