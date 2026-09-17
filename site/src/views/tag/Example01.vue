<script setup lang="ts">
import { ZtTag } from '@ztechjs/zt-ui';
</script>

<template>
  <div class="demo-row">
    <ZtTag>默认</ZtTag><ZtTag status="primary">主要</ZtTag><ZtTag status="success">成功</ZtTag
    ><ZtTag status="warning">警告</ZtTag><ZtTag status="danger">危险</ZtTag
    ><ZtTag status="info">信息</ZtTag>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.demo-row:last-child {
  margin-bottom: 0;
}
</style>
