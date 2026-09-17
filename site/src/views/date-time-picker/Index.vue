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
import Example06 from './Example06.vue';
import Example06Code from './Example06.vue?raw';
import Methods from './Methods.vue';
import MethodsCode from './Methods.vue?raw';
</script>

<template>
  <div class="doc-section">
    <h1>DateTimePicker 日期时间选择器</h1>
    <p>
      使用本地日历值 YYYY-MM-DD
      HH:mm:ss，不进行时区转换。支持单值和范围选择、清空、禁用日期及表单校验。
    </p>
    <h2>基础用法</h2>
    <DemoBlock
      :code="Example01Code"
      desc="空字符串和 null 显示占位提示。选择日期和时间后点击确定提交；时间精确到秒。同一天范围的结束时间不能早于开始时间。"
      ><Example01
    /></DemoBlock>
    <h2>范围选择</h2>
    <DemoBlock
      :code="Example02Code"
      desc="设置 range，使用左右双面板展示连续两个月，切换年月时联动；小屏下上下排列。依次选择开始和结束日期；反向选择会自动按日期排序。未完成的选择不会触发 change。"
      ><Example02
    /></DemoBlock>
    <h2>禁用日期、禁用与只读</h2>
    <DemoBlock
      :code="Example03Code"
      desc="此示例禁用周末。disabledDate 限制可选择的端点，范围中间可以包含禁用日期。"
      ><Example03
    /></DemoBlock>
    <h2>五档尺寸</h2>
    <DemoBlock :code="Example04Code"><Example04 /></DemoBlock>
    <h2>主题颜色</h2>
    <DemoBlock
      :code="Example05Code"
      desc="status 统一控制焦点边框、选中日期、范围底色和确认按钮，默认 primary。"
      ><Example05
    /></DemoBlock>
    <h2>节假日标识</h2>
    <DemoBlock
      :code="Example06Code"
      desc="holidays 数组中 key 为 YYYY-MM-DD，value 为节日名；长名称悬停查看。支持单值和范围，标识不改变可选状态，也不会自动禁用周末。"
      ><Example06
    /></DemoBlock>

    <h2>事件反馈与实例方法</h2>
    <DemoBlock :code="MethodsCode" desc=""><Methods /></DemoBlock>
  </div>
</template>

<style scoped>
.date-demo-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  width: 100%;
}
.date-demo-stack > span {
  color: #737d8b;
  font-size: 12px;
  overflow-wrap: anywhere;
}
</style>
