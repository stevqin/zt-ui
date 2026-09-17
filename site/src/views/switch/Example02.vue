<script setup lang="ts">
import { ref } from 'vue';
import { ZtSwitch } from '@ztechjs/zt-ui';
const enabled = ref(true);
</script>

<template>
  <div class="demo-row">
    <ZtSwitch v-model="enabled" active-text="开" inactive-text="关" /><ZtSwitch
      v-model="enabled"
      active-text="ON"
      inactive-text="OFF"
      size="large"
    />
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
