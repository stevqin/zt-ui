<script setup lang="ts">
import Underline from './Underline.vue';
import UnderlineCode from './Underline.vue?raw';
import DemoBlock from '@/components/DemoBlock.vue';
import IntegratedValidation from './IntegratedValidation.vue';
import integratedValidationCode from './IntegratedValidation.vue?raw';
import Example02 from './Example02.vue';
import Example02Code from './Example02.vue?raw';
import Example03 from './Example03.vue';
import Example03Code from './Example03.vue?raw';
import Example04 from './Example04.vue';
import Example04Code from './Example04.vue?raw';
import Example05 from './Example05.vue';
import Example05Code from './Example05.vue?raw';
import Example06 from './Example06.vue';
import Example06Code from './Example06.vue?raw';
import Example07 from './Example07.vue';
import Example07Code from './Example07.vue?raw';
import FieldControl from './FieldControl.vue';
import FieldControlCode from './FieldControl.vue?raw';
import ExpandedControls from './ExpandedControls.vue';
import ExpandedControlsCode from './ExpandedControls.vue?raw';
</script>

<template>
  <div class="component-examples form-doc">
    <h3>全组件校验场景</h3>
    <DemoBlock
      :code="integratedValidationCode"
      desc="覆盖当前全部数据录入组件。点击“校验全部字段”可一次观察 13 个字段的规则、错误定位和提示方式。"
      ><IntegratedValidation
    /></DemoBlock>
    <h3>下边框表单</h3>
    <p>在 Form 设置 underline 即可统一启用下边框外观。适用于文本、选择、日期时间控件；Button、Upload、Rate、Switch、Slider、Segmented、Radio、Checkbox、Transfer、ColorPicker 保持原样。嵌套 Form 独立控制外观，弹出面板内的辅助控件保持原有边框。</p>
    <DemoBlock :code="UnderlineCode" desc="切换五档密度、浅深主题、圆角和禁用状态。Select / InputTag 使用柔和无边框标签，SelectBox 保留逗号摘要。"><Underline /></DemoBlock>
    <h3>基础校验</h3>
    <DemoBlock
      :code="Example02Code"
      desc="规则支持 blur、change、内置类型和公开校验方法；错误图标悬停或聚焦时显示 Tooltip。"
      ><Example02
    /></DemoBlock>
    <h3>标签布局</h3>
    <DemoBlock
      :code="Example03Code"
      desc="label-position 支持 left、right 和 top。"
      ><Example03
    /></DemoBlock>
    <h3>行内表单</h3>
    <DemoBlock :code="Example04Code" desc="inline 适合筛选栏和紧凑操作区。"
      ><Example04
    /></DemoBlock>
    <h3>表单分组</h3>
    <DemoBlock
      :code="Example05Code"
      desc="ZtFormGroup 使用 fieldset/legend 组织区块，不改变字段校验规则。"
      ><Example05
    /></DemoBlock>
    <h3>异步自定义校验</h3>
    <DemoBlock
      :code="Example06Code"
      desc="validator 可返回 Promise、字符串、Error、boolean 或空值。"
      ><Example06
    /></DemoBlock>
    <h3>尺寸与整体禁用</h3>
    <DemoBlock
      :code="Example07Code"
      desc="Form 的 size 和 disabled 自动传递给输入控件。"
      ><Example07
    /></DemoBlock>

    <h3>字段级规则、外部错误与实例方法</h3>
    <DemoBlock :code="FieldControlCode" desc=""><FieldControl /></DemoBlock>
    <h3>扩展表单组件统一校验</h3>
    <DemoBlock :code="ExpandedControlsCode"><ExpandedControls /></DemoBlock>
  </div>
</template>

<style scoped>
.form-demo {
  width: min(100%, 520px);
}
.form-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
.form-actions span {
  color: #6b7280;
  font-size: 12px;
}
.form-layout-grid,
.form-size-grid {
  display: grid;
  gap: 12px;
  width: min(100%, 520px);
}
.form-group-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
@media (max-width: 720px) {
  .form-group-grid {
    grid-template-columns: 1fr;
  }
}
</style>
