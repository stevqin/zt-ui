<script setup lang="ts">
import { reactive, ref } from "vue";
import {
  ZtForm,
  ZtFormItem,
  ZtInput,
  ZtSegmented,
  ZtButton,
  type ZtFormInstance,
  type ZtFormRules,
  type ZtFormLabelPosition,
} from "@ztechjs/zt-ui";
const position = ref<ZtFormLabelPosition>("right");
const positions = [
  { label: "右侧标签", value: "right" },
  { label: "左侧标签", value: "left" },
  { label: "顶部标签", value: "top" },
];
const form = ref<ZtFormInstance>();
const rules: ZtFormRules = {
  name: { required: true, message: "请填写姓名" },
  department: { required: true, message: "请填写所属工作小组" },
};
async function validate() {
  await form.value?.validate().catch(() => undefined);
}
const model = reactive({ name: "", department: "", keyword: "" });
</script>
<template>
  <div class="demo">
    <ZtSegmented
      v-model="position"
      :options="positions"
      aria-label="标签位置"
    />
    <ZtForm
      ref="form"
      :rules="rules"
      :model="model"
      :label-position="position"
      label-width="auto"
      @submit.prevent
      message-display="label"
    >
      <ZtFormItem label="姓名" prop="name"
        ><ZtInput v-model="model.name"
      /></ZtFormItem>
      <ZtFormItem label="所属工作小组" prop="department"
        ><ZtInput v-model="model.department"
      /></ZtFormItem>
      <ZtFormItem label="独立宽度" label-width="100px"
        ><ZtInput placeholder="此项覆盖全局宽度"
      /></ZtFormItem>
    </ZtForm>
    <div class="example-row">
      <ZtButton status="primary" @click="validate">校验横向表单</ZtButton
      ><ZtButton text @click="form?.resetFields()">重置</ZtButton>
    </div>
    <p>
      横向标签的错误说明在控件右侧独立显示，窄行时移到控件上方；提示列预留空间，校验前后控件宽度保持一致。
    </p>
    <p>
      auto 将同一表单的横向标签对齐到最宽标签；数字宽度按 px 处理，也可使用 CSS
      长度。顶部布局不使用标签宽度。
    </p>
    <ZtForm
      :model="model"
      inline
      label-position="left"
      :label-width="64"
      @submit.prevent
      message-display="label"
    >
      <ZtFormItem label="关键字" prop="keyword"
        ><ZtInput v-model="model.keyword" placeholder="行内筛选"
      /></ZtFormItem>
    </ZtForm>
  </div>
</template>
<style scoped>
.demo {
  display: grid;
  gap: 16px;
}
p {
  margin: 0;
}
</style>
