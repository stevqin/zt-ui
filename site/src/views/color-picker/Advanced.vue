<script setup lang="ts">
import { ref } from 'vue';
import { ZtColorPicker } from '@ztechjs/zt-ui';
const value = ref('hsl(280, 60%, 50%)'),
  event = ref('');
</script>
<template>
  <div class="picker-demo">
    <ZtColorPicker
      v-model="value"
      show-alpha
      :presets="['rgba(255,0,0,0.5)', 'hsl(120,100%,50%)', 'invalid']"
      @confirm="event = `确定：${$event}`"
      @cancel="event = '已取消草稿'"
    />
    <p>
      在文本框输入 rgb(255, 128, 0) 或 hsl(120, 100%,
      50%)。非法文本显示错误且不能确认，非法预设不可选。
    </p>
    <p>{{ event }}</p>
  </div>
</template>
<style scoped>
.picker-demo {
  display: grid;
  gap: 14px;
  max-width: 100%;
}
p {
  margin: 0;
  color: var(--zt-muted, #667085);
  font-size: 13px;
  overflow-wrap: anywhere;
}
label {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
