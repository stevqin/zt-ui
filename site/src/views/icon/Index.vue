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
import Slot from './Slot.vue';
import SlotCode from './Slot.vue?raw';
</script>

<template>
  <div class="doc-section">
    <h1>Icon 图标</h1>
    <p>
      统一图标尺寸、颜色和无障碍语义。内置图标使用 currentColor，也可传入 Vue 组件或使用默认插槽。
    </p>
    <h2>内置图标</h2>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h2>独立尺寸</h2>
    <DemoBlock :code="Example02Code" desc="size 接受数值（px）或 CSS 长度，默认 1em，不绑定 ConfigProvider 的五档密度。百分比相对确定宽高的容器解析。"><Example02 /></DemoBlock>
    <h2>主题颜色</h2>
    <DemoBlock :code="Example03Code"><Example03 /></DemoBlock>
    <h2>旋转、自定义颜色与组件</h2>
    <DemoBlock :code="Example04Code"><Example04 /></DemoBlock>

    <h2>自定义 SVG 插槽与描边</h2>
    <DemoBlock :code="SlotCode" desc=""><Slot /></DemoBlock>
  </div>
</template>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
  gap: 10px;
}
.icon-grid > div {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px;
  border: 1px solid var(--zt-border);
  border-radius: var(--zt-radius);
  font-size: 12px;
}
.icon-row {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
}
.icon-row :deep(svg) {
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
