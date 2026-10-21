<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import TemplateColumns from './TemplateColumns.vue';
import TemplateColumnsCode from './TemplateColumns.vue?raw';
import TemplateSelection from './TemplateSelection.vue';
import TemplateSelectionCode from './TemplateSelection.vue?raw';
import TemplateRadio from './TemplateRadio.vue';
import TemplateRadioCode from './TemplateRadio.vue?raw';
import TemplateExpansion from './TemplateExpansion.vue';
import TemplateExpansionCode from './TemplateExpansion.vue?raw';
import Appearance from './Appearance.vue';
import AppearanceCode from './Appearance.vue?raw';
import Sorting from './Sorting.vue';
import SortingCode from './Sorting.vue?raw';
import SingleSelection from './SingleSelection.vue';
import SingleSelectionCode from './SingleSelection.vue?raw';
import Selection from './Selection.vue';
import SelectionCode from './Selection.vue?raw';
import Expansion from './Expansion.vue';
import ExpansionCode from './Expansion.vue?raw';
import Advanced from './Advanced.vue';
import AdvancedCode from './Advanced.vue?raw';
import Resizable from './Resizable.vue';
import ResizableCode from './Resizable.vue?raw';
import Remote from './Remote.vue';
import RemoteCode from './Remote.vue?raw';
import States from './States.vue';
import StatesCode from './States.vue?raw';
import Slots from './Slots.vue';
import SlotsCode from './Slots.vue?raw';
</script>
<template>
  <div class="component-examples">
    <h3>columns 配置数组与格式化</h3>
    <DemoBlock
      :code="BasicCode"
      desc="通过 data 与 columns 定义表格，formatter 处理展示值。"
      ><Basic
    /></DemoBlock>
    <h3>ZtTableColumn 模板列与作用域插槽</h3>
    <DemoBlock
      :code="TemplateColumnsCode"
      desc="用模板声明动态列，组合表头、单元格和操作插槽，支持排序、固定列与调宽。"
      ><TemplateColumns
    /></DemoBlock>
    <h3>模板工具列：复选与全选</h3>
    <DemoBlock
      :code="TemplateSelectionCode"
      desc="type=selection 声明复选列，复用受控选择、半选与禁用行。"
      ><TemplateSelection
    /></DemoBlock>
    <h3>模板工具列：单选</h3>
    <DemoBlock
      :code="TemplateRadioCode"
      desc="type=radio 声明单选列，使用 ZtRadio 选择默认门店。"
      ><TemplateRadio
    /></DemoBlock>
    <h3>模板工具列：展开与行详情</h3>
    <DemoBlock
      :code="TemplateExpansionCode"
      desc="type=expand 声明展开列，默认插槽直接提供行详情，列顺序与模板一致。"
      ><TemplateExpansion
    /></DemoBlock>
    <h3>边框、斑马纹与五档尺寸</h3>
    <DemoBlock
      :code="AppearanceCode"
      desc="切换五档尺寸，表头排序图标随文字与行密度同步缩放。"
      ><Appearance
    /></DemoBlock>
    <h3>本地排序与三态反馈</h3>
    <DemoBlock
      :code="SortingCode"
      desc="对比未排序、升序和降序，支持点击表头与外部控制。"
      ><Sorting
    /></DemoBlock>
    <h3>行选择、全选与禁用行</h3>
    <DemoBlock
      :code="SelectionCode"
      desc="通过 selected-keys 读取、设置和清空选择；selectable 约束可选行。"
      ><Selection
    /></DemoBlock>
    <h3>单选与默认门店</h3>
    <DemoBlock
      :code="SingleSelectionCode"
      desc="selection-type=radio 使用库内单选组件，受控选择一行，支持禁用与清空。"
      ><SingleSelection
    /></DemoBlock>
    <h3>展开行与详情内容</h3>
    <DemoBlock
      :code="ExpansionCode"
      desc="展开插槽与受控 expanded-keys，可从表格外部展开或收起。"
      ><Expansion
    /></DemoBlock>
    <h3>固定表头与左右固定列</h3>
    <DemoBlock
      :code="AdvancedCode"
      desc="横向查看宽表，纵向滚动时保持表头，左右关键列始终可见。"
      ><Advanced
    /></DemoBlock>
    <h3>拖动调整列宽</h3>
    <DemoBlock
      :code="ResizableCode"
      desc="拖动列边框或使用方向键调宽，支持最小宽度、锁定列与调宽事件。"
      ><Resizable
    /></DemoBlock>
    <h3>服务端排序与加载反馈</h3>
    <DemoBlock
      :code="RemoteCode"
      desc="模拟异步接口：Table 发出排序事件，由调用方更新结果。"
      ><Remote
    /></DemoBlock>
    <h3>加载、空状态与暗色主题</h3>
    <DemoBlock
      :code="StatesCode"
      desc="独立查看加载、默认空数据、自定义空状态和局部主题。"
      ><States
    /></DemoBlock>
    <h3>自定义表头、单元格与操作列</h3>
    <DemoBlock
      :code="SlotsCode"
      desc="用具名插槽组合门店信息、金额、状态标签和操作按钮。"
      ><Slots
    /></DemoBlock>
  </div>
</template>
