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
    <DemoBlock :code="BasicCode" desc="基础交互与受控数据"><Basic /></DemoBlock>
    <h3>进阶用法</h3>
    <DemoBlock :code="AdvancedCode" desc="主题、插槽与边界场景"
      ><Advanced
    /></DemoBlock>
  </div>
</template>
