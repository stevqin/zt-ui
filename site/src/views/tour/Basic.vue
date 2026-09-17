<script setup lang="ts">
import { ref } from 'vue';
import { ZtTour, ZtButton } from '@ztechjs/zt-ui';
import type { ZtTourStep } from '@ztechjs/zt-ui';
const open = ref(false),
  current = ref(0),
  first = ref<HTMLElement>(),
  second = ref<HTMLElement>(),
  result = ref('');
const steps: ZtTourStep[] = [
  {
    target: () => first.value,
    title: '选择数据',
    description: '先选择业务数据范围。',
  },
  {
    target: () => second.value,
    title: '查看报表',
    description: '这里显示查询后的分析结果。',
    placement: 'top',
  },
];
function start() {
  current.value = 0;
  open.value = true;
  result.value = '';
}
</script>
<template>
  <div>
    <ZtButton @click="start">开始引导</ZtButton>
    <div class="targets">
      <div ref="first" class="target">数据筛选</div>
      <div ref="second" class="target">分析报表</div>
    </div>
    <p>{{ result }}</p>
    <ZtTour
      v-model="open"
      v-model:current="current"
      :steps="steps"
      @finish="result = '已完成引导'"
      @close="result = '关闭原因：' + $event"
    />
  </div>
</template>
<style scoped>
.targets {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
}
.target {
  padding: 28px;
  background: #407de51a;
  border: 1px solid #407de533;
  border-radius: 8px;
}
</style>
