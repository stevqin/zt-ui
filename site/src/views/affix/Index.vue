<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Advanced from './Advanced.vue';
import AdvancedCode from './Advanced.vue?raw';
</script>
<template>
  <div class="doc-section">
    <h1>Affix 固钉</h1>
    <p>在指定滚动区域顶部或底部固定内容，并保留占位避免布局跳动。</p>
    <h2>基础用法</h2>
    <DemoBlock
      :code="BasicCode"
      desc="在指定滚动区域顶部或底部固定内容，并保留占位避免布局跳动。"
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
