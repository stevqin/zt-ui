<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
</script>
<template>
  <div class="doc-section">
    <h1>Loading 加载</h1>
    <p>
      声明式区域加载遮罩，由 loading 状态控制，仅覆盖当前内容区域。命令式全屏加载请参阅 <RouterLink to="/feedback">独立反馈库指南</RouterLink>。
    </p>
    <h2>区域加载</h2>
    <DemoBlock :code="BasicCode"><Basic /></DemoBlock>
  </div>
</template>
