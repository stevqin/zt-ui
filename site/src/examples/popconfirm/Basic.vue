<script setup lang="ts">
import { ref } from 'vue';
import { ZtPopconfirm, ZtButton } from '@ztechjs/zt-ui';
const result = ref('记录仍然保留');
</script>

<template>
  <div class="demo">
    <ZtPopconfirm
      title="确认删除这条记录？"
      description="删除后需要重新导入。"
      status="danger"
      @confirm="result = '记录已删除'"
    >
      <ZtButton status="danger">删除</ZtButton>
    </ZtPopconfirm>
    <p>{{ result }}</p>
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
