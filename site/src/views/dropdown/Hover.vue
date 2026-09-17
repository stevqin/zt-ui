<script setup lang="ts">
import { ref } from 'vue';
import { ZtDropdown } from '@ztechjs/zt-ui';
const count = ref(0);
</script>
<template>
  <div class="demo-row">
    <ZtDropdown
      trigger="hover"
      :hide-on-click="false"
      :items="[{ key: 'add', label: '增加计数' }]"
      @command="count++"
      >悬停打开 ▾</ZtDropdown
    ><span role="status">计数 {{ count }}</span
    ><ZtDropdown disabled :items="[]">已禁用</ZtDropdown>
  </div>
</template>
<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.demo-stack {
  display: grid;
  gap: 14px;
}
</style>
