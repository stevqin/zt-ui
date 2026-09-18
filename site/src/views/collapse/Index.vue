<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Example01 from './Example01.vue';
import Example01Code from './Example01.vue?raw';
import Example02 from './Example02.vue';
import Example02Code from './Example02.vue?raw';
import CustomTitle from './CustomTitle.vue';
import CustomTitleCode from './CustomTitle.vue?raw';
</script>

<template>
  <div class="component-examples">
    <h3>多面板</h3>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h3>手风琴</h3>
    <DemoBlock :code="Example02Code"><Example02 /></DemoBlock>
    <h3>自定义标题、禁用与懒渲染</h3>
    <DemoBlock :code="CustomTitleCode" desc=""><CustomTitle /></DemoBlock>
  </div>
</template>
