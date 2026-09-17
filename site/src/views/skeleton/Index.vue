<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Advanced from './Advanced.vue';
import AdvancedCode from './Advanced.vue?raw';
</script>
<template>
  <div class="doc-section">
    <h1>Skeleton 骨架屏</h1>
    <p>等待数据时显示占位，支持行宽、自定义形状与减少动画偏好。</p>
    <h2>基础用法</h2>
    <DemoBlock
      :code="BasicCode"
      desc="等待数据时显示占位，支持行宽、自定义形状与减少动画偏好。"
      ><Basic
    /></DemoBlock>
    <h2>进阶与边界</h2>
    <DemoBlock :code="AdvancedCode" desc="完整的交互、配置和边界示例。"
      ><Advanced
    /></DemoBlock>
  </div>
</template>
