<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Advanced from './Advanced.vue';
import AdvancedCode from './Advanced.vue?raw';
import Status from './Status.vue';
import StatusCode from './Status.vue?raw';
</script>
<template>
  <div class="doc-section">
    <h1>Cascader 级联选择</h1>
    <h2>完整路径与多选</h2>
    <DemoBlock :code="BasicCode" desc="完整路径与多选"><Basic /></DemoBlock>
    <h2>字段映射、主题与懒加载</h2>
    <DemoBlock :code="AdvancedCode" desc="字段映射、主题与懒加载"
      ><Advanced
    /></DemoBlock>
    <h2>六种语义状态</h2>
    <DemoBlock :code="StatusCode" desc="勾选、选中与焦点颜色随状态和主题变化"
      ><Status
    /></DemoBlock>
  </div>
</template>
