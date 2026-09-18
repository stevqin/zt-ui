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
      desc="等待数据时显示占位，支持行宽、自定义形状与减少动画偏好。"
      ><Basic
    /></DemoBlock>
    <h3>进阶与边界</h3>
    <DemoBlock :code="AdvancedCode" desc="完整的交互、配置和边界示例。"
      ><Advanced
    /></DemoBlock>
  </div>
</template>
