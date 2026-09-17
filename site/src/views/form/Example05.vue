<script setup lang="ts">
import { reactive } from 'vue';
import { ZtForm, ZtFormGroup, ZtFormItem, ZtInput } from '@ztechjs/zt-ui';
const profile = reactive({ firstName: '', lastName: '', city: '杭州', address: '' });
</script>

<template>
  <ZtForm :model="profile" label-position="top" class="form-group-grid"
    ><ZtFormGroup title="基本信息" description="用于账户展示" bordered
      ><ZtFormItem label="名字"><ZtInput v-model="profile.firstName" /></ZtFormItem
      ><ZtFormItem label="姓氏"><ZtInput v-model="profile.lastName" /></ZtFormItem></ZtFormGroup
    ><ZtFormGroup title="联系地址" bordered
      ><ZtFormItem label="城市"><ZtInput v-model="profile.city" /></ZtFormItem
      ><ZtFormItem label="地址"><ZtInput v-model="profile.address" /></ZtFormItem></ZtFormGroup
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
