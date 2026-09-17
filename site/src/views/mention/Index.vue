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
  <div class="doc-section">
    <h1>Mention 提及</h1>
    <p>
      普通 textarea
      文本值，支持多个前缀；选择仅替换前缀到光标之间的文本，不影响光标后的内容。
    </p>
    <h2>基础与事件</h2>
    <DemoBlock :code="BasicCode"><Basic /></DemoBlock>
    <h2>进阶与边界</h2>
    <DemoBlock :code="AdvancedCode"><Advanced /></DemoBlock>
    <h2>五档尺寸与主题</h2>
    <DemoBlock :code="AppearanceCode"><Appearance /></DemoBlock>
    <h2>六种语义状态</h2>
    <DemoBlock :code="StatusCode"><Status /></DemoBlock>
    <h2>表单联动</h2>
    <DemoBlock :code="FormCode"><Form /></DemoBlock>
  </div>
</template>
