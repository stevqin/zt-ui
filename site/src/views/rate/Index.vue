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
    <h1>Rate 评分</h1>
    <p>
      支持半星、最大分值、清空及自定义图标。方向键按步长评分，Home/End
      设置边界，Delete 清空。
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
