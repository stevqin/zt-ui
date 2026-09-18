<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Advanced from './Advanced.vue';
import AdvancedCode from './Advanced.vue?raw';
import Appearance from './Appearance.vue';
import AppearanceCode from './Appearance.vue?raw';
import Form from './Form.vue';
import FormCode from './Form.vue?raw';
import Status from './Status.vue';
import StatusCode from './Status.vue?raw';
</script>
<template>
  <div class="component-examples">
    <h3>基础与事件</h3>
    <DemoBlock :code="BasicCode"><Basic /></DemoBlock>
    <h3>进阶与边界</h3>
    <DemoBlock :code="AdvancedCode"><Advanced /></DemoBlock>
    <h3>五档尺寸与主题</h3>
    <DemoBlock :code="AppearanceCode"><Appearance /></DemoBlock>
    <h3>六种语义状态</h3>
    <DemoBlock :code="StatusCode"><Status /></DemoBlock>
    <h3>表单联动</h3>
    <DemoBlock :code="FormCode"><Form /></DemoBlock>
  </div>
</template>
