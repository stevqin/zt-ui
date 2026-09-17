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
    <h1>Breadcrumb 面包屑</h1>
    <p>显示当前页面在信息架构中的位置，最后一项自动标记为当前页。</p>
    <h2>基础用法</h2>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h2>自定义分隔</h2>
    <DemoBlock :code="Example02Code"><Example02 /></DemoBlock>
    <h2>分隔插槽、禁用与尺寸</h2>
    <DemoBlock :code="StatesCode" desc=""><States /></DemoBlock>
  </div>
</template>
