<script setup lang="ts">
import { ref } from 'vue';
import { ZtTooltip, ZtButton } from '@ztechjs/zt-ui';
const visible = ref(false);
</script>

<template>
  <div class="demo">
    <ZtTooltip v-model:visible="visible" content="复制时会包含完整字段名称" :width="220">
      <ZtButton @click="visible = !visible">查看说明</ZtButton>
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
