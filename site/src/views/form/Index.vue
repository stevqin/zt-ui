<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  ZtButton,
  ZtForm,
  ZtFormGroup,
  ZtFormItem,
  ZtInput,
  ZtInputNumber,
  ZtPassword,
  type ZtFormInstance,
  type ZtFormRules,
} from '@ztechjs/zt-ui'
import DemoBlock from '@/components/DemoBlock.vue'
import { sfc } from '@/utils/exampleCode'
import IntegratedValidation from './IntegratedValidation.vue'
import integratedValidationCode from './IntegratedValidation.vue?raw'

const formRef = ref<ZtFormInstance>()
const submitState = ref('尚未提交')
const account = reactive({ name: '', email: '', password: '', quantity: 1 })
const accountRules: ZtFormRules = {
  name: [
    { required: true, trigger: 'blur', message: '请输入名称' },
    { min: 2, max: 20, trigger: 'change', message: '名称长度为 2 到 20 个字符' },
  ],
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', trigger: ['blur', 'change'], message: '邮箱格式不正确' },
  ],
  password: [
    { required: true, trigger: 'blur', message: '请输入密码' },
    { min: 6, trigger: 'change', message: '密码至少 6 个字符' },
  ],
  quantity: { type: 'number', min: 1, message: '数量至少为 1' },
}
async function submitAccount() {
  try {
    await formRef.value?.validate()
    submitState.value = '校验通过'
  } catch {
    submitState.value = '请修正表单内容'
  }
}
function resetAccount() {
  formRef.value?.resetFields()
  submitState.value = '已重置'
}

const profile = reactive({ firstName: '', lastName: '', city: '杭州', address: '' })
const search = reactive({ keyword: '', limit: 10 })
const invite = reactive({ code: '' })
const inviteRules: ZtFormRules = {
  code: {
    trigger: 'blur',
    validator: async (_rule, value) => {
      await new Promise(resolve => window.setTimeout(resolve, 250))
      return value === 'ZT2026' ? undefined : '邀请码应为 ZT2026'
    },
  },
}

