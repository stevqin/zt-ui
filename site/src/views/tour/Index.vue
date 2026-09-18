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
      desc="通过已有浮层管理器处理焦点和 Escape。目标缺失时居中显示，步骤与开关完全受控。"
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
