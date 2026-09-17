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
  <div class="doc-section">
    <h1>Progress 进度条</h1>
    <p>展示任务完成比例，支持状态颜色、尺寸和不确定进度。颜色搭配文字，让用户理解任务状态。</p>
    <h2>可调进度</h2>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h2>状态颜色</h2>
    <DemoBlock :code="Example02Code"><Example02 /></DemoBlock>
    <h2>不确定进度</h2>
    <DemoBlock
      :code="Example03Code"
      desc="用于尚未获得总量的任务。此时不报告虚假的百分比，系统减少动画偏好会停用循环动画。"
      ><Example03
    /></DemoBlock>
    <h2>尺寸与格式化</h2>
    <DemoBlock :code="Example04Code"><Example04 /></DemoBlock>

    <h2>自定义内容与隐藏文字</h2>
    <DemoBlock :code="CustomTextCode" desc=""><CustomText /></DemoBlock>
  </div>
</template>

<style scoped>
.progress-examples {
  display: grid;
  gap: 22px;
}
</style>
