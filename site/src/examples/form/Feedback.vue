<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import {
  ZtForm,
  ZtFormItem,
  ZtInput,
  ZtSelect,
  ZtButton,
  ZtSegmented,
  type ZtFormInstance,
  type ZtFormMessageDisplay,
  type ZtFormRules,
} from "@ztechjs/zt-ui";
const form = ref<ZtFormInstance>();
const mode = ref<ZtFormMessageDisplay>("label");
const options = [
  { label: "标签旁", value: "label" },
  { label: "下方", value: "inline" },
  { label: "浮层", value: "popover" },
  { label: "汇总", value: "summary" },
];
const explanation = computed(
  () =>
    ({
      label: "错误说明与字段标签同行，长消息自动换行，输入区域保持完整。",
      summary: "顶部集中列出错误，点击条目定位字段，适合较长的表单。",
      popover: "聚焦或悬停错误字段时显示详细说明。",
      inline: "错误说明放在字段下方，适合标签在左侧的横向表单。",
      tooltip: "通过错误图标查看详细说明。",
    })[mode.value],
);
const model = reactive<{
  name: string;
  email: string;
  department: string | null;
}>({ name: "", email: "", department: null });
const rules: ZtFormRules = {
  name: { required: true, message: "请填写联系人姓名" },
  email: [
    { required: true, message: "请填写联系邮箱" },
    { type: "email", message: "邮箱格式不正确，例如 name@example.com" },
  ],
  department: { required: true, message: "请选择所属部门" },
};
const departments = [
  { value: "retail", label: "零售运营部" },
  { value: "purchase", label: "商品采购部" },
  { value: "logistics", label: "供应链管理部" },
];
const result = ref("");
async function submit() {
  try {
    await form.value?.validate();
    result.value = "联系人信息已通过校验";
  } catch {
    result.value = "";
  }
}
function reset() {
  form.value?.resetFields();
  result.value = "";
}
</script>
<template>
  <div class="feedback-demo">
    <div class="feedback-demo__settings">
      <span>提示方式</span
      ><ZtSegmented
        v-model="mode"
        :options="options"
        aria-label="校验提示形式"
      />
    </div>
    <p class="feedback-demo__explanation">{{ explanation }}</p>
    <div class="feedback-demo__panel">
      <header>
        <strong>创建业务联系人</strong>
        <p>填写联系信息，用于订单进度与交付通知。</p>
      </header>
      <ZtForm
        ref="form"
        :model="model"
        :rules="rules"
        :message-display="mode"
        label-position="top"
        @submit.prevent="submit"
      >
        <ZtFormItem label="联系人" prop="name"
          ><ZtInput v-model="model.name" placeholder="请输入姓名"
        /></ZtFormItem>
        <ZtFormItem label="联系邮箱" prop="email"
          ><ZtInput v-model="model.email" placeholder="name@example.com"
        /></ZtFormItem>
        <ZtFormItem label="所属部门" prop="department"
          ><ZtSelect
            v-model="model.department"
            :options="departments"
            placeholder="请选择部门"
        /></ZtFormItem>
        <div class="feedback-demo__actions">
          <ZtButton type="submit" status="primary">校验并保存</ZtButton
          ><ZtButton text @click="reset">重置</ZtButton
          ><span v-if="result" role="status">{{ result }}</span>
        </div>
      </ZtForm>
    </div>
  </div>
</template>
<style scoped>
.feedback-demo {
  max-width: 640px;
}
.feedback-demo__settings {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}
.feedback-demo__settings > span {
  font-size: 13px;
  font-weight: 500;
  color: var(--doc-text, #1f2937);
}
.feedback-demo__explanation {
  margin: 12px 0 26px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--doc-muted, #737c8a);
}
.feedback-demo__panel {
  padding: 24px 0 0;
  border-top: 1px solid var(--doc-border, #e5e7eb);
}
.feedback-demo__panel :deep(.zt-select) {
  width: 100%;
}
.feedback-demo__panel header {
  margin-bottom: 24px;
}
.feedback-demo__panel header strong {
  font-size: 16px;
  font-weight: 600;
}
.feedback-demo__panel header p {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--doc-muted, #737c8a);
}
.feedback-demo__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 6px;
}
.feedback-demo__actions > span {
  color: var(--zt-success-ink, #15803d);
  font-size: 12px;
}
@media (max-width: 480px) {
  .feedback-demo__panel {
    padding-top: 20px;
  }
}
</style>
