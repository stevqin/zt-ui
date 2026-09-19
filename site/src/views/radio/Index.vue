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
import Segmented from './Segmented.vue';
import SegmentedCode from './Segmented.vue?raw';
import Events from './Events.vue';
import EventsCode from './Events.vue?raw';
</script>

<template>
  <div class="component-examples">
    <h3>基础用法</h3>
    <DemoBlock :code="Example01Code" desc="使用 v-model 绑定选中值，label 为选项值。"
      ><Example01
    /></DemoBlock>

    <h3>禁用</h3>
    <DemoBlock :code="Example02Code" desc="设置 disabled 属性禁用单个 Radio。"
      ><Example02
    /></DemoBlock>

    <h3>RadioGroup 组合</h3>
    <DemoBlock :code="Example03Code" desc="RadioGroup 统一管理选中状态。"><Example03 /></DemoBlock>

    <h3>连体分段按钮</h3>
    <DemoBlock :code="SegmentedCode" desc="segmented 将等高单选项连成一组按钮，每项拥有独立边框并折叠相邻边线。支持五种 size、status 以及 ConfigProvider 的圆角与尺寸；Tab 聚焦，方向键切换，空格选择。"><Segmented /></DemoBlock>

    <h3>颜色状态</h3>
    <DemoBlock :code="Example04Code" desc="通过 RadioGroup 的 status 设置选中颜色。"
      ><Example04
    /></DemoBlock>

    <h3>带边框</h3>
    <DemoBlock :code="Example05Code" desc="设置 border 属性展示带边框的 Radio。"
      ><Example05
    /></DemoBlock>

    <h3>尺寸</h3>
    <DemoBlock :code="Example06Code" desc="RadioGroup 可统一设置 mini、small、medium、large 尺寸。"
      ><Example06
    /></DemoBlock>

    <h3>组合禁用与选择反馈</h3>
    <DemoBlock :code="EventsCode" desc=""><Events /></DemoBlock>
  </div>
</template>
