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
import Limits from './Limits.vue';
import LimitsCode from './Limits.vue?raw';
</script>

<template>
  <div class="doc-section">
    <h1>Checkbox 多选框</h1>
    <p>在一组备选项中进行多选。</p>
    <h2>基础用法</h2>
    <DemoBlock :code="Example01Code" desc="使用 v-model 绑定布尔值。"><Example01 /></DemoBlock>
    <h2>禁用</h2>
    <DemoBlock :code="Example02Code" desc="设置 disabled 禁用。"><Example02 /></DemoBlock>
    <h2>CheckboxGroup 组合</h2>
    <DemoBlock :code="Example03Code" desc="CheckboxGroup 使用数组统一管理多选。"
      ><Example03
    /></DemoBlock>
    <h2>颜色状态</h2>
    <DemoBlock :code="Example04Code" desc="通过 CheckboxGroup 的 status 设置选中颜色。"
      ><Example04
    /></DemoBlock>
    <h2>半选状态</h2>
    <DemoBlock :code="Example05Code" desc="indeterminate 常用于全选逻辑。"><Example05 /></DemoBlock>
    <h2>带边框</h2>
    <DemoBlock :code="Example06Code" desc="设置 border 展示带边框样式。"><Example06 /></DemoBlock>
    <h2>尺寸</h2>
    <DemoBlock :code="Example07Code" desc="支持 mini、small、default、medium、large。"
      ><Example07
    /></DemoBlock>

    <h2>组内数量限制与事件</h2>
    <DemoBlock :code="LimitsCode" desc=""><Limits /></DemoBlock>
  </div>
</template>
