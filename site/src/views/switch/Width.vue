<script setup lang="ts">
import { ref } from 'vue';
import { ZtSwitch } from '@ztechjs/zt-ui';
const enabled = ref(false),
  message = ref('尚未更改');
</script>

<template>
  <div class="example-stack">
    <ZtSwitch
      v-model="enabled"
      :width="80"
      active-text="营业中"
      inactive-text="休息中"
      @change="message = $event ? '已开始营业' : '已暂停营业'"
    />
    <p role="status">{{ message }}</p>
  </div>
</template>

<style scoped>
.example-stack {
  display: grid;
  gap: 16px;
  min-width: 0;
}
.example-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.example-note {
  color: var(--zt-text-muted, #68768a);
  font-size: 13px;
  overflow-wrap: anywhere;
}
</style>
