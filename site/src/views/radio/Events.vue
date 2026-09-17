<script setup lang="ts">
import { ref } from 'vue';
import { ZtRadio, ZtRadioGroup, ZtSwitch } from '@ztechjs/zt-ui';
const value = ref(1),
  disabled = ref(false),
  message = ref('');
</script>

<template>
  <div class="example-stack">
    <ZtSwitch v-model="disabled" active-text="禁用整组" /><ZtRadioGroup
      v-model="value"
      :disabled="disabled"
      @change="message = `选中了 ${$event}`"
      ><ZtRadio :label="1" name="delivery">门店自提</ZtRadio
      ><ZtRadio :label="2" name="delivery">快递配送</ZtRadio></ZtRadioGroup
    >
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
