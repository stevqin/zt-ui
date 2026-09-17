<script setup lang="ts">
import { ref } from 'vue';
import { ZtAffix, ZtButton } from '@ztechjs/zt-ui';
const panel = ref<HTMLElement>(),
  disabled = ref(false);
</script>
<template>
  <div>
    <ZtButton @click="disabled = !disabled">{{
      disabled ? '启用固定' : '暂停固定'
    }}</ZtButton>
    <div ref="panel" class="panel">
      <div class="long">底部工具栏在区域内保持可见。</div>
      <ZtAffix
        :container="() => panel"
        position="bottom"
        :offset="8"
        :disabled="disabled"
        ><div class="toolbar">批量审核 · 导出报表</div></ZtAffix
      >
    </div>
  </div>
</template>
<style scoped>
.panel {
  height: 240px;
  overflow: auto;
  border: 1px solid #8a9ab044;
  margin-top: 16px;
}
.long {
  height: 650px;
  padding: 16px;
}
.toolbar {
  padding: 16px;
  background: #e9f4ed;
  border: 1px solid #aacdb7;
  border-radius: 6px;
}
</style>
