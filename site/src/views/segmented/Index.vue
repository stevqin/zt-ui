<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Example01 from './Example01.vue';
import Example01Code from './Example01.vue?raw';
import Example02 from './Example02.vue';
import Example02Code from './Example02.vue?raw';
import States from './States.vue';
import StatesCode from './States.vue?raw';
</script>

<template>
  <div class="doc-section">
    <h1>Segmented 分段控制器</h1>
    <p>用于少量互斥选项的即时切换，支持状态色、全宽和键盘操作。</p>
    <h2>对象选项</h2>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h2>全宽与主题</h2>
    <DemoBlock :code="Example02Code"><Example02 /></DemoBlock>
    <h2>尺寸、禁用与数值选项</h2>
    <DemoBlock :code="StatesCode" desc=""><States /></DemoBlock>
  </div>
</template>
