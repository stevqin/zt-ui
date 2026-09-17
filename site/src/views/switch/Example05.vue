<script setup lang="ts">
import { ref } from 'vue';
import { ZtSwitch } from '@ztechjs/zt-ui';
const basic = ref(false);
const enabled = ref(true);
</script>

<template>
  <div class="demo-row">
    <ZtSwitch v-model="basic" disabled /><ZtSwitch v-model="enabled" disabled /><ZtSwitch
      v-model="basic"
      loading
    /><ZtSwitch v-model="enabled" loading />
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
