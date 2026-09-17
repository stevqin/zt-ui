<script setup lang="ts">
import { ZtButton, ZtPopover, ZtText } from '@ztechjs/zt-ui';
</script>

<template>
  <ZtPopover placement="top" width="240"
    ><ZtButton>查看详情</ZtButton
    ><template #content
      ><ZtText weight="semibold">订单摘要</ZtText>
      <p>待发货 3 件，总金额 ¥1,280。</p></template
    ></ZtPopover
  >
</template>

<style scoped>
.popover-row {
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
}
</style>
