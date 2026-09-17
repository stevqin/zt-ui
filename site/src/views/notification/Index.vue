<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Action from './Action.vue';
import ActionCode from './Action.vue?raw';
</script>
<template>
  <div class="doc-section">
    <h1>Notification 通知</h1>
    <p>支持标题、正文、自定义操作及四角堆叠，默认 4.5 秒后关闭。</p>
    <h2>四角位置</h2>
    <DemoBlock :code="BasicCode"><Basic /></DemoBlock>
    <h2>自定义操作与持久通知</h2>
    <DemoBlock :code="ActionCode"><Action /></DemoBlock>
  </div>
</template>
