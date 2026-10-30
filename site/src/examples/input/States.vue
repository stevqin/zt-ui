<script setup lang="ts">
import { ref } from 'vue';
import { ZtInput, ZtPassword } from '@ztechjs/zt-ui';
const password = ref('secret');
</script>

<template>
  <div class="demo">
    <ZtPassword v-model="password" />
    <ZtInput model-value="审核通过" status="success" readonly />
    <ZtInput model-value="不可编辑" disabled />
    <ZtInput :maxlength="20" show-word-limit placeholder="最多 20 字" />
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 16px;
  max-width: 100%;
}
.demo p {
  margin: 0;
}
</style>
