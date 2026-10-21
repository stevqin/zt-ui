<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Hover from './Hover.vue';
import HoverCode from './Hover.vue?raw';
import Template from './Template.vue';
import TemplateCode from './Template.vue?raw';
import ItemSlot from './ItemSlot.vue';
import ItemSlotCode from './ItemSlot.vue?raw';
</script>
<template>
  <div class="component-examples">
    <h3>items 数据方式：分组、分隔与禁用</h3>
    <DemoBlock :code="BasicCode"><Basic /></DemoBlock>
    <h3>template 方式：直接声明菜单项</h3>
    <p>在 #dropdown 插槽中使用 ZtDropdownItem，通过 command 标识操作；默认插槽用于触发按钮。两种方式同时提供时，优先使用 #dropdown 插槽。</p>
    <DemoBlock :code="TemplateCode"><Template /></DemoBlock>
    <h3>items 数据方式：自定义菜单项插槽</h3>
    <DemoBlock :code="ItemSlotCode"><ItemSlot /></DemoBlock>
    <h3>悬停与保持菜单展开</h3>
    <DemoBlock :code="HoverCode"><Hover /></DemoBlock>
  </div>
</template>
