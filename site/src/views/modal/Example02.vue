<script setup lang="ts">
import { ref } from 'vue';
import { ZtInput, ZtButton, ZtModal } from '@ztechjs/zt-ui';
const name = ref('安小正'), department = ref('信息中心');
const footerVisible = ref(false);
const confirmLoading = ref(false);
function save() {
  confirmLoading.value = true;
  setTimeout(() => {
    confirmLoading.value = false;
    footerVisible.value = false;
  }, 1200);
}
</script>

<template>
  <div class="demo-row">
    <ZtButton status="primary" @click="footerVisible = true">编辑资料</ZtButton>
  </div>
  <ZtModal
    v-model="footerVisible"
    title="编辑资料"
    show-footer
    :confirm-loading="confirmLoading"
    @confirm="save"
    ><div class="overlay-demo-form">
      <label>姓名<ZtInput v-model="name" /></label><label>部门<ZtInput v-model="department" /></label></div
  ></ZtModal>
</template>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.demo-row:last-child {
  margin-bottom: 0;
}

.overlay-demo-form {
  display: grid;
  gap: 14px;
}
.overlay-demo-form label {
  display: grid;
  gap: 6px;
  color: #4b5563;
  font-size: 13px;
}
.demo-state {
  color: #64748b;
  font-size: 13px;
}
</style>
