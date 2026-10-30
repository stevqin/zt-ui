<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtButton, ZtSpace } from '@ztechjs/zt-ui';
const count = ref(0);
</script>
<template>
  <ZtSpace wrap>
    <ZtButton status="primary" @click="count++">提交</ZtButton>
    <ZtButton @click="count = 0">清零</ZtButton>
    <ZtButton disabled>无权限</ZtButton>
    <span>已提交 {{ count }} 次</span>
  </ZtSpace>
</template>
