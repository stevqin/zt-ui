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
      desc="标题、段落和语义修饰复用 Text 的主题与尺寸。复制结果通过事件和可访问状态反馈。"
      ><Basic
    /></DemoBlock>
    <h3>进阶与边界</h3>
    <DemoBlock :code="AdvancedCode" desc="完整的交互、配置和边界示例。"
      ><Advanced
    /></DemoBlock>
  </div>
</template>
