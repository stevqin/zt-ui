<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Example01 from './Example01.vue';
import Example01Code from './Example01.vue?raw';
import Example02 from './Example02.vue';
import Example02Code from './Example02.vue?raw';
import Example03 from './Example03.vue';
import Example03Code from './Example03.vue?raw';
import Example04 from './Example04.vue';
import Example04Code from './Example04.vue?raw';
import Example05 from './Example05.vue';
import Example05Code from './Example05.vue?raw';
import CustomContent from './CustomContent.vue';
import CustomContentCode from './CustomContent.vue?raw';
</script>

<template>
  <div class="component-examples">
    <h3>基础用法</h3>
    <DemoBlock :code="Example01Code" desc="使用 v-model 控制显示状态。"><Example01 /></DemoBlock>
    <h3>底部操作与加载</h3>
    <DemoBlock :code="Example02Code" desc="confirm 由使用方处理，保存完成后再关闭弹窗。"
      ><Example02
    /></DemoBlock>
    <h3>遮罩与关闭拦截</h3>
    <DemoBlock :code="Example03Code" desc="关闭按钮、遮罩和 Escape 都统一经过 beforeClose。"
      ><Example03
    /></DemoBlock>
    <h3>全屏与拖拽</h3>
    <DemoBlock :code="Example04Code" desc="拖动标题栏移动弹窗，使用 header 按钮切换全屏。"
      ><Example04
    /></DemoBlock>
    <h3>尺寸</h3>
    <DemoBlock
      :code="Example05Code"
      desc="size 提供五档密度，同时调整标题栏、正文、底部和内部控件；子控件显式 size 优先。"
      ><Example05
    /></DemoBlock>

    <h3>插槽、销毁与关闭守卫</h3>
    <DemoBlock
      :code="CustomContentCode"
      desc="关闭按钮、遮罩和 Escape 经过守卫；业务直接更新 v-model 由调用方决定。"
      ><CustomContent
    /></DemoBlock>
  </div>
</template>

<style scoped>
.overlay-demo-form {
  display: grid;
  gap: 14px;
}
.overlay-demo-form label {
  display: grid;
  gap: 6px;
  color: #4b5563;
  font-size: 13px;
}
.overlay-demo-form input {
  padding: 9px 11px;
  border: 1px solid #d1d5db;
  border-radius: 9px;
  font: inherit;
}
.demo-state {
  color: #64748b;
  font-size: 13px;
}
</style>
