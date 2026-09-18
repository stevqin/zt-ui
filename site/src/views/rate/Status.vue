<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import { ref } from 'vue';
import { ZtRate, type ZtEntryStatus } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtEntryStatus>('primary');
const value = ref<number>(3);
</script>
<template>
  <div class="status-demo">
    <div>
      <p>{{ demoStatus }}</p>
      <ZtRate v-model="value" :status="demoStatus" show-score />
    </div>
  </div>
</template>
<style scoped>
.status-demo {
  display: grid;
  gap: 16px;
  max-width: 100%;
}
p {
  margin: 0 0 6px;
  font-size: 13px;
}
</style>
