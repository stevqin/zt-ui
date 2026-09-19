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
  <div class="component-examples">
    <h3>适应与预览</h3>
    <DemoBlock
      :code="Example01Code"
      desc="默认点击图片会使用 src 打开预览；传入 preview-src-list 可覆盖预览列表，设置 show-preview=false 可关闭点击预览。"
    ><Example01 /></DemoBlock>
    <h3>错误后备</h3>
    <DemoBlock :code="Example02Code"><Example02 /></DemoBlock>
    <h3>独立预览器与缩放限制</h3>
    <DemoBlock :code="ViewerCode" desc=""><Viewer /></DemoBlock>

    <h3>懒加载与加载反馈</h3>
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
