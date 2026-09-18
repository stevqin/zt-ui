<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Custom from './Custom.vue';
import CustomCode from './Custom.vue?raw';
</script>
<template>
  <div class="component-examples">
    <h3>语义颜色与关闭</h3>
    <DemoBlock :code="BasicCode"><Basic /></DemoBlock>
    <h3>标题、图标插槽与关闭反馈</h3>
    <DemoBlock :code="CustomCode"><Custom /></DemoBlock>
  </div>
</template>
