<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { ZtButton } from '@ztechjs/zt-ui';
import { ZtLoading as ZtFullscreenLoading } from '@ztechjs/zt-alert';
import type { LoadingInstance } from '@ztechjs/zt-alert';
import '@ztechjs/zt-alert/style.css';
const busy = ref(false);
const result = ref('等待任务');
let loading: LoadingInstance | undefined;
let alive = true;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
async function open(mode: 'stages' | 'icon' | 'reuse' | 'dark') {
  if (busy.value) return;
  busy.value = true;
  result.value = '任务执行中…';
  try {
    const icon = document.createElement('span');
    icon.textContent = '✦';
    icon.style.cssText = 'font-size:44px;color:#245edb';
    loading = ZtFullscreenLoading.open(
      mode === 'stages'
        ? '正在读取数据…'
        : {
            text: '正在处理全屏任务…',
            ...(mode === 'icon' ? { icon } : {}),
            ...(mode === 'dark' ? { maskColor: 'rgba(10, 18, 32, 0.92)' } : {}),
          },
    );
    await wait(700);
    if (!alive) return;
    if (mode === 'reuse') {
      const reused = ZtFullscreenLoading.open('再次 open：更新同一个实例');
      result.value = `两次 open 返回同一实例：${reused === loading}`;
    } else
      loading.update({
        text: '正在生成报表…',
        ...(mode === 'icon' ? { icon: null } : {}),
      });
    await wait(900);
    if (!alive) return;
    if (mode === 'dark')
      loading.update({
        maskColor: 'rgba(255, 255, 255, 0.9)',
        text: '切换浅色遮罩，文字自动适配对比度',
      });
    await wait(600);
  } finally {
    await loading?.close();
    if (alive) {
      busy.value = false;
      result.value =
        mode === 'reuse'
          ? `${result.value}；任务完成`
          : '任务完成，遮罩已完全关闭';
    }
  }
}
onBeforeUnmount(() => {
  alive = false;
  void loading?.close();
});
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row">
      <ZtButton :disabled="busy" @click="open('stages')">分阶段加载</ZtButton>
      <ZtButton :disabled="busy" @click="open('icon')"
        >自定义图标与恢复圆环</ZtButton
      >
      <ZtButton :disabled="busy" @click="open('dark')"
        >深浅遮罩与文字对比</ZtButton
      >
      <ZtButton :disabled="busy" @click="open('reuse')">复用加载实例</ZtButton>
    </div>
    <p class="result" role="status">{{ result }}</p>
    <p>
      每次演示约 2.2 秒后自动调用 close()。全屏 Loading
      锁定滚动与焦点，Esc、遮罩均不会关闭；务必在 finally 中关闭。
    </p>
    <p>
      icon 可传图片 URL 或 DOM Element，DOM 图标会复制；icon: null
      恢复默认圆环。可用 await loading.closed 等待退场，也可用 await
      ZtFullscreenLoading.close() 关闭当前全局实例。
    </p>
  </div>
</template>

<style scoped>
.demo-stack {
  display: grid;
  gap: 14px;
}
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
p {
  margin: 0;
  line-height: 1.7;
}
.result {
  padding: 10px 14px;
  border: 1px solid var(--zt-border, #dce2ed);
  border-radius: 8px;
  overflow-wrap: anywhere;
}
</style>
