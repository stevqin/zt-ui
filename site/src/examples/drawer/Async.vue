<script setup lang="ts">
import { ref } from 'vue';
import { ZtDrawer, ZtButton, ZtInput, ZtCheckbox } from '@ztechjs/zt-ui';
const open = ref(false);
const busy = ref(false);
const protect = ref(true);
const value = ref('待发布活动');
const hint = ref('');
function beforeClose() {
  if (protect.value) {
    hint.value = '未保存内容受到保护，请保存或关闭保护';
    return false;
  }
  return true;
}
async function save() {
  busy.value = true;
  await new Promise((resolve) => setTimeout(resolve, 700));
  busy.value = false;
  protect.value = false;
  open.value = false;
  hint.value = '保存成功';
}
</script>

<template>
  <div class="demo">
    <ZtButton @click="open = true">打开异步编辑</ZtButton>
    <ZtCheckbox v-model="protect">保护未保存内容</ZtCheckbox>
    <ZtDrawer
      v-model="open"
      title="保存活动"
      show-footer
      :confirm-loading="busy"
      :before-close="beforeClose"
      mask-closable
      @confirm="save"
    >
      <ZtInput v-model="value" />
      <p>{{ hint }}</p>
    </ZtDrawer>
    <p>{{ hint }}</p>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 16px;
  max-width: 100%;
}
.demo p {
  margin: 0;
}
</style>
