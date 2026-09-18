<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Example01 from './Example01.vue';
import Example01Code from './Example01.vue?raw';
import Example02 from './Example02.vue';
import Example02Code from './Example02.vue?raw';
import States from './States.vue';
import StatesCode from './States.vue?raw';
</script>

<template>
  <div class="component-examples">
    <h3>基础用法</h3>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h3>自定义分隔</h3>
    <DemoBlock :code="Example02Code"><Example02 /></DemoBlock>
    <h3>分隔插槽、禁用与尺寸</h3>
    <DemoBlock :code="StatesCode" desc=""><States /></DemoBlock>
  </div>
</template>
