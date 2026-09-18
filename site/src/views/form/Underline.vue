<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import {
  ZtConfigProvider,
  ZtForm,
  ZtFormItem,
  ZtInput,
  ZtPassword,
  ZtInputNumber,
  ZtInputTag,
  ZtInputOtp,
  ZtSelect,
  ZtSelectBox,
  ZtAutocomplete,
  ZtCascader,
  ZtTreeSelect,
  ZtDatePicker,
  ZtDateTimePicker,
  ZtTimePicker,
  ZtTimeSelect,
  ZtMention,
  ZtButton,
  ZtUpload,
  ZtRate,
  ZtSwitch,
  ZtSlider,
  ZtSegmented,
  ZtRadio,
  ZtCheckbox,
  ZtTransfer,
  ZtColorPicker,
} from '@ztechjs/zt-ui';
import type { ZtComponentSize, ZtTheme, ZtFormInstance } from '@ztechjs/zt-ui';
const size = ref<ZtComponentSize>('default');
const theme = ref<ZtTheme>('light');
const radius = ref(16);
const disabled = ref(false);
const form = ref<ZtFormInstance>();
const model = reactive({
  name: '春季经营分析',
  password: '',
  quantity: 12,
  tags: ['华东', '直营'],
  otp: '',
  brands: ['jz', 'im', 'az'],
  box: ['jz', 'im'],
  customer: '',
  region: [],
  department: null,
  date: null,
  datetime: null,
  time: null,
  slot: null,
  mention: '',
  valid: '已通过校验',
  invalid: '',
  rate: 3,
  switch: true,
  slider: 40,
  segment: 'day',
  radio: 'all',
  check: true,
  transfer: [],
  color: '#2563eb',
});
const options = [
  { value: 'jz', label: '玖姿品牌旗舰店' },
  { value: 'im', label: '尹默品牌直营店' },
  { value: 'az', label: '安正品牌加盟店' },
];
const nodes = [
  { key: 'east', label: '华东', children: [{ key: 'hz', label: '杭州' }] },
];
onMounted(() => {
  void form.value?.validateField('valid');
});
</script>

