<script setup lang="ts">
import { ref } from 'vue';
import { ZtInput, ZtButton } from '@ztechjs/zt-ui';
const control = ref<InstanceType<typeof ZtInput>>();
const value = ref('');
const message = ref('尚未操作');
</script>

<template>
  <div class="example-stack">
    <div class="example-row">
      <ZtButton @click="control?.focus()">聚焦输入框</ZtButton
      ><ZtButton @click="control?.blur()">移出焦点</ZtButton>
    </div>
    <ZtInput
      ref="control"
      v-model="value"
      aria-label="事件演示"
      @change="message = String($event)"
      @blur="message = '已失去焦点'"
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
