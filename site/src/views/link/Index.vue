<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Example01 from './Example01.vue';
import Example01Code from './Example01.vue?raw';
import Example02 from './Example02.vue';
import Example02Code from './Example02.vue?raw';
import Example03 from './Example03.vue';
import Example03Code from './Example03.vue?raw';
import Custom from './Custom.vue';
import CustomCode from './Custom.vue?raw';
</script>

<template>
  <div class="component-examples">
    <h3>基础用法</h3>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h3>状态颜色</h3>
    <DemoBlock :code="Example02Code"><Example02 /></DemoBlock>
    <h3>尺寸与图标</h3>
    <DemoBlock :code="Example03Code"><Example03 /></DemoBlock>
    <h3>插槽、下划线与下载</h3>
    <DemoBlock :code="CustomCode" desc=""><Custom /></DemoBlock>
  </div>
</template>

<style scoped>
.link-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
</style>
