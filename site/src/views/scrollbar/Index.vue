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
  <div class="component-examples">
    <h3>固定高度</h3>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h3>横向滚动与常显轨道</h3>
    <DemoBlock :code="Example02Code"><Example02 /></DemoBlock>
    <h3>原生模式</h3>
    <DemoBlock :code="Example03Code"><Example03 /></DemoBlock>
    <h3>滚动事件与实例方法</h3>
    <DemoBlock :code="Example04Code"><Example04 /></DemoBlock>
    <h3>动态内容与完整滚动方法</h3>
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
