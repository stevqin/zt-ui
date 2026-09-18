<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Example01 from './Example01.vue';
import Example01Code from './Example01.vue?raw';
import Example02 from './Example02.vue';
import Example02Code from './Example02.vue?raw';
import Controlled from './Controlled.vue';
import ControlledCode from './Controlled.vue?raw';
</script>

<template>
  <div class="component-examples">
    <h3>危险操作</h3>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h3>异步确认</h3>
    <DemoBlock
      :code="Example02Code"
      desc="Promise 完成前锁定按钮并显示进度；返回 false 或拒绝时保持打开。"
      ><Example02
    /></DemoBlock>
    <h3>受控确认与保留弹层</h3>
    <DemoBlock :code="ControlledCode" desc=""><Controlled /></DemoBlock>
  </div>
</template>

<style scoped>
.confirm-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
