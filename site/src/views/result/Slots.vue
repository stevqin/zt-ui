<script setup lang="ts">
import { ZtResult, ZtButton } from '@ztechjs/zt-ui';
import { ref } from 'vue';
const message = ref('');
</script>

<template>
  <div class="example-stack">
    <ZtResult status="info"
      ><template #icon><span style="font-size: 48px" aria-hidden="true">✉</span></template
      ><template #title>通知已发送</template><template #sub-title>3 位协作者会收到通知。</template
      ><template #extra
        ><ZtButton @click="message = '已返回列表'">返回列表</ZtButton></template
      ></ZtResult
    >
    <p role="status">{{ message }}</p>
  </div>
</template>

<style scoped>
.example-stack {
  display: grid;
  gap: 16px;
  min-width: 0;
}
.example-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.example-note {
  color: var(--zt-text-muted, #68768a);
  font-size: 13px;
  overflow-wrap: anywhere;
}
</style>
