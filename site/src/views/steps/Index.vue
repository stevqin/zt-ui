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
import Slots from './Slots.vue';
import SlotsCode from './Slots.vue?raw';
</script>

<template>
  <div class="component-examples">
    <h3>基础用法</h3>
    <DemoBlock
      :code="Example01Code"
      desc="active 表示当前步骤；finish-status 可以设置已完成步骤的状态。"
      ><Example01
    /></DemoBlock>

    <h3>居中布局</h3>
    <DemoBlock :code="Example02Code" desc="align-center 让标题、描述和步骤图标居中对齐。"
      ><Example02
    /></DemoBlock>

    <h3>步骤状态与固定间距</h3>
    <DemoBlock
      :code="Example03Code"
      desc="可分别设置完成、进行中或单个步骤的状态；space 固定每个步骤的宽度。"
      ><Example03
    /></DemoBlock>

    <h3>自定义图标</h3>
    <DemoBlock :code="Example04Code" desc="通过 icon 插槽为每个步骤提供业务图标。"
      ><Example04
    /></DemoBlock>

    <h3>竖向布局</h3>
    <DemoBlock
      :code="Example05Code"
      desc="direction 设置为 vertical 后按纵向展示，适合较长的步骤说明。"
      ><Example05
    /></DemoBlock>

    <h3>简洁布局</h3>
    <DemoBlock :code="Example06Code" desc="simple 使用紧凑箭头布局，适合放在表单或弹窗顶部。"
      ><Example06
    /></DemoBlock>

    <h3>尺寸</h3>
    <DemoBlock :code="Example07Code" desc="size 会同步调整图标、连接线、标题、说明和简洁布局间距。"
      ><Example07
    /></DemoBlock>

    <h3>标题与说明插槽</h3>
    <DemoBlock :code="SlotsCode" desc=""><Slots /></DemoBlock>
  </div>
</template>

<style scoped>
.steps-demo {
  width: 100%;
  max-width: 720px;
}
.steps-demo--scroll {
  overflow-x: auto;
  padding-bottom: 4px;
}
.steps-demo--vertical {
  height: 300px;
}
.steps-actions {
  margin-top: 24px;
}
.steps-size-list {
  display: grid;
  width: 100%;
  gap: 12px;
}
</style>
