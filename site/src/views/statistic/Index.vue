<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Advanced from './Advanced.vue';
import AdvancedCode from './Advanced.vue?raw';
</script>
<template>
  <div class="doc-section">
    <h1>Statistic 统计数值</h1>
    <p>精度、分组和前后缀可定制。NaN、Infinity 或缺失数据明确显示后备文字。</p>
    <h2>基础用法</h2>
    <DemoBlock
      :code="BasicCode"
      desc="精度、分组和前后缀可定制。NaN、Infinity 或缺失数据明确显示后备文字。"
      ><Basic
    /></DemoBlock>
    <h2>进阶与边界</h2>
    <DemoBlock :code="AdvancedCode" desc="完整的交互、配置和边界示例。"
      ><Advanced
    /></DemoBlock>
  </div>
</template>