const imports = `import { reactive, ref } from 'vue'\nimport { ZtButton, ZtForm, ZtFormItem, ZtInput, ZtInputNumber, ZtPassword, type ZtFormInstance, type ZtFormRules } from '@ztechjs/zt-ui'`
const codeBasic = sfc(`${imports}\n\nconst formRef = ref<ZtFormInstance>()\nconst model = reactive({ name: '', email: '', password: '', quantity: 1 })\nconst rules: ZtFormRules = {\n  name: [{ required: true, trigger: 'blur', message: '请输入名称' }, { min: 2, max: 20, trigger: 'change', message: '名称长度为 2 到 20 个字符' }],\n  email: [{ required: true, message: '请输入邮箱' }, { type: 'email', trigger: ['blur', 'change'], message: '邮箱格式不正确' }],\n  password: [{ required: true, trigger: 'blur', message: '请输入密码' }, { min: 6, trigger: 'change', message: '密码至少 6 个字符' }],\n  quantity: { type: 'number', min: 1, message: '数量至少为 1' },\n}\nasync function submit() { await formRef.value?.validate() }\nfunction reset() { formRef.value?.resetFields() }`, `<ZtForm ref="formRef" :model="model" :rules="rules" label-width="88px" scroll-to-error>\n  <ZtFormItem label="名称" prop="name"><ZtInput v-model="model.name" name="username" autocomplete="username" clearable /></ZtFormItem>\n  <ZtFormItem label="邮箱" prop="email"><ZtInput v-model="model.email" name="email" autocomplete="email" /></ZtFormItem>\n  <ZtFormItem label="密码" prop="password"><ZtPassword v-model="model.password" name="password" /></ZtFormItem>\n  <ZtFormItem label="数量" prop="quantity"><ZtInputNumber v-model="model.quantity" :min="0" /></ZtFormItem>\n  <ZtFormItem><ZtButton status="primary" @click="submit">提交</ZtButton><ZtButton @click="reset">重置</ZtButton></ZtFormItem>\n</ZtForm>`)
const codeLabels = sfc(`import { reactive } from 'vue'\nimport { ZtForm, ZtFormItem, ZtInput } from '@ztechjs/zt-ui'\n\nconst model = reactive({ name: '' })`, `<ZtForm :model="model" label-position="left" label-width="72px"><ZtFormItem label="左对齐"><ZtInput v-model="model.name" /></ZtFormItem></ZtForm>\n<ZtForm :model="model" label-position="right" label-width="72px"><ZtFormItem label="右对齐"><ZtInput v-model="model.name" /></ZtFormItem></ZtForm>\n<ZtForm :model="model" label-position="top"><ZtFormItem label="顶部标签"><ZtInput v-model="model.name" /></ZtFormItem></ZtForm>`)
const codeInline = sfc(`import { reactive } from 'vue'\nimport { ZtButton, ZtForm, ZtFormItem, ZtInput, ZtInputNumber } from '@ztechjs/zt-ui'\n\nconst filters = reactive({ keyword: '', limit: 10 })`, `<ZtForm :model="filters" inline size="small">\n  <ZtFormItem label="关键词"><ZtInput v-model="filters.keyword" /></ZtFormItem>\n  <ZtFormItem label="数量"><ZtInputNumber v-model="filters.limit" /></ZtFormItem>\n  <ZtFormItem><ZtButton status="primary">查询</ZtButton></ZtFormItem>\n</ZtForm>`)
const codeGroup = sfc(`import { reactive } from 'vue'\nimport { ZtForm, ZtFormGroup, ZtFormItem, ZtInput } from '@ztechjs/zt-ui'\n\nconst profile = reactive({ firstName: '', lastName: '', city: '', address: '' })`, `<ZtForm :model="profile" label-position="top">\n  <ZtFormGroup title="基本信息" description="用于账户展示" bordered>\n    <ZtFormItem label="名字"><ZtInput v-model="profile.firstName" /></ZtFormItem>\n    <ZtFormItem label="姓氏"><ZtInput v-model="profile.lastName" /></ZtFormItem>\n  </ZtFormGroup>\n  <ZtFormGroup title="联系地址" bordered>\n    <ZtFormItem label="城市"><ZtInput v-model="profile.city" /></ZtFormItem>\n    <ZtFormItem label="地址"><ZtInput v-model="profile.address" /></ZtFormItem>\n  </ZtFormGroup>\n</ZtForm>`)
const codeCustom = sfc(`import { reactive } from 'vue'\nimport { ZtForm, ZtFormItem, ZtInput, type ZtFormRules } from '@ztechjs/zt-ui'\n\nconst model = reactive({ code: '' })\nconst rules: ZtFormRules = { code: { trigger: 'blur', validator: async (_rule, value) => { await new Promise(resolve => setTimeout(resolve, 250)); return value === 'ZT2026' ? undefined : '邀请码应为 ZT2026' } } }`, `<ZtForm :model="model" :rules="rules" label-position="top">\n  <ZtFormItem label="邀请码" prop="code"><ZtInput v-model="model.code" placeholder="输入 ZT2026" /></ZtFormItem>\n</ZtForm>`)
const codeSize = sfc(`import { reactive } from 'vue'\nimport { ZtForm, ZtFormItem, ZtInput } from '@ztechjs/zt-ui'\n\nconst model = reactive({ value: '统一尺寸' })`, `<ZtForm :model="model" size="mini"><ZtFormItem label="Mini"><ZtInput v-model="model.value" /></ZtFormItem></ZtForm>\n<ZtForm :model="model" size="small"><ZtFormItem label="Small"><ZtInput v-model="model.value" /></ZtFormItem></ZtForm>\n<ZtForm :model="model" size="default"><ZtFormItem label="Default"><ZtInput v-model="model.value" /></ZtFormItem></ZtForm>\n<ZtForm :model="model" size="medium"><ZtFormItem label="Medium"><ZtInput v-model="model.value" /></ZtFormItem></ZtForm>\n<ZtForm :model="model" size="large" disabled><ZtFormItem label="Large"><ZtInput v-model="model.value" /></ZtFormItem></ZtForm>`)
</script>

