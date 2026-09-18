<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import { ref } from 'vue';
import { ZtTimeSelect, type ZtEntryStatus } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtEntryStatus>('primary');
const value = ref<string | null>('10:00');
</script>
<template>
  <div class="status-demo">
    <div>
      <p>{{ demoStatus }}</p>
      <ZtTimeSelect v-model="value" :status="demoStatus" />
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
