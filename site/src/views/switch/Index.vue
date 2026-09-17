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
import Width from './Width.vue';
import WidthCode from './Width.vue?raw';
</script>

<template>
  <div class="doc-section">
    <h1>Switch 开关</h1>
    <p>表示两种相互对立的状态间切换。</p>
    <h2>基础用法</h2>
    <DemoBlock :code="Example01Code" desc="使用 v-model 绑定布尔值。"><Example01 /></DemoBlock>
    <h2>文字描述</h2>
    <DemoBlock :code="Example02Code" desc="通过 active-text 和 inactive-text 设置文字。"
      ><Example02
    /></DemoBlock>
    <h2>颜色状态</h2>
    <DemoBlock :code="Example03Code" desc="通过 status 设置开启颜色。"><Example03 /></DemoBlock>
    <h2>尺寸</h2>
    <DemoBlock :code="Example04Code" desc="支持 mini、small、default、medium、large 五档尺寸。"
      ><Example04
    /></DemoBlock>
    <h2>禁用与加载</h2>
    <DemoBlock :code="Example05Code" desc="disabled 禁止交互，loading 展示处理中状态。"
      ><Example05
    /></DemoBlock>
    <h2>自定义值</h2>
    <DemoBlock :code="Example06Code" desc="active-value 和 inactive-value 可使用字符串或数字。"
      ><Example06
    /></DemoBlock>

    <h2>自定义宽度与事件</h2>
    <DemoBlock :code="WidthCode" desc=""><Width /></DemoBlock>
  </div>
</template>
