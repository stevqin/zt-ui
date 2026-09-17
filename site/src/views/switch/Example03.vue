<script setup lang="ts">
import { ref } from 'vue';
import { ZtSwitch } from '@ztechjs/zt-ui';
const status = ref(false);
</script>

<template>
  <div class="demo-row">
    <ZtSwitch v-model="status" status="default" /><ZtSwitch
      v-model="status"
      status="primary"
    /><ZtSwitch v-model="status" status="success" /><ZtSwitch
      v-model="status"
      status="warning"
    /><ZtSwitch v-model="status" status="danger" /><ZtSwitch v-model="status" status="info" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.demo-row:last-child {
  margin-bottom: 0;
}
</style>
