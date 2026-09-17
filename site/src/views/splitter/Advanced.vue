<script setup lang="ts">
import { ref } from 'vue';
import { ZtSplitter, ZtButton } from '@ztechjs/zt-ui';
const height = ref(55),
  disabled = ref(false);
</script>
<template>
  <div>
    <ZtButton @click="disabled = !disabled">{{
      disabled ? '允许调整' : '锁定分栏'
    }}</ZtButton
    ><ZtSplitter
      v-model="height"
      direction="vertical"
      :min="15"
      :max="85"
      :disabled="disabled"
      collapsible
      class="vertical"
      ><template #first
        ><div class="pane">预览区域 {{ height.toFixed(0) }}%</div></template
      ><template #second><div class="pane">控制台</div></template></ZtSplitter
    >
  </div>
</template>
<style scoped>
.vertical {
  margin-top: 16px;
  height: 280px;
}
.pane {
  padding: 20px;
}
</style>
