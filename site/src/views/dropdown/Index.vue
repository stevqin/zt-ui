<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Hover from './Hover.vue';
import HoverCode from './Hover.vue?raw';
</script>
<template>
  <div class="doc-section">
    <h1>Dropdown 下拉菜单</h1>
    <p>紧凑操作列表，支持鼠标、触屏与方向键导航；选择后默认关闭。</p>
    <h2>分组、分隔、禁用与命令反馈</h2>
    <DemoBlock :code="BasicCode"><Basic /></DemoBlock>
    <h2>悬停与保持菜单展开</h2>
    <DemoBlock :code="HoverCode"><Hover /></DemoBlock>
  </div>
</template>
