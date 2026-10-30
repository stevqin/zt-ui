<script setup lang="ts">
import { ref } from 'vue';
import { ZtInput, ZtSelect, ZtButton, ZtModal } from '@ztechjs/zt-ui';
const value = ref('品牌运营');
const open = ref(false);
</script>

<template>
  <div class="demo">
    <ZtInput v-model="value" />
    <ZtSelect :options="[{ value: 'demo', label: '品牌A' }]" placeholder="查看下拉外观" />
    <ZtButton @click="open = true">查看浮层继承</ZtButton>
    <ZtModal v-model="open" title="继承全局外观"><ZtInput v-model="value" /></ZtModal>
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
