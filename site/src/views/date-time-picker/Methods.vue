<script setup lang="ts">
import { ref } from 'vue';
import { ZtDateTimePicker, ZtButton } from '@ztechjs/zt-ui';
import type { ZtDatePickerValue } from '@ztechjs/zt-ui';
const picker = ref<InstanceType<typeof ZtDateTimePicker>>();
const value = ref<ZtDatePickerValue>(null);
const message = ref('尚未选择');
</script>

<template>
  <div class="example-stack">
    <div class="example-row">
      <ZtButton @click="picker?.open()">打开面板</ZtButton
      ><ZtButton @click="picker?.focus()">聚焦</ZtButton
      ><ZtButton @click="picker?.clear()">清空</ZtButton>
    </div>
    <ZtDateTimePicker
      ref="picker"
      v-model="value"
      clearable
      placeholder="选择业务日期"
      @change="message = JSON.stringify($event)"
      @clear="message = '已清空'"
    />
    <p role="status">提交值：{{ message }}</p>
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
