<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Example01 from './Example01.vue';
import Example01Code from './Example01.vue?raw';
import Example02 from './Example02.vue';
import Example02Code from './Example02.vue?raw';
import Example03 from './Example03.vue';
import Example03Code from './Example03.vue?raw';
import Example04 from './Example04.vue';
import Example04Code from './Example04.vue?raw';
import Resize from './Resize.vue';
import ResizeCode from './Resize.vue?raw';
</script>

<template>
  <div class="doc-section">
    <h1>Scrollbar 滚动条</h1>
    <p>保留浏览器原生滚动、触摸惯性和键盘操作，同时提供跨平台一致的轨道与滑块样式。</p>
    <h2>固定高度</h2>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h2>横向滚动与常显轨道</h2>
    <DemoBlock :code="Example02Code"><Example02 /></DemoBlock>
    <h2>原生模式</h2>
    <DemoBlock :code="Example03Code"><Example03 /></DemoBlock>
    <h2>滚动事件与实例方法</h2>
    <DemoBlock :code="Example04Code"><Example04 /></DemoBlock>
    <h2>动态内容与完整滚动方法</h2>
    <DemoBlock :code="ResizeCode" desc="noresize 关闭自动尺寸监听，此处增加内容后显式调用 update。"
      ><Resize
    /></DemoBlock>
  </div>
</template>

<style scoped>
.scroll-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid var(--zt-border);
}
.scroll-row span {
  color: var(--zt-text-muted);
  font-size: 12px;
}
.wide-content {
  display: flex;
  gap: 12px;
  width: max-content;
  padding: 8px;
}
.wide-content article {
  display: grid;
  place-items: center;
  width: 150px;
  height: 100px;
  border: 1px solid var(--zt-border);
  border-radius: var(--zt-radius);
  background: var(--zt-surface-soft);
}
.method-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}
</style>
