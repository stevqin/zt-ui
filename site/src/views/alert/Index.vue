<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Custom from './Custom.vue';
import CustomCode from './Custom.vue?raw';
</script>
<template>
  <div class="doc-section">
    <h1>Alert 警告提示</h1>
    <p>持续展示页面内状态，支持语义颜色、图标、插槽与关闭。</p>
    <h2>语义颜色与关闭</h2>
    <DemoBlock :code="BasicCode"><Basic /></DemoBlock>
    <h2>标题、图标插槽与关闭反馈</h2>
    <DemoBlock :code="CustomCode"><Custom /></DemoBlock>
  </div>
</template>
