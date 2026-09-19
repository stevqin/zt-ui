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
import Example07 from './Example07.vue';
import Example07Code from './Example07.vue?raw';
import Methods from './Methods.vue';
import MethodsCode from './Methods.vue?raw';
</script>

<template>
  <div class="component-examples">
    <h3>基础用法</h3>
    <DemoBlock :code="Example01Code" desc="空字符串和 null 显示占位提示。面板底部显示当前草稿与类型适配的快捷选项；日期选择完成后立即提交。shortcuts 可传入自定义项，传空数组可隐藏。"
      ><Example01
    /></DemoBlock>
    <h3>范围选择</h3>
    <DemoBlock
      :code="Example02Code"
      desc="设置 range 后，rangePanelMode 可选择 single 单面板或 double 双面板（默认）；单面板可通过月份导航跨月选择。依次选择开始和结束日期，反向选择会自动排序。"
      ><Example02
    /></DemoBlock>
    <h3>年份、月份与范围</h3>
    <DemoBlock :code="Example07Code" desc="type 支持 year、month、yearrange、monthrange，值分别为 YYYY、YYYY-MM 或两项数组；也可通过 range 开启范围。单击提交单值，范围选满两个端点后提交并自动排序。disabledDate 在年份/月模式下接收该周期第一天的本地 Date。clearable 默认 false，开启后悬停或聚焦显示清空按钮，触屏保持可用。"><Example07 /></DemoBlock>
    <h3>禁用日期、禁用与只读</h3>
    <DemoBlock
      :code="Example03Code"
      desc="此示例禁用周末。disabledDate 限制可选择的端点，范围中间可以包含禁用日期。"
      ><Example03
    /></DemoBlock>
    <h3>五档尺寸</h3>
    <DemoBlock :code="Example04Code"><Example04 /></DemoBlock>
    <h3>主题颜色</h3>
    <DemoBlock
      :code="Example05Code"
      desc="status 统一控制焦点边框、选中日期、范围底色和确认按钮，默认 primary。"
      ><Example05
    /></DemoBlock>
    <h3>节假日标识</h3>
    <DemoBlock
      :code="Example06Code"
      desc="holidays 数组中 key 为 YYYY-MM-DD，value 为节日名；type 可设 holiday 或 workday，分别显示“休”“班”角标。长名称悬停查看；标识不改变可选状态，也不会自动禁用周末。"
      ><Example06
    /></DemoBlock>

    <h3>事件反馈与实例方法</h3>
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
