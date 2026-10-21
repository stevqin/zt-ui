<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Template from './Template.vue';
import TemplateCode from './Template.vue?raw';
import Advanced from './Advanced.vue';
import AdvancedCode from './Advanced.vue?raw';
</script>
<template>
  <div class="component-examples">
    <h3>items 数组与作用域内容</h3>
    <DemoBlock
      :code="BasicCode"
      desc="通过 items 配置节点，支持倒序、交替布局和内容插槽。"
      ><Basic
    /></DemoBlock>
    <h3>ZtTimelineItem 模板节点</h3>
    <DemoBlock
      :code="TemplateCode"
      desc="用模板声明节点及其内容、图标插槽，支持动态显隐、倒序与布局切换。"
      ><Template
    /></DemoBlock>
    <h3>进阶用法</h3>
    <DemoBlock
      :code="AdvancedCode"
      desc="items 方式组合主题、布局与统一的图标插槽。"
      ><Advanced
    /></DemoBlock>
  </div>
</template>
