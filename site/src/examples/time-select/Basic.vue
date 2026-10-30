<script setup lang="ts">
import { ref } from 'vue';
import { ZtTimeSelect } from '@ztechjs/zt-ui';
const value = ref<string | null>(null);
</script>

<template>
  <div class="demo">
    <ZtTimeSelect
      v-model="value"
      start="09:00"
      end="18:00"
      step="00:30"
      filterable
      clearable
    />
    <p>{{ value || '请选择时间' }}</p>
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
