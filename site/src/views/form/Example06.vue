<script setup lang="ts">
import { reactive } from 'vue';
import { ZtForm, ZtFormItem, ZtInput, type ZtFormRules } from '@ztechjs/zt-ui';
const invite = reactive({ code: '' });
const inviteRules: ZtFormRules = {
  code: {
    trigger: 'blur',
    validator: async (_rule, value) => {
      await new Promise((resolve) => window.setTimeout(resolve, 250));
      return value === 'ZT2026' ? undefined : '邀请码应为 ZT2026';
    },
  },
};
</script>

<template>
  <ZtForm :model="invite" :rules="inviteRules" label-position="top" class="form-demo"
    ><ZtFormItem label="邀请码" prop="code"
      ><ZtInput v-model="invite.code" placeholder="输入 ZT2026 后移出焦点" /></ZtFormItem
  ></ZtForm>
</template>

<style scoped>
.form-demo {
  width: min(100%, 520px);
}
.form-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
.form-actions span {
  color: #6b7280;
  font-size: 12px;
}
.form-layout-grid,
.form-size-grid {
  display: grid;
  gap: 12px;
  width: min(100%, 520px);
}
.form-group-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
@media (max-width: 720px) {
  .form-group-grid {
    grid-template-columns: 1fr;
  }
}
</style>
