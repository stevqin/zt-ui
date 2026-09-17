<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Advanced from './Advanced.vue';
import AdvancedCode from './Advanced.vue?raw';
</script>
<template>
  <div class="doc-section">
    <h1>Splitter 分栏</h1>
    <p>
      使用受控百分比调整两栏。方向键调整，Shift 加速，Home/End 到边界，Enter
      收起恢复。
    </p>
    <h2>基础用法</h2>
    <DemoBlock
      :code="BasicCode"
      desc="使用受控百分比调整两栏。方向键调整，Shift 加速，Home/End 到边界，Enter 收起恢复。"
      ><Basic
    /></DemoBlock>
    <h2>进阶与边界</h2>
    <DemoBlock :code="AdvancedCode" desc="完整的交互、配置和边界示例。"
      ><Advanced
    /></DemoBlock>
  </div>
</template>
