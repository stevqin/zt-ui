<script setup lang="ts">
import { ref } from 'vue';
import { ZtDrawer, ZtButton, ZtSwitch } from '@ztechjs/zt-ui';
const visible = ref(false),
  allowClose = ref(false),
  message = ref('');
async function beforeClose() {
  await new Promise((resolve) => setTimeout(resolve, 250));
  message.value = allowClose.value ? '允许关闭' : '请先打开允许关闭开关';
  return allowClose.value;
}
</script>

<template>
  <div class="example-stack">
    <ZtButton @click="visible = true">打开编辑面板</ZtButton
    ><ZtDrawer
      v-model="visible"
      destroy-on-close
      show-footer
      :before-close="beforeClose"
      @closed="message = '关闭动画结束，内容已销毁'"
      ><template #title>编辑业务草稿</template
      ><label>备注 <input placeholder="关闭并重新打开后此输入会重建" /></label
      ><ZtSwitch v-model="allowClose" active-text="允许关闭" />
      <p role="status">{{ message }}</p>
      <template #footer
        ><ZtButton @click="visible = false">直接更新 v-model 关闭</ZtButton></template
      ></ZtDrawer
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
