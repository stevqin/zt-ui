<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Example01 from './Example01.vue';
import Example01Code from './Example01.vue?raw';
import Example02 from './Example02.vue';
import Example02Code from './Example02.vue?raw';
import Layouts from './Layouts.vue';
import LayoutsCode from './Layouts.vue?raw';
import Island from './Island.vue';
import IslandCode from './Island.vue?raw';
import Guard from './Guard.vue';
import GuardCode from './Guard.vue?raw';
</script>

<template>
  <div class="component-examples">
    <h3>基础与禁用</h3>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h3>卡片与可编辑</h3>
    <DemoBlock :code="Example02Code"><Example02 /></DemoBlock>
    <h3>液态玻璃岛</h3>
    <DemoBlock :code="IslandCode" desc="type=island；五种 size 同步调整高度、间距和关闭按钮，六种 status 调整选中底色、文字与焦点。"><Island /></DemoBlock>
    <h3>四向布局</h3>
    <DemoBlock :code="LayoutsCode" desc=""><Layouts /></DemoBlock>

    <h3>异步切换守卫</h3>
    <DemoBlock :code="GuardCode" desc=""><Guard /></DemoBlock>
  </div>
</template>
