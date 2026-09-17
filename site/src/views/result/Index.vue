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
  <div class="doc-section">
    <h1>Result 结果</h1>
    <p>对完整任务给出明确结果和下一步操作。</p>
    <h2>成功结果</h2>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h2>异常状态</h2>
    <DemoBlock :code="Example02Code"><Example02 /></DemoBlock>
    <h2>自定义图标与内容插槽</h2>
    <DemoBlock :code="SlotsCode" desc=""><Slots /></DemoBlock>
  </div>
</template>
