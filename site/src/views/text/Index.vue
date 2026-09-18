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
  <div class="component-examples">
    <h3>状态颜色</h3>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h3>尺寸与字重</h3>
    <DemoBlock :code="Example02Code"><Example02 /></DemoBlock>
    <h3>文本省略</h3>
    <DemoBlock :code="Example03Code"><Example03 /></DemoBlock>
    <h3>语义标签</h3>
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
