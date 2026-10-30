<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtSteps, ZtStep, ZtButton, ZtSpace } from '@ztechjs/zt-ui';
const active = ref(0);
const titles = ['填写信息', '确认商品', '提交审核'];
</script>
<template>
  <ZtSteps :active="active" finish-status="success">
    <ZtStep v-for="title in titles" :key="title" :title="title" />
  </ZtSteps>
  <p>当前：{{ titles[active] || '流程已完成' }}</p>
  <ZtSpace>
    <ZtButton :disabled="active === 0" @click="active--">上一步</ZtButton>
    <ZtButton status="primary" :disabled="active === 3" @click="active++">
      下一步
    </ZtButton>
    <ZtButton @click="active = 0">重新开始</ZtButton>
  </ZtSpace>
</template>
