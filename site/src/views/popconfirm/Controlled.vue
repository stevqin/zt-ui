<script setup lang="ts">
import { ref } from 'vue';
import { ZtPopconfirm, ZtButton, ZtSwitch } from '@ztechjs/zt-ui';
const visible = ref(false),
  disabled = ref(false),
  message = ref('');
</script>

<template>
  <div class="example-stack">
    <ZtSwitch v-model="disabled" active-text="禁用确认按钮" /><ZtPopconfirm
      v-model:visible="visible"
      title="标记已读？"
      description="确认后继续显示，直到手动关闭。"
      :confirm-disabled="disabled"
      :hide-after-confirm="false"
      hide-icon
      confirm-text="标记已读"
      cancel-text="关闭"
      button-size="small"
      status="info"
      @confirm="message = '已标记为已读'"
      @cancel="message = '已关闭'"
      ><ZtButton>打开确认</ZtButton></ZtPopconfirm
    ><ZtButton @click="visible = false">外部关闭</ZtButton>
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