<template>
  <div class="underline-demo">
    <div class="underline-demo__tools">
      <label
        >密度
        <ZtSelect
          v-model="size"
          aria-label="下边框演示密度"
          :options="
            ['mini', 'small', 'default', 'medium', 'large'].map((value) => ({
              value,
              label: value,
            }))
          "
      /></label>
      <label
        >主题
        <ZtSelect
          v-model="theme"
          aria-label="下边框演示主题"
          :options="[
            { value: 'light', label: '浅色' },
            { value: 'dark', label: '深色' },
          ]"
      /></label>
      <ZtSwitch v-model="disabled" active-text="禁用" />
      <ZtButton @click="radius = radius === 0 ? 16 : 0"
        >圆角 {{ radius }}px</ZtButton
      >
    </div>
    <ZtConfigProvider
      :size="size"
      :theme="theme"
      :border-radius="radius"
      class="underline-demo__surface"
    >
      <ZtForm
        underline
        ref="form"
        :model="model"
        :disabled="disabled"
        label-position="top"
        :rules="{ valid: [{ required: true }] }"
      >
        <div class="underline-demo__grid">
          <ZtFormItem label="Input"
            ><ZtInput v-model="model.name" clearable
          /></ZtFormItem>
          <ZtFormItem label="Password"
            ><ZtPassword v-model="model.password" autocomplete="new-password"
          /></ZtFormItem>
          <ZtFormItem label="InputNumber"
            ><ZtInputNumber v-model="model.quantity"
          /></ZtFormItem>
          <ZtFormItem label="InputTag"
            ><ZtInputTag v-model="model.tags" placeholder="输入后按 Enter"
          /></ZtFormItem>
          <ZtFormItem label="InputOtp"
            ><ZtInputOtp v-model="model.otp" :length="4"
          /></ZtFormItem>
          <ZtFormItem label="Select 多选"
            ><ZtSelect
              v-model="model.brands"
              aria-label="下边框多选"
              :options="options"
              multiple
              filterable
              collapse-tags
              clearable
          /></ZtFormItem>
          <ZtFormItem label="SelectBox"
            ><ZtSelectBox
              v-model="model.box"
              :options="options"
              width="100%"
              clearable
          /></ZtFormItem>
          <ZtFormItem label="Autocomplete"
            ><ZtAutocomplete
              v-model="model.customer"
              :options="[{ value: '杭州门店' }, { value: '上海门店' }]"
          /></ZtFormItem>
          <ZtFormItem label="Cascader"
            ><ZtCascader v-model="model.region" :options="nodes" clearable
          /></ZtFormItem>
          <ZtFormItem label="TreeSelect"
            ><ZtTreeSelect v-model="model.department" :data="nodes" clearable
          /></ZtFormItem>
          <ZtFormItem label="DatePicker"
            ><ZtDatePicker v-model="model.date" clearable
          /></ZtFormItem>
          <ZtFormItem label="DateTimePicker"
            ><ZtDateTimePicker v-model="model.datetime" clearable
          /></ZtFormItem>
          <ZtFormItem label="TimePicker"
            ><ZtTimePicker v-model="model.time" clearable
          /></ZtFormItem>
          <ZtFormItem label="TimeSelect"
            ><ZtTimeSelect v-model="model.slot" clearable
          /></ZtFormItem>
          <ZtFormItem label="Mention"
            ><ZtMention
              v-model="model.mention"
              :options="[{ value: '张华' }, { value: '李明' }]"
              placeholder="输入 @ 选择负责人"
          /></ZtFormItem>
          <ZtFormItem label="校验成功" prop="valid"
            ><ZtInput v-model="model.valid"
          /></ZtFormItem>
          <ZtFormItem label="校验错误" prop="invalid" error="请填写完整"
            ><ZtInput v-model="model.invalid" placeholder="请填写完整"
          /></ZtFormItem>
          <ZtFormItem label="独立禁用"
            ><ZtInput model-value="不可编辑" disabled
          /></ZtFormItem>
        </div>
        <h3>紧凑多选：100px / 240px / 100%</h3>
        <div class="underline-demo__widths">
          <ZtSelect
            v-for="width in ['100px', '240px', '100%']"
            :key="width"
            v-model="model.brands"
            :aria-label="`多选宽度 ${width}`"
            :style="{ width, maxWidth: '100%' }"
            :options="options"
            multiple
            collapse-tags
          />
          <ZtSelectBox
            v-for="width in ['100px', '240px', '100%']"
            :key="width"
            v-model="model.box"
            :width="width"
            :style="{ maxWidth: '100%' }"
            :options="options"
          />
        </div>
        <h3>保留原外观的控件</h3>
        <div class="underline-demo__unchanged">
          <ZtButton>Button</ZtButton><ZtUpload :auto-upload="false" /><ZtRate
            v-model="model.rate"
          />
          <ZtSwitch v-model="model.switch" /><ZtSlider v-model="model.slider" />
          <ZtSegmented
            v-model="model.segment"
            :options="[
              { value: 'day', label: '日' },
              { value: 'month', label: '月' },
            ]"
          />
          <ZtRadio v-model="model.radio" value="all">Radio</ZtRadio
          ><ZtCheckbox v-model="model.check">Checkbox</ZtCheckbox>
          <ZtColorPicker v-model="model.color" />
        </div>
        <ZtTransfer
          v-model="model.transfer"
          :data="[
            { key: 'read', label: '查看' },
            { key: 'edit', label: '编辑' },
          ]"
        />
      </ZtForm>
    </ZtConfigProvider>
  </div>
</template>

<style scoped>
.underline-demo {
  width: 100%;
  min-width: 0;
}
.underline-demo__tools {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
}
.underline-demo__tools label {
  display: flex;
  align-items: center;
  gap: 8px;
}
.underline-demo__tools .zt-select {
  width: 110px;
}
.underline-demo__surface {
  padding: 24px;
  color: var(--glass-default-ink);
  background: var(--zt-surface, #fff);
  border: 1px solid var(--zt-border, #dbe2ea);
  border-radius: 12px;
}
.underline-demo__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 24px;
}
.underline-demo__widths {
  display: grid;
  gap: 16px;
  margin-bottom: 28px;
}
.underline-demo__unchanged {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
  margin-bottom: 24px;
}
.underline-demo__unchanged > .zt-slider {
  width: 180px;
}
h3 {
  font-size: 14px;
  margin: 24px 0 18px;
}
@media (max-width: 700px) {
  .underline-demo__grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .underline-demo__surface {
    padding: 16px;
  }
}
</style>
