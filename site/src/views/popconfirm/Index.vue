<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import PopupReadability from './Readability.vue';
import PopupReadabilityCode from './Readability.vue?raw';
import Example01 from './Example01.vue';
import Example01Code from './Example01.vue?raw';
import Example02 from './Example02.vue';
import Example02Code from './Example02.vue?raw';
import Controlled from './Controlled.vue';
import ControlledCode from './Controlled.vue?raw';
import Sizes from './Sizes.vue';
import SizesCode from './Sizes.vue?raw';
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
    <h3>尺寸与全局继承</h3>
    <DemoBlock :code="SizesCode" desc="size 控制整体密度，未设置时继承 ConfigProvider；button-size 可单独覆盖操作按钮尺寸。"><Sizes /></DemoBlock>
    <h3>白底与密集内容</h3>
    <DemoBlock :code="PopupReadabilityCode" desc="在白色页面和订单文字上打开浮层，检查玻璃背景、箭头与文字的清晰度；弹出时轻缩放淡入，关闭时快速淡出。">
      <PopupReadability />
    </DemoBlock>
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
