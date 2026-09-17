<script setup lang="ts">
import { ref } from 'vue';
import { ZtPassword } from '@ztechjs/zt-ui';
const value = ref('');
</script>

<template>
  <div class="example-stack">
    <ZtPassword
      v-model="value"
      :maxlength="16"
      show-word-limit
      clearable
      autocomplete="new-password"
      aria-label="新密码"
      ><template #prepend>新密码</template><template #prefix>🔒</template
      ><template #append>最多 16 位</template></ZtPassword
    >
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
