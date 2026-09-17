<script setup lang="ts">
import { ref } from 'vue';
import { ZtTabs, ZtTabPane, ZtSwitch } from '@ztechjs/zt-ui';
const active = ref('edit'),
  locked = ref(true),
  message = ref('未保存时阻止离开编辑页');
async function beforeLeave(next: string | number, previous: string | number) {
  message.value = '检查未保存内容…';
  await new Promise((resolve) => setTimeout(resolve, 400));
  const allowed = !(previous === 'edit' && locked.value);
  message.value = allowed ? `已切换到 ${next}` : '存在未保存内容，请先关闭保护开关';
  return allowed;
}
</script>

<template>
  <div class="example-stack">
    <ZtSwitch v-model="locked" active-text="保护未保存内容" />
    <ZtTabs v-model="active" :before-leave="beforeLeave"
      ><ZtTabPane name="edit" label="编辑">编辑草稿</ZtTabPane
      ><ZtTabPane name="preview" label="预览" lazy>首次打开后渲染预览内容</ZtTabPane></ZtTabs
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
