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
import CustomText from './CustomText.vue';
import CustomTextCode from './CustomText.vue?raw';
</script>

<template>
  <div class="component-examples">
    <h3>可调进度</h3>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h3>状态颜色</h3>
    <DemoBlock :code="Example02Code"><Example02 /></DemoBlock>
    <h3>不确定进度</h3>
    <DemoBlock
      :code="Example03Code"
      desc="用于尚未获得总量的任务。此时不报告虚假的百分比，系统减少动画偏好会停用循环动画。"
      ><Example03
    /></DemoBlock>
    <h3>尺寸与格式化</h3>
    <DemoBlock :code="Example04Code"><Example04 /></DemoBlock>

    <h3>自定义内容与隐藏文字</h3>
    <DemoBlock :code="CustomTextCode" desc=""><CustomText /></DemoBlock>
  </div>
</template>

<style scoped>
.progress-examples {
  display: grid;
  gap: 22px;
}
</style>
