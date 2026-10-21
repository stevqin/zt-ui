<script setup lang="ts">
import { ref } from 'vue';
import { ZtButton, ZtConfigProvider, ZtInput, ZtModal } from '@ztechjs/zt-ui';
const visible = ref(false);
const theme = ref<'light' | 'dark'>('light');
const name = ref('季度经营分析');
function open(value: 'light' | 'dark') { theme.value = value; visible.value = true; }
</script>

<template>
  <div class="glass-demo-actions">
    <ZtButton status="primary" @click="open('light')">浅色玻璃弹窗</ZtButton>
    <ZtButton @click="open('dark')">深色玻璃弹窗</ZtButton>
  </div>
  <ZtConfigProvider :theme="theme" :border-radius="11">
    <ZtModal v-model="visible" title="液态玻璃弹窗" :width="560" show-footer show-fullscreen-button draggable @confirm="visible = false">
      <div class="glass-demo-content">
        <p>柔和的白光渐变、边缘高光与背景透光，让窗口拥有玻璃的厚度；正文始终清晰可读。</p>
        <label>报表名称<ZtInput v-model="name" aria-label="报表名称" /></label>
        <p class="glass-demo-hint">可拖动标题栏，也可切换全屏查看内容。</p>
      </div>
    </ZtModal>
  </ZtConfigProvider>
</template>

<style scoped>
.glass-demo-actions { display: flex; flex-wrap: wrap; gap: 10px; }
.glass-demo-content { display: grid; gap: 18px; }
.glass-demo-content p { margin: 0; }
.glass-demo-content label { display: grid; gap: 8px; }
.glass-demo-hint { color: var(--glass-muted); font-size: 12px; }
</style>
