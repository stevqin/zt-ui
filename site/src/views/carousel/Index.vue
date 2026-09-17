<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Advanced from './Advanced.vue';
import AdvancedCode from './Advanced.vue?raw';
</script>
<template>
  <div class="doc-section">
    <h1>Carousel 轮播</h1>
    <p>
      受控索引、箭头指示器、键盘与触摸；自动轮播在悬停、聚焦、隐藏页面或减少动画时暂停。
    </p>
    <h2>基础用法</h2>
    <DemoBlock
      :code="BasicCode"
      desc="受控索引、箭头指示器、键盘与触摸；自动轮播在悬停、聚焦、隐藏页面或减少动画时暂停。"
      ><Basic
    /></DemoBlock>
    <h2>配置、交互与边界</h2>
    <DemoBlock
      :code="AdvancedCode"
      desc="完整可运行的进阶示例，包含所有状态、方法和样式。"
      ><Advanced
    /></DemoBlock>
  </div>
</template>
