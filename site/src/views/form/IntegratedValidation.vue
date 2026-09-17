<script setup lang="ts">
import { reactive, ref } from 'vue';
import {
  ZtButton,
  ZtCheckbox,
  ZtCheckboxGroup,
  ZtDatePicker,
  ZtDateTimePicker,
  ZtForm,
  ZtFormGroup,
  ZtFormItem,
  ZtInput,
  ZtInputNumber,
  ZtInputOtp,
  ZtPassword,
  ZtRadio,
  ZtRadioGroup,
  ZtSelect,
  ZtSlider,
  ZtSwitch,
  ZtUpload,
  type ZtDatePickerValue,
  type ZtFormInstance,
  type ZtFormRules,
  type ZtSelectOption,
  type ZtUploadFile,
} from '@ztechjs/zt-ui';

const formRef = ref<ZtFormInstance>();
const result = ref('尚未执行完整校验');
const issueCount = ref(0);

const departmentOptions: ZtSelectOption[] = [
  { label: '设计中心', value: 'design' },
  { label: '商品中心', value: 'merchandise' },
  { label: '零售运营', value: 'retail' },
  { label: '数字技术', value: 'technology' },
];

const model = reactive({
  name: '',
  email: '',
  password: '',
  headcount: 0,
  employmentType: '',
  permissions: [] as string[],
  policyAccepted: false,
  completion: 20,
  department: null as string | null,
  startDate: null as ZtDatePickerValue,
  visitWindow: null as ZtDatePickerValue,
  otp: '',
  attachments: [] as ZtUploadFile[],
});

const rules: ZtFormRules = {
  name: [
    { required: true, trigger: 'blur', message: '请输入申请名称' },
    { min: 2, max: 20, trigger: 'change', message: '名称长度为 2 到 20 个字符' },
  ],
  email: [
    { required: true, message: '请输入联系邮箱' },
    { type: 'email', trigger: ['blur', 'change'], message: '请输入正确的邮箱地址' },
  ],
  password: [
    { required: true, trigger: 'blur', message: '请输入操作密码' },
    { min: 8, trigger: 'change', message: '密码至少需要 8 个字符' },
  ],
  headcount: { type: 'number', min: 1, max: 100, message: '人数应在 1 到 100 之间' },
  employmentType: { required: true, message: '请选择用工类型' },
  permissions: { required: true, min: 2, message: '请至少选择两项权限' },
  policyAccepted: {
    validator: (_rule, value) => (value === true ? undefined : '请确认已阅读申请规范'),
  },
  completion: {
    validator: (_rule, value) =>
      typeof value === 'number' && value >= 60 ? undefined : '资料完整度至少达到 60%',
  },
  department: { required: true, message: '请选择归属部门' },
  startDate: { required: true, message: '请选择开始日期' },
  visitWindow: {
    required: true,
    message: '请选择完整的到访时间范围',
    validator: (_rule, value) =>
      Array.isArray(value) && value.length === 2 ? undefined : '请选择完整的到访时间范围',
  },
  otp: [
    { required: true, message: '请输入一次性验证码' },
    { len: 6, pattern: /^\d{6}$/, message: '请输入完整的 6 位数字验证码' },
  ],
  attachments: { required: true, min: 1, message: '请至少选择一个附件' },
};

const coverage = [
  ['Input', '必填 · 长度 · 邮箱'],
  ['Password', '必填 · 最小长度'],
  ['InputNumber', '数值范围'],
  ['Radio', '必选'],
  ['Checkbox', '数组数量'],
  ['Switch', '自定义布尔校验'],
  ['Slider', '自定义阈值'],
  ['Select', '必选'],
  ['DatePicker', '必选'],
  ['DateTimePicker', '范围完整性'],
  ['InputOtp', '长度 · 正则'],
  ['Upload', '附件数量'],
] as const;

async function validateAll() {
  try {
    await formRef.value?.validate();
    issueCount.value = 0;
    result.value = '全部字段校验通过，可以提交业务数据';
  } catch (error) {
    issueCount.value = Object.keys((error ?? {}) as Record<string, unknown>).length;
    result.value = `${issueCount.value} 个字段需要处理，请根据红色提示逐项完善`;
  }
}

function reset() {
  formRef.value?.resetFields();
  issueCount.value = 0;
  result.value = '已恢复初始值，可以重新体验校验流程';
}
</script>

