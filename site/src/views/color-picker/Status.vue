<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import { ref } from 'vue';
import { ZtColorPicker, type ZtEntryStatus } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtEntryStatus>('primary');
const value = ref<string>('#245edb');
</script>
<template>
  <div class="status-demo">
    <div>
      <p>{{ demoStatus }}</p>
      <ZtColorPicker v-model="value" :status="demoStatus" clearable />
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
