<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Fullscreen from './Fullscreen.vue';
import FullscreenCode from './Fullscreen.vue?raw';
</script>
<template>
  <div class="doc-section">
    <h1>Loading 加载</h1>
    <p>
      支持区域遮罩与命令式全屏加载；setup 中的服务继承当前外观并随宿主卸载清理。
    </p>
    <h2>区域加载</h2>
    <DemoBlock :code="BasicCode"><Basic /></DemoBlock>
    <h2>命令式全屏与自动清理</h2>
    <DemoBlock :code="FullscreenCode"><Fullscreen /></DemoBlock>
  </div>
</template>
