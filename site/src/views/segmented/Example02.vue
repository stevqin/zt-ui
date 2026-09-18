<script setup lang="ts">
import { useDemoStatus } from '../../docs/useDemoStatus';
import type { ZtSegmentedStatus } from '@ztechjs/zt-ui';
import { ref } from 'vue';
import { ZtSegmented } from '@ztechjs/zt-ui';
const demoStatus = useDemoStatus<ZtSegmentedStatus>('primary');
const status = ref('online');
</script>

<template>
  <ZtSegmented
    v-model="status"
    block
    :status="demoStatus"
    :options="['online', 'offline', 'all']"
  />
</template>
