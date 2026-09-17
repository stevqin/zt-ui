<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Example01 from './Example01.vue';
import Example01Code from './Example01.vue?raw';
import Example02 from './Example02.vue';
import Example02Code from './Example02.vue?raw';
import Layouts from './Layouts.vue';
import LayoutsCode from './Layouts.vue?raw';
import Guard from './Guard.vue';
import GuardCode from './Guard.vue?raw';
</script>

<template>
  <div class="doc-section">
    <h1>Tabs 标签页</h1>
    <p>在同一层级切换相关内容，支持键盘导航、异步切换守卫、增删和四向布局。</p>
    <h2>基础与禁用</h2>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h2>卡片与可编辑</h2>
    <DemoBlock :code="Example02Code"><Example02 /></DemoBlock>
    <h2>四向布局与三种外观</h2>
    <DemoBlock :code="LayoutsCode" desc=""><Layouts /></DemoBlock>

    <h2>异步切换守卫</h2>
    <DemoBlock :code="GuardCode" desc=""><Guard /></DemoBlock>
  </div>
</template>
