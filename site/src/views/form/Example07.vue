<script setup lang="ts">
import { reactive } from 'vue';
import { ZtForm, ZtFormItem, ZtInput } from '@ztechjs/zt-ui';
const profile = reactive({ firstName: '', lastName: '', city: '杭州', address: '' });
</script>

<template>
  <div class="form-size-grid">
    <ZtForm
      v-for="size in ['mini', 'small', 'default', 'medium', 'large'] as const"
      :key="size"
      :model="profile"
      :size="size"
      :disabled="size === 'large'"
      ><ZtFormItem :label="size"><ZtInput v-model="profile.city" /></ZtFormItem
    ></ZtForm>
  </div>
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
