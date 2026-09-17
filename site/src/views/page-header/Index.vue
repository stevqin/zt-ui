<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Advanced from './Advanced.vue';
import AdvancedCode from './Advanced.vue?raw';
</script>
<template>
  <div class="doc-section">
    <h1>PageHeader 页头</h1>
    <p>返回事件、面包屑、标题说明与附加操作；窄屏自动换行。</p>
    <h2>基础用法</h2>
    <DemoBlock
      :code="BasicCode"
      desc="返回事件、面包屑、标题说明与附加操作；窄屏自动换行。"
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
