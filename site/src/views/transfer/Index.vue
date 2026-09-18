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
  <div class="component-examples">
    <h3>受控移动、搜索与插槽</h3>
    <DemoBlock :code="BasicCode" desc="受控移动、搜索与插槽"
      ><Basic
    /></DemoBlock>
    <h3>尺寸、主题与自定义搜索</h3>
    <DemoBlock :code="AdvancedCode" desc="尺寸、主题与自定义搜索"
      ><Advanced
    /></DemoBlock>
    <h3>六种语义状态</h3>
    <DemoBlock :code="StatusCode" desc="勾选、选中与焦点颜色随状态和主题变化"
      ><Status
    /></DemoBlock>
  </div>
</template>
