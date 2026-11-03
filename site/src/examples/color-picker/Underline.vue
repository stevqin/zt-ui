<script setup lang="ts">
import { ref } from 'vue';
import { ZtColorPicker, ZtForm, ZtFormItem } from '@ztechjs/zt-ui';
const color = ref('#1677ff');
</script>
<template>
  <div class="underline-demo">
    <span>独立使用</span>
    <ZtColorPicker v-model="color" underline />
    <ZtForm underline label-position="top">
      <ZtFormItem label="继承表单下划线">
        <ZtColorPicker v-model="color" />
      </ZtFormItem>
      <ZtFormItem label="显式保留边框">
        <ZtColorPicker v-model="color" :underline="false" />
      </ZtFormItem>
    </ZtForm>
    <p>颜色：{{ color }}</p>
  </div>
</template>
<style scoped>
.underline-demo { display: grid; gap: 12px; max-width: 360px; }
.underline-demo > span { font-size: 13px; color: var(--zt-text-muted); }
.underline-demo :deep(.zt-color-picker) { width: 100%; }
.underline-demo p { margin: 0; }
</style>
