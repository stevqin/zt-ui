<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Example01 from './Example01.vue';
import Example01Code from './Example01.vue?raw';
import Example02 from './Example02.vue';
import Example02Code from './Example02.vue?raw';
import CustomTitle from './CustomTitle.vue';
import CustomTitleCode from './CustomTitle.vue?raw';
</script>

<template>
  <div class="doc-section">
    <h1>Collapse 折叠面板</h1>
    <p>收纳可分组内容，支持多开、手风琴、禁用和懒渲染。</p>
    <h2>多面板</h2>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h2>手风琴</h2>
    <DemoBlock :code="Example02Code"><Example02 /></DemoBlock>
    <h2>自定义标题、禁用与懒渲染</h2>
    <DemoBlock :code="CustomTitleCode" desc=""><CustomTitle /></DemoBlock>
  </div>
</template>
