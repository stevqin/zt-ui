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
  <div class="component-examples">
    <h3>勾选、过滤与键盘导航</h3>
    <DemoBlock :code="BasicCode" desc="勾选、过滤与键盘导航"
      ><Basic
    /></DemoBlock>
    <h3>万级节点虚拟窗口</h3>
    <DemoBlock :code="VirtualCode" desc="万级节点虚拟窗口"
      ><Virtual
    /></DemoBlock>
    <h3>懒加载与失败重试</h3>
    <DemoBlock :code="LazyCode" desc="懒加载与失败重试"><Lazy /></DemoBlock>
    <h3>六种语义状态</h3>
    <DemoBlock :code="StatusCode" desc="勾选、选中与焦点颜色随状态和主题变化"
      ><Status
    /></DemoBlock>
  </div>
</template>
