<script setup lang="ts">
import { ref } from 'vue';
import { ZtTour, ZtButton, ZtSpace } from '@ztechjs/zt-ui';
const filterTarget = ref<HTMLElement>(),
  exportTarget = ref<HTMLElement>();
const open = ref(false),
  current = ref(0),
  action = ref('点击按钮或开始导览');
const steps = [
  {
    target: () => filterTarget.value,
    title: '筛选订单',
    description: '先选择日期和门店，缩小订单查询范围。',
  },
  {
    target: () => exportTarget.value,
    title: '导出结果',
    description: '筛选完成后，可以将当前结果导出。',
  },
];
function start() {
  current.value = 0;
  open.value = true;
}
</script>
<template>
  <ZtSpace wrap>
    <span ref="filterTarget">
      <ZtButton @click="action = '筛选面板已打开'">筛选</ZtButton>
    </span>
    <span ref="exportTarget">
      <ZtButton @click="action = '导出任务已创建'">导出</ZtButton>
    </span>
    <ZtButton status="primary" @click="start">开始导览</ZtButton>
  </ZtSpace>
  <p role="status">{{ action }}</p>
  <ZtTour
    v-model="open"
    v-model:current="current"
    :steps="steps"
    @finish="action = '导览已完成'"
    @close="action = '导览已关闭，可重新开始'"
  />
</template>
