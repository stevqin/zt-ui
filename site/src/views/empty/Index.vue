<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Advanced from './Advanced.vue';
import AdvancedCode from './Advanced.vue?raw';
</script>
<template>
  <div class="doc-section">
    <h1>Empty 空状态</h1>
    <p>默认插画和说明可独立替换，操作插槽可引导创建内容。</p>
    <h2>基础用法</h2>
    <DemoBlock
      :code="BasicCode"
      desc="默认插画和说明可独立替换，操作插槽可引导创建内容。"
      ><Basic
    /></DemoBlock>
    <h2>进阶与边界</h2>
    <DemoBlock :code="AdvancedCode" desc="完整的交互、配置和边界示例。"
      ><Advanced
    /></DemoBlock>
  </div>
</template>