<template>
  <section class="validation-workbench" aria-label="全组件表单校验示例">
    <div class="coverage-panel">
      <div class="coverage-intro">
        <span class="coverage-kicker">VALIDATION MAP</span>
        <strong>12 类控件，13 个真实字段</strong>
        <p>先提交空表单观察全部错误，再逐项填写，比较 blur、change 和自定义校验的触发方式。</p>
      </div>
      <ul class="coverage-list" aria-label="校验规则覆盖清单">
        <li v-for="item in coverage" :key="item[0]">
          <b>{{ item[0] }}</b
          ><span>{{ item[1] }}</span>
        </li>
      </ul>
    </div>

    <ZtForm
      ref="formRef"
      :model="model"
      :rules="rules"
      label-position="top"
      scroll-to-error
      class="validation-form"
    >
      <ZtFormGroup
        title="身份与额度"
        description="演示字符串格式、长度和数值边界校验。"
        bordered
        class="validation-group"
      >
        <div class="field-grid">
          <ZtFormItem label="申请名称" prop="name"
            ><ZtInput v-model="model.name" placeholder="例如：秋季订货会权限申请" clearable
          /></ZtFormItem>
          <ZtFormItem label="联系邮箱" prop="email"
            ><ZtInput v-model="model.email" placeholder="name@example.com" clearable
          /></ZtFormItem>
          <ZtFormItem label="操作密码" prop="password"
            ><ZtPassword v-model="model.password" placeholder="至少 8 个字符"
          /></ZtFormItem>
          <ZtFormItem label="申请人数" prop="headcount"
            ><ZtInputNumber v-model="model.headcount" :min="0" :max="100"
          /></ZtFormItem>
        </div>
      </ZtFormGroup>

      <ZtFormGroup
        title="权限与偏好"
        description="演示单选、多选、开关、滑块和下拉选择的业务规则。"
        bordered
        class="validation-group"
      >
        <div class="field-grid">
          <ZtFormItem label="用工类型" prop="employmentType">
            <ZtRadioGroup v-model="model.employmentType"
              ><ZtRadio label="employee" border>正式员工</ZtRadio
              ><ZtRadio label="partner" border>外部协作</ZtRadio></ZtRadioGroup
            >
          </ZtFormItem>
          <ZtFormItem label="系统权限" prop="permissions">
            <ZtCheckboxGroup v-model="model.permissions" :max="3"
              ><ZtCheckbox value="read">查看数据</ZtCheckbox
              ><ZtCheckbox value="export">导出报表</ZtCheckbox
              ><ZtCheckbox value="approve">审批申请</ZtCheckbox></ZtCheckboxGroup
            >
          </ZtFormItem>
          <ZtFormItem label="申请规范" prop="policyAccepted"
            ><ZtSwitch v-model="model.policyAccepted" active-text="已阅读" inactive-text="未确认"
          /></ZtFormItem>
          <ZtFormItem label="资料完整度" prop="completion"
            ><div class="slider-field">
              <ZtSlider
                v-model="model.completion"
                :min="0"
                :max="100"
                :format-tooltip="(value) => `${value}%`"
                aria-label="资料完整度"
              /><output>{{ model.completion }}%</output>
            </div></ZtFormItem
          >
          <ZtFormItem label="归属部门" prop="department"
            ><ZtSelect
              v-model="model.department"
              :options="departmentOptions"
              placeholder="请选择部门"
              filterable
              clearable
          /></ZtFormItem>
        </div>
      </ZtFormGroup>

      <ZtFormGroup
        title="时间与凭证"
        description="演示日期、日期时间范围、一次性密码和附件数组校验。"
        bordered
        class="validation-group"
      >
        <div class="field-grid">
          <ZtFormItem label="开始日期" prop="startDate"
            ><ZtDatePicker v-model="model.startDate" clearable
          /></ZtFormItem>
          <ZtFormItem label="到访时间" prop="visitWindow"
            ><ZtDateTimePicker v-model="model.visitWindow" range clearable
          /></ZtFormItem>
          <ZtFormItem label="一次性验证码" prop="otp"
            ><ZtInputOtp v-model="model.otp" aria-label="一次性验证码"
          /></ZtFormItem>
          <ZtFormItem label="申请附件" prop="attachments" class="field-span"
            ><ZtUpload
              v-model:file-list="model.attachments"
              :auto-upload="false"
              multiple
              :limit="3"
              ><template #tip>本地校验示例：最多 3 个文件，不执行网络上传。</template></ZtUpload
            ></ZtFormItem
          >
        </div>
      </ZtFormGroup>

      <div class="validation-actions">
        <div>
          <strong>{{ issueCount ? `${issueCount} 项待处理` : '表单校验状态' }}</strong>
          <p role="status" aria-live="polite">{{ result }}</p>
        </div>
        <div class="validation-buttons">
          <ZtButton data-action="reset" @click="reset">重置表单</ZtButton
          ><ZtButton data-action="validate-all" status="primary" @click="validateAll"
            >校验全部字段</ZtButton
          >
        </div>
      </div>
    </ZtForm>
  </section>
