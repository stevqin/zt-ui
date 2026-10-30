<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtTour, ZtButton } from '@ztechjs/zt-ui';
const open = ref(false),
  current = ref(0);
const steps = [
  { title: '开始盘点', description: '请先确认盘点仓库与盘点日期。' },
  { title: '核对差异', description: '核实数量差异后，再提交盘点审核。' },
];
</script>
<template>
  <ZtButton
    @click="
      current = 0;
      open = true;
    "
  >
    查看操作说明
  </ZtButton>
  <ZtTour v-model="open" v-model:current="current" :mask="false" :steps="steps" />
</template>
