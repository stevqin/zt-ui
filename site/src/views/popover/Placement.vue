<script setup lang="ts">
import { ref } from 'vue';
import { ZtPopover, ZtButton, ZtSwitch } from '@ztechjs/zt-ui';
const disabled = ref(false),
  arrow = ref(true);
const placements = ['top', 'right', 'bottom', 'left'] as const;
</script>

<template>
  <div class="example-stack">
    <div class="example-row">
      <ZtSwitch v-model="disabled" active-text="禁用浮层" /><ZtSwitch
        v-model="arrow"
        active-text="显示箭头"
      />
    </div>
    <div class="example-row">
      <ZtPopover
        v-for="placement in placements"
        :key="placement"
        :placement="placement"
        :show-arrow="arrow"
        :disabled="disabled"
        :offset="16"
        :width="200"
        ><ZtButton>{{ placement }}</ZtButton
        ><template #content>距触发元素 16px；空间不足时自动调整位置。</template></ZtPopover
      >
    </div>
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