</template>

<style scoped>
.validation-workbench {
  width: min(100%, 920px);
}
.coverage-panel {
  display: grid;
  grid-template-columns: minmax(220px, 0.7fr) minmax(0, 1.3fr);
  gap: 22px;
  margin-bottom: 18px;
  padding: 22px;
  border: 1px solid var(--zt-border, #dfe5ec);
  border-radius: var(--zt-radius, 12px);
  background: linear-gradient(135deg, var(--zt-surface, #fff), var(--zt-surface-soft, #f5f7fa));
}
.coverage-intro {
  align-self: center;
}
.coverage-kicker {
  display: block;
  margin-bottom: 8px;
  color: var(--zt-primary, #2563eb);
  font:
    700 11px/1.2 ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  letter-spacing: 0.14em;
}
.coverage-intro strong {
  display: block;
  color: var(--zt-text, #1f2937);
  font-size: 20px;
  line-height: 1.25;
}
.coverage-intro p {
  margin: 9px 0 0;
  color: var(--zt-text-muted, #6b7280);
  font-size: 13px;
  line-height: 1.65;
}
.coverage-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  margin: 0;
  padding: 1px;
  overflow: hidden;
  border-radius: calc(var(--zt-radius, 12px) - 3px);
  background: var(--zt-border, #dfe5ec);
  list-style: none;
}
.coverage-list li {
  display: grid;
  gap: 3px;
  min-width: 0;
  padding: 9px 11px;
  background: var(--zt-surface, #fff);
}
.coverage-list b {
  color: var(--zt-text, #1f2937);
  font:
    650 12px/1.2 ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
}
.coverage-list span {
  overflow: hidden;
  color: var(--zt-text-muted, #6b7280);
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.validation-form {
  display: grid;
  gap: 16px;
}
.validation-group {
  margin: 0;
}
.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 28px;
}
.field-span {
  grid-column: 1 / -1;
}
.slider-field {
  display: grid;
  grid-template-columns: minmax(160px, 1fr) 44px;
  align-items: center;
  gap: 12px;
  min-height: 34px;
}
.slider-field output {
  color: var(--zt-text-muted, #6b7280);
  font:
    650 12px/1 ui-monospace,
    SFMono-Regular,
    Menlo,
    monospace;
  text-align: right;
}
.validation-actions {
  position: sticky;
  bottom: 14px;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 14px 16px;
  border: 1px solid var(--zt-border, #dfe5ec);
  border-radius: var(--zt-radius, 12px);
  background: color-mix(in srgb, var(--zt-surface, #fff) 92%, transparent);
  box-shadow: 0 12px 32px rgba(31, 41, 55, 0.12);
  backdrop-filter: blur(14px);
}
.validation-actions strong {
  display: block;
  color: var(--zt-text, #1f2937);
  font-size: 13px;
}
.validation-actions p {
  margin: 3px 0 0;
  color: var(--zt-text-muted, #6b7280);
  font-size: 12px;
}
.validation-buttons {
  display: flex;
  flex: none;
  gap: 8px;
}
@media (max-width: 720px) {
  .coverage-panel,
  .field-grid {
    grid-template-columns: 1fr;
  }
  .field-span {
    grid-column: auto;
  }
  .validation-actions {
    position: static;
    align-items: stretch;
    flex-direction: column;
  }
  .validation-buttons {
    justify-content: flex-end;
  }
}
@media (max-width: 480px) {
  .coverage-list {
    grid-template-columns: 1fr;
  }
  .validation-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
</style>
