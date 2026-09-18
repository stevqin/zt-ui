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
    <h3>单选、多选与父子联动</h3>
    <DemoBlock :code="BasicCode" desc="单选、多选与父子联动"
      ><Basic
    /></DemoBlock>
    <h3>五档尺寸、主题与异步数据</h3>
    <DemoBlock :code="AdvancedCode" desc="五档尺寸、主题与异步数据"
      ><Advanced
    /></DemoBlock>
    <h3>六种语义状态</h3>
    <DemoBlock :code="StatusCode" desc="勾选、选中与焦点颜色随状态和主题变化"
      ><Status
    /></DemoBlock>
  </div>
</template>
