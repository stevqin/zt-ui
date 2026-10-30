<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Example01 from './Example01.vue';
import Example01Code from './Example01.vue?raw';
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
import EnhancedForm from './EnhancedForm.vue';
import EnhancedFormCode from './EnhancedForm.vue?raw';
import EnhancedState from './EnhancedState.vue';
import EnhancedStateCode from './EnhancedState.vue?raw';
import EnhancedPresentation from './EnhancedPresentation.vue';
import EnhancedPresentationCode from './EnhancedPresentation.vue?raw';
import EnhancedCanvas from './EnhancedCanvas.vue';
import EnhancedCanvasCode from './EnhancedCanvas.vue?raw';
</script>

<template>
  <div class="component-examples vtable-docs">
    <p class="compat-note">原有 formData、toolbar、summary、editable 和实例方法继续可用。本地数据默认分页，默认高度 480px，操作列默认隐藏，工具栏默认包含刷新。需要全量本地展示时显式设置 localPagination=false。保存事件保持原语义：save-start 表示开始请求，saved 和原有 save 表示保存成功。</p>
    <h3>基础表格</h3>
    <DemoBlock
      :code="Example01Code"
      desc="固定列、格式化、样式、rowKey、tableOptions 和五档 size 均可直接配置。"
      ><Example01
    /></DemoBlock>

    <h3>远程分页与排序</h3>
    <DemoBlock
      :code="Example02Code"
      desc="proxyConfig 统一接收页码、每页条数、排序和查询表单；只应用最后一次请求的结果。"
      ><Example02
    /></DemoBlock>

    <h3>选择与行操作</h3>
    <DemoBlock
      :code="Example03Code"
      desc="支持表头全选、跨页保留、自定义操作、行事件，以及选择相关 Expose 方法和工具栏插槽。"
      ><Example03
    /></DemoBlock>

    <h3>单元格编辑与批量保存</h3>
    <DemoBlock
      :code="Example04Code"
      desc="覆盖 text、textarea、date、number、select、email、url 编辑器；自定义 edit-actions 插槽可调用保存和撤销。"
      ><Example04
    /></DemoBlock>

    <h3>汇总与列设置</h3>
    <DemoBlock
      :code="Example05Code"
      desc="同时演示 sum、avg、count、min、max、自定义计算、copyFormatter、列显隐/排序持久化和全部工具栏事件。"
      ><Example05
    /></DemoBlock>

    <h3>加载、空状态与禁用</h3>
    <DemoBlock
      :code="Example06Code"
      desc="一个示例切换 loading、empty 插槽和 disabled；禁用态会阻止 Canvas 内的选择、排序、编辑和行操作。"
      ><Example06
    /></DemoBlock>

    <h3>实例方法与延迟加载</h3>
    <DemoBlock
      :code="Example07Code"
      desc="autoLoad=false 时由调用方启动查询；下方按钮覆盖 query、reload、resize、setRecords、getTableInstance 和 exportCsv。"
      ><Example07
    /></DemoBlock>
    <h3>配置式表单与本地全量筛选</h3>
    <DemoBlock :code="EnhancedFormCode" desc="配置库内控件、折叠字段和可注入选项加载器，先筛选再展示全部本地记录。"><EnhancedForm /></DemoBlock>

    <h3>整表草稿与通用导入弹窗</h3>
    <DemoBlock :code="EnhancedStateCode" desc="独立原始快照、增删改、保存失败重试、撤销、直接行操作、右键菜单与外部导出入口。"><EnhancedState /></DemoBlock>

    <h3>汇总口径与表格呈现</h3>
    <DemoBlock :code="EnhancedPresentationCode" desc="切换五档尺寸、边框和汇总来源，查看后端字段映射、缺失字段留空与冻结区域内标题合并。"><EnhancedPresentation /></DemoBlock>

    <h3>Canvas 渲染与字段插槽</h3>
    <DemoBlock :code="EnhancedCanvasCode" desc="使用独立 vtable 子入口的标签与文本图元，定制单元格和表头。"><EnhancedCanvas /></DemoBlock>
  </div>
</template>

<style scoped>
.compat-note { margin: 0 0 20px; line-height: 1.8; color: inherit; opacity: .8; }
.example-stack {
  display: grid;
  width: 100%;
  gap: 10px;
}
.example-status {
  min-height: 20px;
  margin: 0;
  color: #536175;
  font-size: 13px;
}
.event-console {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 14px 0 20px;
  padding: 10px 12px;
  border: 1px solid #dce6f7;
  border-radius: 10px;
  color: #52647e;
  background: #f5f8fe;
  font-size: 13px;
}
.event-console strong {
  color: #315fa8;
}
.grid-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  color: #536175;
  font-size: 13px;
}
.grid-search {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.grid-search input {
  min-width: 240px;
  padding: 8px 12px;
  border: 1px solid #d8dee8;
  border-radius: 8px;
  color: #293242;
  background: #fff;
  outline: none;
}
.grid-search input:focus {
  border-color: #3977eb;
  box-shadow: 0 0 0 3px rgb(57 119 235 / 12%);
}
.slot-chip {
  padding: 4px 8px;
  border-radius: 999px;
  color: #315fa8;
  background: #eaf1ff;
  font-size: 12px;
}
.empty-card {
  display: grid;
  gap: 4px;
  justify-items: center;
  color: #64748b;
}
.empty-card strong {
  color: #334155;
}
@media (max-width: 720px) {
  .grid-search input {
    min-width: 0;
    width: 100%;
  }
}
</style>
