<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Hover from './Hover.vue';
import HoverCode from './Hover.vue?raw';
</script>
<template>
  <div class="component-examples">
    <h3>分组、分隔、禁用与命令反馈</h3>
    <DemoBlock :code="BasicCode"><Basic /></DemoBlock>
    <h3>悬停与保持菜单展开</h3>
    <DemoBlock :code="HoverCode"><Hover /></DemoBlock>
  </div>
</template>
