<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue';
import Playground from './Playground.vue';
import codePlayground from './Playground.vue?raw';
import Example01 from './Example01.vue';
import Example01Code from './Example01.vue?raw';
import Example03 from './Example03.vue';
import Example03Code from './Example03.vue?raw';
</script>

<template>
  <article class="doc-section">
    <h1>ConfigProvider 全局配置</h1>
    <p>
      为内部组件统一设置尺寸、明暗主题和圆角基准。支持动态切换及嵌套覆盖，不修改页面根节点，也不会影响作用域外的组件。
    </p>
    <h2>基础用法</h2>
    <DemoBlock
      :code="Example01Code"
      desc="在应用根部包裹一次即可；组件上显式设置的 size 优先，包括 default。"
      ><Example01
    /></DemoBlock>
    <h2>动态配置体验</h2>
    <DemoBlock
      :code="codePlayground"
      desc="切换尺寸、主题和圆角后，尝试打开选择器、日期范围、弹窗和抽屉；这些浮层也会继承配置。"
      ><Playground
    /></DemoBlock>
    <h2>嵌套与局部覆盖</h2>
    <DemoBlock
      :code="Example03Code"
      desc="内层 Provider 未设置的属性继续继承父级。显式 light 可在 dark 范围内恢复亮色，0 可创建直角控件。"
      ><Example03
    /></DemoBlock>
    <h2>配置优先级</h2>
    <p>
      组件显式 size 优先，其次为 FormItem / Form 或 RadioGroup / CheckboxGroup
      的尺寸，最后使用最近一层 ConfigProvider。未提供任何配置时保持原有 default 尺寸、light 主题和
      11px 圆角基准。
    </p>
    <p>
      borderRadius
      的单位为像素，各组件按原有圆角比例缩放。圆形按钮、单选圆点、开关滑块和胶囊标签保持其形状。负数或非有限数字忽略并继承父级。
    </p>
    <p>
      Drawer / Modal 的 size 控制密度并传递给内部控件；Drawer 使用 width / height 控制几何尺寸。Icon 使用独立 CSS 长度，Alert 使用固定默认密度。VTableGrid 的原生 theme 若通过
      tableOptions 显式设置，会优先于全局主题。业务自定义插槽中的颜色需自行适配。
    </p>
  </article>
</template>
