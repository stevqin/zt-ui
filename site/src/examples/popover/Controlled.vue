<script setup lang="ts">
import { ref } from 'vue';
import { ZtPopover, ZtButton } from '@ztechjs/zt-ui';
const visible = ref(false);
</script>

<template>
  <div class="demo">
    <ZtPopover v-model:visible="visible" trigger="manual" placement="right">
      <ZtButton @click="visible = !visible">切换提示</ZtButton>
      <template #content>
        <p>点击完成关闭步骤说明。</p>
        <ZtButton @click="visible = false">完成</ZtButton>
      </template>
    </ZtPopover>
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
