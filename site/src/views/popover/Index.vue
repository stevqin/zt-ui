<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Example01 from './Example01.vue';
import Example01Code from './Example01.vue?raw';
import Example02 from './Example02.vue';
import Example02Code from './Example02.vue?raw';
import Example03 from './Example03.vue';
import Example03Code from './Example03.vue?raw';
import Placement from './Placement.vue';
import PlacementCode from './Placement.vue?raw';
</script>

<template>
  <div class="doc-section">
    <h1>Popover 弹出框</h1>
    <p>在触发元素附近展示补充信息或轻量操作，自动翻转并限制在可视区域内。</p>
    <h2>基础用法</h2>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h2>触发方式</h2>
    <DemoBlock :code="Example02Code"><Example02 /></DemoBlock>
    <h2>手动控制</h2>
    <DemoBlock :code="Example03Code"><Example03 /></DemoBlock>
    <h2>方位、箭头与禁用</h2>
    <DemoBlock :code="PlacementCode" desc=""><Placement /></DemoBlock>
  </div>
</template>

<style scoped>
.popover-row {
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
}
</style>
