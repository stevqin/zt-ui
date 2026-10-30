<script setup lang="ts">
import { ref } from 'vue';
import { ZtButton, ZtConfigProvider, ZtInput, ZtModal, ZtSelect } from '@ztechjs/zt-ui';
import type { ZtFocusRing } from '@ztechjs/zt-ui';
const mode = ref<ZtFocusRing>('none');
const value = ref('');
const selected = ref<string | null>(null);
const open = ref(false);
const modes = [
  { value: 'none', label: '关闭（none）' },
  { value: 'keyboard', label: '仅键盘（keyboard）' },
  { value: 'all', label: '所有聚焦（all）' },
] as const;
const options = [
  { value: 'draft', label: '草稿' },
  { value: 'published', label: '已发布' },
];
</script>
<template>
  <div class="focus-demo">
    <div class="focus-demo__modes" aria-label="焦点环模式">
      <ZtButton v-for="item in modes" :key="item.value" :aria-pressed="mode === item.value" @click="mode = item.value">{{ item.label }}</ZtButton>
    </div>
    <p>当前模式：{{ mode }}。先点击输入框，再使用 Tab 切换焦点；鼠标操作会结束键盘模式。</p>
    <ZtConfigProvider :focus-ring="mode" class="focus-demo__scope">
      <ZtInput v-model="value" aria-label="焦点环示例输入" placeholder="输入内容并按 Tab" />
      <ZtButton>示例按钮</ZtButton>
      <ZtSelect v-model="selected" :options="options" aria-label="焦点环示例选择" placeholder="查看下拉选项" />
      <ZtButton @click="open = true">打开焦点环弹窗</ZtButton>
      <ZtConfigProvider focus-ring="none">
        <ZtButton>嵌套关闭</ZtButton>
      </ZtConfigProvider>
      <ZtModal v-model="open" title="浮层继承焦点环策略">
        <ZtInput v-model="value" aria-label="弹窗内输入" />
        <ZtButton @click="open = false">关闭焦点环弹窗</ZtButton>
      </ZtModal>
    </ZtConfigProvider>
  </div>
</template>
<style scoped>
.focus-demo__modes { display: flex; flex-wrap: wrap; gap: 8px; }
.focus-demo__scope { display: grid; gap: 16px; max-width: 420px; padding: 12px; }
</style>
