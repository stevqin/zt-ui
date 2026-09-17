<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Advanced from './Advanced.vue';
import AdvancedCode from './Advanced.vue?raw';
</script>
<template>
  <div class="doc-section">
    <h1>Layout 布局</h1>
    <p>语义化容器按 Header / Footer 自动推导纵向，内部可继续横向嵌套。</p>
    <h2>基础用法</h2>
    <DemoBlock
      :code="BasicCode"
      desc="语义化容器按 Header / Footer 自动推导纵向，内部可继续横向嵌套。"
      ><Basic
    /></DemoBlock>
    <h2>进阶与边界</h2>
    <DemoBlock :code="AdvancedCode" desc="完整的交互、配置和边界示例。"
      ><Advanced
    /></DemoBlock>
  </div>
</template>
