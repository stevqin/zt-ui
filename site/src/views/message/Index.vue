<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Grouping from './Grouping.vue';
import GroupingCode from './Grouping.vue?raw';
</script>
<template>
  <div class="doc-section">
    <h1>Message 全局消息</h1>
    <p>轻量消息支持超时、悬停暂停、去重和手动关闭。文本不解析 HTML。</p>
    <h2>类型与全局外观继承</h2>
    <DemoBlock :code="BasicCode"><Basic /></DemoBlock>
    <h2>重复合并与手动关闭</h2>
    <DemoBlock :code="GroupingCode"><Grouping /></DemoBlock>
  </div>
</template>
