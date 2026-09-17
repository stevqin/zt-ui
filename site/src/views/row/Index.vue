<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Advanced from './Advanced.vue';
import AdvancedCode from './Advanced.vue?raw';
</script>
<template>
  <div class="doc-section">
    <h1>Row 栅格行</h1>
    <p>基于 24 列的弹性布局，gutter 为水平或 [水平, 垂直] 像素间距。</p>
    <h2>基础用法</h2>
    <DemoBlock
      :code="BasicCode"
      desc="基于 24 列的弹性布局，gutter 为水平或 [水平, 垂直] 像素间距。"
      ><Basic
    /></DemoBlock>
    <h2>进阶与边界</h2>
    <DemoBlock :code="AdvancedCode" desc="完整的交互、配置和边界示例。"
      ><Advanced
    /></DemoBlock>
  </div>
</template>
