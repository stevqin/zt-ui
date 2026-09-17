<script setup lang="ts">
import { ref } from 'vue';
import { ZtTooltip, ZtButton, ZtSwitch } from '@ztechjs/zt-ui';
const visible = ref(false),
  disabled = ref(false);
</script>
<template>
  <div class="demo-row">
    <ZtSwitch v-model="disabled" active-text="禁用提示" /><ZtButton
      @click="visible = !visible"
      >切换提示</ZtButton
    ><ZtTooltip
      v-model:visible="visible"
      :disabled="disabled"
      :open-delay="500"
      :close-delay="200"
      content="悬停 500ms 显示；Escape 关闭"
      ><ZtButton>悬停或聚焦</ZtButton></ZtTooltip
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
