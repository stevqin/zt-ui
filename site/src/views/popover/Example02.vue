<script setup lang="ts">
import { ZtButton, ZtPopover } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="popover-row">
    <ZtPopover trigger="hover"
      ><ZtButton>Hover</ZtButton><template #content>悬停内容</template></ZtPopover
    ><ZtPopover trigger="focus"
      ><ZtButton>Focus</ZtButton><template #content>聚焦内容</template></ZtPopover
    ><ZtPopover trigger="click" placement="right"
      ><ZtButton>Click</ZtButton><template #content>点击外部或按 Escape 关闭。</template></ZtPopover
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
