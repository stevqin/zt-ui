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
import Count from './Count.vue';
import CountCode from './Count.vue?raw';
</script>

<template>
  <div class="component-examples">
    <h3>基础用法</h3>
    <DemoBlock :code="Example01Code" desc="当页数超过 pager-count 时，中间页码会自动折叠。"
      ><Example01
    /></DemoBlock>

    <h3>带背景色</h3>
    <DemoBlock :code="Example02Code" desc="background 为按钮增加轻量背景和边框。"
      ><Example02
    /></DemoBlock>

    <h3>主题颜色</h3>
    <DemoBlock
      :code="Example03Code"
      desc="status 与 Button 的六种主题一致，默认 primary。当前页悬停保留主题高亮。"
      ><Example03
    /></DemoBlock>
    <h3>完整功能</h3>
    <DemoBlock :code="Example04Code" desc="通过 layout 自由组合总数、每页条数、页码和跳转输入框。"
      ><Example04
    /></DemoBlock>

    <h3>尺寸与禁用</h3>
    <DemoBlock
      :code="Example05Code"
      desc="size 支持五档尺寸；disabled 可以和任意尺寸组合并禁止全部交互。"
      ><Example05
    /></DemoBlock>

    <h3>左右对齐与插槽</h3>
    <DemoBlock :code="Example06Code" desc="layout 中的 -> 将后续模块推到右侧，slot 插入自定义内容。"
      ><Example06
    /></DemoBlock>

    <h3>单页隐藏</h3>
    <DemoBlock :code="Example07Code" desc="hide-on-single-page 在只有一页时隐藏分页栏。"
      ><Example07
    /></DemoBlock>

    <h3>指定页数、按钮文字与事件</h3>
    <DemoBlock :code="CountCode" desc=""><Count /></DemoBlock>
  </div>
</template>

<style scoped>
.pagination-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  width: 100%;
}
.pagination-note {
  color: #626b78;
  font-size: 13px;
  white-space: nowrap;
}
</style>
