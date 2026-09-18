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
</script>

<template>
  <div class="component-examples">
    <h3>基础用法</h3>
    <DemoBlock :code="Example01Code" desc="status 定义标签颜色。"><Example01 /></DemoBlock>
    <h3>主题</h3>
    <DemoBlock :code="Example02Code" desc="effect 支持 light、dark、plain。"
      ><Example02
    /></DemoBlock>
    <h3>尺寸</h3>
    <DemoBlock :code="Example03Code" desc="支持五种尺寸。"><Example03 /></DemoBlock>
    <h3>圆角</h3>
    <DemoBlock :code="Example04Code" desc="round 展示胶囊形标签。"><Example04 /></DemoBlock>
    <h3>可关闭</h3>
    <DemoBlock :code="Example05Code" desc="closable 显示关闭按钮并触发 close。"
      ><Example05
    /></DemoBlock>
    <h3>边框描边</h3>
    <DemoBlock :code="Example06Code" desc="hit 为 light 主题增加描边。"><Example06 /></DemoBlock>
  </div>
</template>
