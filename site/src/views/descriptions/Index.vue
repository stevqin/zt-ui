<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Example01 from './Example01.vue';
import Example01Code from './Example01.vue?raw';
import Directions from './Directions.vue';
import DirectionsCode from './Directions.vue?raw';
</script>

<template>
  <div class="doc-section">
    <h1>Descriptions 描述列表</h1>
    <p>按标签和值展示结构化详情，窄屏时自动切换为单列。</p>
    <h2>带边框的详情</h2>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h2>布局、列数与标签插槽</h2>
    <DemoBlock :code="DirectionsCode" desc=""><Directions /></DemoBlock>
  </div>
</template>
