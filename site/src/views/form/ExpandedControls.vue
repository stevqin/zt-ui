<script setup lang="ts">
import { reactive, ref } from 'vue';
import {
  ZtForm,
  ZtFormItem,
  ZtButton,
  ZtSwitch,
  ZtAutocomplete,
  ZtInputTag,
  ZtMention,
  ZtCascader,
  ZtTreeSelect,
  ZtTransfer,
  ZtRate,
  ZtTimeSelect,
  ZtTimePicker,
  ZtColorPicker,
} from '@ztechjs/zt-ui';
import type {
  ZtFormRules,
  ZtCascaderValue,
  ZtTreeSelectValue,
  ZtTimePickerValue,
} from '@ztechjs/zt-ui';
const form = ref<InstanceType<typeof ZtForm>>();
const disabled = ref(false),
  result = ref('请填写后提交，也可以直接提交查看校验效果。');
const model = reactive({
  customer: '',
  tags: [] as string[],
  description: '',
  region: [] as ZtCascaderValue,
  department: null as ZtTreeSelectValue,
  permissions: [] as (string | number)[],
  score: 0,
  appointment: null as string | null,
  time: null as ZtTimePickerValue,
  color: '',
});
const departments = [
  {
    key: 'design',
    label: '设计部',
    children: [
      { key: 'visual', label: '视觉组' },
      { key: 'product', label: '产品组' },
    ],
  },
  { key: 'operations', label: '运营部' },
];
const required = {
  required: true,
  message: '请完成此项',
  trigger: 'change' as const,
};
const rules: ZtFormRules = {
  customer: [required],
  tags: [required],
  description: [required],
  region: [required],
  department: [required],
  permissions: [required],
  score: [
    {
      validator: (_rule, value) => Number(value) > 0 || '请至少选择半星评分',
      trigger: 'change',
    },
  ],
  appointment: [required],
  time: [required],
  color: [required],
};
async function submit() {
  try {
    await form.value?.validate();
    result.value = '校验通过，可将 model 交给业务接口。';
  } catch {
    result.value = '校验未通过，请检查各字段提示。';
  }
}
function reset() {
  form.value?.resetFields();
  result.value = '已恢复初始值并清理校验。';
}
</script>
<template>
  <div class="expanded-form">
    <ZtSwitch v-model="disabled" active-text="整体禁用" /><ZtForm
      ref="form"
      :model="model"
      :rules="rules"
      :disabled="disabled"
      label-position="top"
      ><div class="expanded-form__grid">
        <ZtFormItem label="客户自动补全" prop="customer"
          ><ZtAutocomplete
            v-model="model.customer"
            :options="[{ value: '杭州门店' }, { value: '上海门店' }]"
            placeholder="输入门店名称"
            clearable /></ZtFormItem
        ><ZtFormItem label="业务标签" prop="tags"
          ><ZtInputTag
            v-model="model.tags"
            placeholder="输入后按 Enter"
            :max="4" /></ZtFormItem
        ><ZtFormItem label="负责人说明" prop="description"
          ><ZtMention
            v-model="model.description"
            :options="[{ value: '李明' }, { value: '王芳' }]"
            placeholder="输入 @ 选择负责人" /></ZtFormItem
        ><ZtFormItem label="区域级联" prop="region"
          ><ZtCascader
            v-model="model.region"
            :options="[
              {
                key: 'zhejiang',
                label: '浙江',
                children: [{ key: 'hangzhou', label: '杭州' }],
              },
            ]"
            clearable /></ZtFormItem
        ><ZtFormItem label="部门树选择" prop="department"
          ><ZtTreeSelect
            v-model="model.department"
            :data="departments"
            clearable /></ZtFormItem
        ><ZtFormItem label="满意度" prop="score"
          ><ZtRate v-model="model.score" allow-half clearable /></ZtFormItem
        ><ZtFormItem label="预约时段" prop="appointment"
          ><ZtTimeSelect
            v-model="model.appointment"
            start="09:00"
            end="18:00"
            step="00:30"
            clearable /></ZtFormItem
        ><ZtFormItem label="开始时间" prop="time"
          ><ZtTimePicker v-model="model.time" clearable /></ZtFormItem
        ><ZtFormItem label="标记颜色" prop="color"
          ><ZtColorPicker
            v-model="model.color"
            :presets="['#245edb', '#16a34a', '#e11d48']"
            clearable
        /></ZtFormItem>
      </div>
      <ZtFormItem label="权限分配" prop="permissions"
        ><ZtTransfer
          v-model="model.permissions"
          :data="[
            { key: 'read', label: '查看' },
            { key: 'edit', label: '编辑' },
            { key: 'export', label: '导出' },
          ]"
          filterable
      /></ZtFormItem>
      <div class="expanded-form__actions">
        <ZtButton type="button" :disabled="disabled" @click="submit"
          >校验全部字段</ZtButton
        ><ZtButton type="button" @click="reset">重置</ZtButton>
      </div></ZtForm
    >
    <p role="status">{{ result }}</p>
  </div>
</template>
<style scoped>
.expanded-form {
  display: grid;
  gap: 18px;
  max-width: 880px;
}
.expanded-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 20px;
}
.expanded-form__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
@media (max-width: 600px) {
  .expanded-form__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
