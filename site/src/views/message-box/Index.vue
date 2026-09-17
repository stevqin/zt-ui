<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Prompt from './Prompt.vue';
import PromptCode from './Prompt.vue?raw';
</script>
<template>
  <div class="doc-section">
    <h1>MessageBox 消息确认</h1>
    <p>
      基于 Modal 的命令式提示、确认和输入对话框；Promise
      明确区分确认、取消和关闭。
    </p>
    <h2>提示、确认与取消结果</h2>
    <DemoBlock :code="BasicCode"><Basic /></DemoBlock>
    <h2>输入校验与异步提交</h2>
    <DemoBlock :code="PromptCode"><Prompt /></DemoBlock>
  </div>
</template>
