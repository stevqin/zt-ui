<script setup lang="ts">
import { ref } from 'vue';
import { ZtButton, ZtPopconfirm, ZtText } from '@ztechjs/zt-ui';
const message = ref('尚未操作');
</script>

<template>
  <div class="confirm-row">
    <ZtPopconfirm
      title="确定删除这条记录？"
      description="删除后无法恢复"
      status="danger"
      @confirm="message = '记录已删除'"
      @cancel="message = '已取消'"
      ><ZtButton status="danger">删除</ZtButton></ZtPopconfirm
    ><ZtText>{{ message }}</ZtText>
  </div>
</template>

<style scoped>
.confirm-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
