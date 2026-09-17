<script setup lang="ts">
import { ref } from 'vue';
import { ZtButton, ZtPopover } from '@ztechjs/zt-ui';
const manual = ref(false);
</script>

<template>
  <div class="popover-row">
    <ZtButton @click="manual = !manual">切换</ZtButton
    ><ZtPopover v-model:visible="manual" trigger="manual"
      ><ZtButton>锚点</ZtButton><template #content>受控内容</template></ZtPopover
    >
  </div>
</template>

<style scoped>
.popover-row {
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
}
</style>
