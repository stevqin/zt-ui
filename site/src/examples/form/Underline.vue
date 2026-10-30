<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ZtForm, ZtFormItem, ZtInput, ZtSelect, ZtSwitch } from '@ztechjs/zt-ui';
const underline = ref(true);
const model = reactive({ name: '', priority: 'normal', owner: '' });
const priorities = [{ label: '常规', value: 'normal' }, { label: '紧急', value: 'urgent' }];
</script>
<template>
  <div class="demo">
    <ZtSwitch v-model="underline" active-text="下边框样式" />
    <ZtForm :model="model" :underline="underline" label-position="top" @submit.prevent>
      <ZtFormItem label="任务名称" prop="name" required>
        <template #label="{ label }"><span>{{ label }} <small>（必填）</small></span></template>
        <ZtInput v-model="model.name" placeholder="请输入任务名称" />
      </ZtFormItem>
      <ZtFormItem label="优先级" prop="priority"><ZtSelect v-model="model.priority" :options="priorities" /></ZtFormItem>
      <ZtFormItem label="负责人" prop="owner" label-position="left" :label-width="76"><ZtInput v-model="model.owner" /></ZtFormItem>
    </ZtForm>
    <p>underline 向支持表单外观的控件传递下边框样式。label 插槽接收 label 文本，可添加辅助说明；保留文字标签便于辨识字段。</p>
  </div>
</template>
<style scoped>.demo { display: grid; gap: 16px; } small { font-weight: normal; color: var(--zt-muted, #767676); } p { margin: 0; }</style>
