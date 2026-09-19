<script setup lang="ts">
import { ZtButton, ZtPopover, ZtText } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="popover-row">
    <ZtPopover placement="top"
      ><ZtButton>自适应尺寸</ZtButton
      ><template #content
        ><ZtText weight="semibold">订单摘要</ZtText>
        <p>待发货 3 件，总金额 ¥1,280。</p></template
      ></ZtPopover
    >
    <ZtPopover placement="top" :width="240" :height="120"
      ><ZtButton>固定尺寸</ZtButton
      ><template #content>显式指定宽高后，内容区域超出时滚动。</template></ZtPopover
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
