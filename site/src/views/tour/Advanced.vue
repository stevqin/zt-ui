<script setup lang="ts">
import { ref } from 'vue';
import { ZtTour, ZtButton, ZtConfigProvider } from '@ztechjs/zt-ui';
import type { ZtTourStep } from '@ztechjs/zt-ui';
const open = ref(false),
  current = ref(0);
const steps: ZtTourStep[] = [
  {
    target: '#intentionally-missing-tour-target',
    title: '欢迎使用',
    description: '当目标暂未渲染或不存在时，自动居中展示说明。',
  },
  {
    title: '快捷键',
    description: 'Tab 在面板内导航，Escape 关闭并恢复启动按钮焦点。',
  },
];
</script>
<template>
  <ZtConfigProvider theme="dark" :border-radius="4"
    ><ZtButton
      @click="
        current = 0;
        open = true;
      "
      >查看暗色与缺失目标</ZtButton
    ><ZtTour
      v-model="open"
      v-model:current="current"
      :steps="steps"
      :width="360"
      ><template #default="{ step, index }"
        ><p>{{ step.description }}</p>
        <small>步骤 {{ index + 1 }} 的自定义内容</small></template
      ></ZtTour
    ></ZtConfigProvider
  >
</template>
