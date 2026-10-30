<script setup lang="ts">
import { ref } from 'vue';
import { ZtAutocomplete } from '@ztechjs/zt-ui';
const value = ref('');
const options = [
  { value: '杭州', label: '杭州仓' },
  { value: '上海', label: '上海仓' },
  { value: '北京', disabled: true },
];
</script>

<template>
  <div class="demo">
    <ZtAutocomplete
      v-model="value"
      :options="options"
      clearable
      placeholder="输入仓库城市"
    />
    <p>城市：{{ value }}</p>
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
