<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Advanced from './Advanced.vue';
import AdvancedCode from './Advanced.vue?raw';
</script>
<template>
  <div class="component-examples">
    <h3>基础用法</h3>
    <DemoBlock
      :code="BasicCode"
      desc="用于显示文字或图片的视觉提示，不提供防篡改或数据保护。容器变化后自动更新密度。"
      ><Basic
    /></DemoBlock>
    <h3>配置、交互与边界</h3>
    <DemoBlock
      :code="AdvancedCode"
      desc="完整可运行的进阶示例，包含所有状态、方法和样式。"
      ><Advanced
    /></DemoBlock>
  </div>
</template>
