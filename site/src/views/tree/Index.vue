<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Virtual from './Virtual.vue';
import VirtualCode from './Virtual.vue?raw';
import Lazy from './Lazy.vue';
import LazyCode from './Lazy.vue?raw';
import Status from './Status.vue';
import StatusCode from './Status.vue?raw';
</script>
<template>
  <div class="doc-section">
    <h1>Tree 树形控件</h1>
    <h2>勾选、过滤与键盘导航</h2>
    <DemoBlock :code="BasicCode" desc="勾选、过滤与键盘导航"
      ><Basic
    /></DemoBlock>
    <h2>万级节点虚拟窗口</h2>
    <DemoBlock :code="VirtualCode" desc="万级节点虚拟窗口"
      ><Virtual
    /></DemoBlock>
    <h2>懒加载与失败重试</h2>
    <DemoBlock :code="LazyCode" desc="懒加载与失败重试"><Lazy /></DemoBlock>
    <h2>六种语义状态</h2>
    <DemoBlock :code="StatusCode" desc="勾选、选中与焦点颜色随状态和主题变化"
      ><Status
    /></DemoBlock>
  </div>
</template>
