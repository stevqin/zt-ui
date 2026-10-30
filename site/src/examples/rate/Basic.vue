<script setup lang="ts">
import { ref } from 'vue';
import { ZtRate } from '@ztechjs/zt-ui';
const value = ref(3.5);
</script>

<template>
  <div class="demo">
    <ZtRate
      v-model="value"
      allow-half
      clearable
      show-score
      :texts="['较差', '一般', '满意', '很好', '出色']"
      label="服务评分"
    />
    <p>分值：{{ value }}</p>
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
