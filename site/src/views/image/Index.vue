<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Example01 from './Example01.vue';
import Example01Code from './Example01.vue?raw';
import Example02 from './Example02.vue';
import Example02Code from './Example02.vue?raw';
import Viewer from './Viewer.vue';
import ViewerCode from './Viewer.vue?raw';
import Lazy from './Lazy.vue';
import LazyCode from './Lazy.vue?raw';
</script>

<template>
  <div class="doc-section">
    <h1>Image 图片</h1>
    <p>提供一致的适应方式、加载后备和具备键盘操作的全屏预览。</p>
    <h2>适应与预览</h2>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h2>错误后备</h2>
    <DemoBlock :code="Example02Code"><Example02 /></DemoBlock>
    <h2>独立预览器与缩放限制</h2>
    <DemoBlock :code="ViewerCode" desc=""><Viewer /></DemoBlock>

    <h2>懒加载与加载反馈</h2>
    <DemoBlock :code="LazyCode" desc=""><Lazy /></DemoBlock>
  </div>
</template>

<style scoped>
.image-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.demo-image {
  width: 220px;
  height: 140px;
}
</style>
