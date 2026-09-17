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
</script>

<template>
  <div class="doc-section">
    <h1>Text 文本</h1>
    <p>统一正文的语义标签、字号、状态色、字重和溢出处理，不改变父容器布局。</p>
    <h2>状态颜色</h2>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h2>尺寸与字重</h2>
    <DemoBlock :code="Example02Code"><Example02 /></DemoBlock>
    <h2>文本省略</h2>
    <DemoBlock :code="Example03Code"><Example03 /></DemoBlock>
    <h2>语义标签</h2>
    <DemoBlock :code="Example04Code"><Example04 /></DemoBlock>
  </div>
</template>

<style scoped>
.text-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
.text-limit {
  display: grid;
  gap: 18px;
  width: min(360px, 100%);
}
</style>
