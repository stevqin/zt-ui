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
import Feedback from './Feedback.vue';
import FeedbackCode from './Feedback.vue?raw';
</script>

<template>
  <div class="component-examples">
    <h3>基础用法</h3>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h3>范围选择</h3>
    <DemoBlock :code="Example02Code" desc="两个滑块不可交叉；点击轨道会调整较近的滑块。"
      ><Example02
    /></DemoBlock>
    <h3>小数步长</h3>
    <DemoBlock :code="Example03Code"><Example03 /></DemoBlock>
    <h3>主题、尺寸与禁用</h3>
    <DemoBlock :code="Example04Code"><Example04 /></DemoBlock>
    <h3>交互与表单</h3>
    <p>
      方向键按 step 调整，Home / End 跳到端点，PageUp / PageDown
      调整十个步长。范围模式下两个滑块独立进入 Tab 顺序。FormItem
      内继承尺寸、禁用和标签，提交数值时触发 change 校验。
    </p>
    <p>
      min / max 必须为有限数，max 不大于 min 时禁用；步长以 min 为基准，对外输出会修正浮点精度，max
      始终可达。showTooltip 可关闭浮动数值提示。
    </p>

    <h3>格式化提示与提交事件</h3>
    <DemoBlock :code="FeedbackCode" desc=""><Feedback /></DemoBlock>
  </div>
</template>
