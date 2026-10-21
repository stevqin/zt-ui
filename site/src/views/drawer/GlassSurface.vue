<script setup lang="ts">
import { ref } from 'vue';
import { ZtButton, ZtConfigProvider, ZtInput, ZtDrawer } from '@ztechjs/zt-ui';
const visible = ref(false);
const theme = ref<'light' | 'dark'>('light');
const name = ref('季度经营分析');
function open(value: 'light' | 'dark') { theme.value = value; visible.value = true; }
</script>

<template>
  <div class="glass-demo-actions">
    <ZtButton status="primary" @click="open('light')">浅色玻璃抽屉</ZtButton>
    <ZtButton @click="open('dark')">深色玻璃抽屉</ZtButton>
  </div>
  <ZtConfigProvider :theme="theme" :border-radius="11">
    <ZtDrawer v-model="visible" title="液态玻璃抽屉" :width="440" show-footer subtitle="清晰的内容与轻盈的透光层" @confirm="visible = false">
      <div class="glass-demo-content">
        <p>柔和的白光渐变、边缘高光与背景透光，让窗口拥有玻璃的厚度；正文始终清晰可读。</p>
        <label>报表名称<ZtInput v-model="name" aria-label="报表名称" /></label>
        <p class="glass-demo-hint">沿用现有滑入、滑出动画，底部操作区与正文分层呈现。</p>
      </div>
    </ZtDrawer>
  </ZtConfigProvider>
</template>

<style scoped>
.glass-demo-actions { display: flex; flex-wrap: wrap; gap: 10px; }
.glass-demo-content { display: grid; gap: 18px; }
.glass-demo-content p { margin: 0; }
.glass-demo-content label { display: grid; gap: 8px; }
.glass-demo-hint { color: var(--glass-muted); font-size: 12px; }
</style>
