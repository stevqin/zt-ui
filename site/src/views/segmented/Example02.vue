<script setup lang="ts">
import { ref } from 'vue';
import { ZtSegmented } from '@ztechjs/zt-ui';
const status = ref('online');
</script>

<template>
  <ZtSegmented v-model="status" block status="success" :options="['online', 'offline', 'all']" />
</template>
