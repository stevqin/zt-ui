<script setup lang="ts">
import { ZtAlert } from '@ztechjs/zt-ui';
</script>
<template>
  <ZtAlert
    title="导出范围提醒"
    description="仅导出当前筛选条件下的数据，请核对日期与组织权限。"
    status="warning"
    show-icon
    :closable="false"
  />
</template>
