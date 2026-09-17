<script setup lang="ts">
import { ref } from 'vue';
import { ZtSwitch } from '@ztechjs/zt-ui';
const enabled = ref(true);
</script>

<template>
  <div class="demo-row">
    <ZtSwitch v-model="enabled" size="mini" /><ZtSwitch v-model="enabled" size="small" /><ZtSwitch
      v-model="enabled"
    /><ZtSwitch v-model="enabled" size="medium" /><ZtSwitch v-model="enabled" size="large" />
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
