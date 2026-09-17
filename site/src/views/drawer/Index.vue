<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Example01 from './Example01.vue';
import Example01Code from './Example01.vue?raw';
import Example02 from './Example02.vue';
import Example02Code from './Example02.vue?raw';
import Example03 from './Example03.vue';
import Example03Code from './Example03.vue?raw';
import CustomContent from './CustomContent.vue';
import CustomContentCode from './CustomContent.vue?raw';
</script>

<template>
  <div class="doc-section">
    <h1>Drawer 抽屉</h1>
    <p>从视口边缘滑入，用于承载筛选、详情和辅助操作。</p>
    <h2>基础用法</h2>
    <DemoBlock :code="Example01Code" desc="使用 v-model 控制右侧抽屉。"><Example01 /></DemoBlock>
    <h2>出现方向</h2>
    <DemoBlock :code="Example02Code" desc="placement 支持 left、right、top、bottom。"
      ><Example02
    /></DemoBlock>
    <h2>尺寸与底部操作</h2>
    <DemoBlock :code="Example03Code" desc="size 控制宽度或高度，并支持默认确认/取消区域。"
      ><Example03
    /></DemoBlock>

    <h2>插槽、销毁与关闭守卫</h2>
    <DemoBlock
      :code="CustomContentCode"
      desc="关闭按钮、遮罩和 Escape 经过守卫；业务直接更新 v-model 由调用方决定。"
      ><CustomContent
    /></DemoBlock>
  </div>
</template>

<style scoped>
.drawer-form {
  display: grid;
  gap: 16px;
}
.drawer-form label {
  display: grid;
  gap: 6px;
  color: #4b5563;
  font-size: 13px;
}
.drawer-form select {
  padding: 9px 11px;
  border: 1px solid #d1d5db;
  border-radius: 9px;
  background: #fff;
  font: inherit;
}
</style>
