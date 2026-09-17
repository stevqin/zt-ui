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
  <div class="doc-section">
    <h1>Popconfirm 气泡确认框</h1>
    <p>在当前操作附近完成二次确认，支持状态图标、说明和异步确认。</p>
    <h2>危险操作</h2>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h2>异步确认</h2>
    <DemoBlock
      :code="Example02Code"
      desc="Promise 完成前锁定按钮并显示进度；返回 false 或拒绝时保持打开。"
      ><Example02
    /></DemoBlock>
    <h2>受控确认与保留弹层</h2>
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
