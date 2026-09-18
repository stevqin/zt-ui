<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Example01 from './Example01.vue';
import Example01Code from './Example01.vue?raw';
import Example02 from './Example02.vue';
import Example02Code from './Example02.vue?raw';
import Fallbacks from './Fallbacks.vue';
import FallbacksCode from './Fallbacks.vue?raw';
</script>

<template>
  <div class="component-examples">
    <h3>尺寸与形状</h3>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h3>状态与后备</h3>
    <DemoBlock :code="Example02Code"><Example02 /></DemoBlock>
    <h3>插槽、图标与图片适应</h3>
    <DemoBlock :code="FallbacksCode" desc=""><Fallbacks /></DemoBlock>
  </div>
</template>

<style scoped>
.avatar-row {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}
</style>
