<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Advanced from './Advanced.vue';
import AdvancedCode from './Advanced.vue?raw';
</script>
<template>
  <div class="doc-section">
    <h1>Backtop 返回顶部</h1>
    <p>按指定容器的滚动距离显示按钮；支持插槽和减少动画偏好。</p>
    <h2>基础用法</h2>
    <DemoBlock
      :code="BasicCode"
      desc="按指定容器的滚动距离显示按钮；支持插槽和减少动画偏好。"
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
