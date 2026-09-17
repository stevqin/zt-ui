<script setup lang="ts">
import { ZtButton, useZtNotification } from '@ztechjs/zt-ui';
import type { ZtNotificationPosition } from '@ztechjs/zt-ui';
const notify = useZtNotification();
const positions: ZtNotificationPosition[] = [
  'top-right',
  'top-left',
  'bottom-right',
  'bottom-left',
];
</script>
<template>
  <div class="demo-row">
    <ZtButton
      v-for="position in positions"
      :key="position"
      @click="
        notify({
          title: '报表生成成功',
          message: '报表数据已经整理完成。',
          position,
          type: 'success',
        })
      "
      >{{ position }}</ZtButton
    >
  </div>
</template>
<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.demo-stack {
  display: grid;
  gap: 14px;
}
</style>
