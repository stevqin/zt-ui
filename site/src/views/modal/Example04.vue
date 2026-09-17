<script setup lang="ts">
import { ref } from 'vue';
import { ZtButton, ZtModal } from '@ztechjs/zt-ui';
const fullscreenVisible = ref(false);
const fullscreen = ref(false);
const fullscreenState = ref('窗口模式');
function handleFullscreenChange(value: boolean) {
  fullscreenState.value = value ? '全屏模式' : '窗口模式';
}
</script>

<template>
  <div class="demo-row">
    <ZtButton @click="fullscreenVisible = true">打开工作区</ZtButton
    ><span class="demo-state">{{ fullscreenState }}</span>
  </div>
  <ZtModal
    v-model="fullscreenVisible"
    v-model:fullscreen="fullscreen"
    title="可拖拽工作区"
    show-fullscreen-button
    draggable
    @fullscreen-change="handleFullscreenChange"
    ><p>拖动标题栏可在视口内移动弹窗，点击右上角按钮进入或退出全屏。</p></ZtModal
  >
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

.overlay-demo-form {
  display: grid;
  gap: 14px;
}
.overlay-demo-form label {
  display: grid;
  gap: 6px;
  color: #4b5563;
  font-size: 13px;
}
.overlay-demo-form input {
  padding: 9px 11px;
  border: 1px solid #d1d5db;
  border-radius: 9px;
  font: inherit;
}
.demo-state {
  color: #64748b;
  font-size: 13px;
}
</style>
