<script setup lang="ts">
import { ZtTooltip, ZtButton } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="demo">
    <ZtTooltip content="导出当前筛选结果" placement="top">
      <ZtButton>导出</ZtButton>
    </ZtTooltip>
    <ZtTooltip content="仅管理员可修改权限" placement="right">
      <ZtButton>权限说明</ZtButton>
    </ZtTooltip>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 16px;
  max-width: 100%;
}
.demo p {
  margin: 0;
}
</style>
