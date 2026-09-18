<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Example01 from './Example01.vue';
import Example01Code from './Example01.vue?raw';
import Example02 from './Example02.vue';
import Example02Code from './Example02.vue?raw';
import Slots from './Slots.vue';
import SlotsCode from './Slots.vue?raw';
</script>

<template>
  <div class="component-examples">
    <h3>成功结果</h3>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h3>异常状态</h3>
    <DemoBlock :code="Example02Code"><Example02 /></DemoBlock>
    <h3>自定义图标与内容插槽</h3>
    <DemoBlock :code="SlotsCode" desc=""><Slots /></DemoBlock>
  </div>
</template>