<template>
  <div class="doc-section form-doc">
    <h1>Form 表单</h1><p>统一管理输入、选择、日期、验证码和附件字段的布局、校验状态与提交过程；FormGroup 用于组织完整的业务表单。</p>
    <h2>全组件校验场景</h2><DemoBlock :code="integratedValidationCode" desc="覆盖当前全部数据录入组件。点击“校验全部字段”可一次观察 13 个字段的规则、错误定位和提示方式。"><IntegratedValidation /></DemoBlock>
    <h2>基础校验</h2><DemoBlock :code="codeBasic" desc="规则支持 blur、change、内置类型和公开校验方法；错误图标悬停或聚焦时显示 Tooltip。"><ZtForm ref="formRef" :model="account" :rules="accountRules" label-width="88px" scroll-to-error class="form-demo"><ZtFormItem label="名称" prop="name"><ZtInput v-model="account.name" name="username" autocomplete="username" clearable placeholder="请输入名称" /></ZtFormItem><ZtFormItem label="邮箱" prop="email"><ZtInput v-model="account.email" name="email" autocomplete="email" placeholder="name@example.com" /></ZtFormItem><ZtFormItem label="密码" prop="password"><ZtPassword v-model="account.password" name="password" /></ZtFormItem><ZtFormItem label="数量" prop="quantity"><ZtInputNumber v-model="account.quantity" :min="0" /></ZtFormItem><ZtFormItem><div class="form-actions"><ZtButton status="primary" @click="submitAccount">提交</ZtButton><ZtButton @click="resetAccount">重置</ZtButton><span>{{ submitState }}</span></div></ZtFormItem></ZtForm></DemoBlock>
    <h2>标签布局</h2><DemoBlock :code="codeLabels" desc="label-position 支持 left、right 和 top。"><div class="form-layout-grid"><ZtForm :model="profile" label-position="left" label-width="72px"><ZtFormItem label="左对齐"><ZtInput v-model="profile.firstName" /></ZtFormItem></ZtForm><ZtForm :model="profile" label-position="right" label-width="72px"><ZtFormItem label="右对齐"><ZtInput v-model="profile.lastName" /></ZtFormItem></ZtForm><ZtForm :model="profile" label-position="top"><ZtFormItem label="顶部标签"><ZtInput v-model="profile.city" /></ZtFormItem></ZtForm></div></DemoBlock>
    <h2>行内表单</h2><DemoBlock :code="codeInline" desc="inline 适合筛选栏和紧凑操作区。"><ZtForm :model="search" inline size="small"><ZtFormItem label="关键词"><ZtInput v-model="search.keyword" placeholder="商品名称" /></ZtFormItem><ZtFormItem label="数量"><ZtInputNumber v-model="search.limit" /></ZtFormItem><ZtFormItem><ZtButton status="primary">查询</ZtButton></ZtFormItem></ZtForm></DemoBlock>
    <h2>表单分组</h2><DemoBlock :code="codeGroup" desc="ZtFormGroup 使用 fieldset/legend 组织区块，不改变字段校验规则。"><ZtForm :model="profile" label-position="top" class="form-group-grid"><ZtFormGroup title="基本信息" description="用于账户展示" bordered><ZtFormItem label="名字"><ZtInput v-model="profile.firstName" /></ZtFormItem><ZtFormItem label="姓氏"><ZtInput v-model="profile.lastName" /></ZtFormItem></ZtFormGroup><ZtFormGroup title="联系地址" bordered><ZtFormItem label="城市"><ZtInput v-model="profile.city" /></ZtFormItem><ZtFormItem label="地址"><ZtInput v-model="profile.address" /></ZtFormItem></ZtFormGroup></ZtForm></DemoBlock>
    <h2>异步自定义校验</h2><DemoBlock :code="codeCustom" desc="validator 可返回 Promise、字符串、Error、boolean 或空值。"><ZtForm :model="invite" :rules="inviteRules" label-position="top" class="form-demo"><ZtFormItem label="邀请码" prop="code"><ZtInput v-model="invite.code" placeholder="输入 ZT2026 后移出焦点" /></ZtFormItem></ZtForm></DemoBlock>
    <h2>尺寸与整体禁用</h2><DemoBlock :code="codeSize" desc="Form 的 size 和 disabled 自动传递给输入控件。"><div class="form-size-grid"><ZtForm v-for="size in ['mini', 'small', 'default', 'medium', 'large'] as const" :key="size" :model="profile" :size="size" :disabled="size === 'large'"><ZtFormItem :label="size"><ZtInput v-model="profile.city" /></ZtFormItem></ZtForm></div></DemoBlock>

    </div>
</template>

<style scoped>
.form-demo { width: min(100%, 520px); }
.form-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.form-actions span { color: #6b7280; font-size: 12px; }
.form-layout-grid, .form-size-grid { display: grid; gap: 12px; width: min(100%, 520px); }
.form-group-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
@media (max-width: 720px) { .form-group-grid { grid-template-columns: 1fr; } }
</style>
