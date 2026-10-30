<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ZtForm, ZtFormGroup, ZtFormItem, ZtInput, ZtSwitch, ZtSelect } from '@ztechjs/zt-ui';
const locked = ref(true);
const model = reactive({ name: '陈晨', channel: 'email', notification: true, note: '' });
const channels = [{ label: '邮件', value: 'email' }, { label: '站内提醒', value: 'inbox' }];
</script>
<template>
  <div class="demo">
    <ZtSwitch v-model="locked" active-text="锁定通知分组" />
    <ZtForm :model="model" label-position="top" @submit.prevent>
      <ZtFormGroup title="基本资料" description="此分组保持可编辑" bordered>
        <ZtFormItem label="姓名" prop="name"><ZtInput v-model="model.name" /></ZtFormItem>
      </ZtFormGroup>
      <ZtFormGroup title="通知设置" description="禁用状态传递给分组内的输入与选择控件" :disabled="locked" bordered>
        <ZtFormItem label="提醒渠道" prop="channel"><ZtSelect v-model="model.channel" :options="channels" /></ZtFormItem>
        <ZtFormItem label="接收通知" prop="notification"><ZtSwitch v-model="model.notification" /></ZtFormItem>
      </ZtFormGroup>
      <ZtFormItem label="备注" prop="note"><ZtInput v-model="model.note" /></ZtFormItem>
    </ZtForm>
    <p>分组禁用只控制交互，不会自动排除字段校验；按业务需要调整规则或选择 validateField 的字段集合。</p>
  </div>
</template>
<style scoped>.demo { display: grid; gap: 16px; } .zt-form-group { margin-bottom: 16px; } p { margin: 0; }</style>
