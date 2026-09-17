<script setup lang="ts">
import Collapsed from './Collapsed.vue';
import CollapsedCode from './Collapsed.vue?raw';
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
import Methods from './Methods.vue';
import MethodsCode from './Methods.vue?raw';
import Virtual from './Virtual.vue';
import VirtualCode from './Virtual.vue?raw';
</script>

<template>
  <div class="doc-section select-doc">
    <h1>Select 选择器</h1>
    <p>
      从结构化选项中选择一个或多个值，支持本地筛选、远程搜索、键盘操作和业务化插槽。
    </p>

    <h2>基础单选与清空</h2>
    <DemoBlock
      :code="Example01Code"
      desc="使用 v-model 绑定单个值；clearable 允许快速清空当前城市。"
      ><Example01
    /></DemoBlock>

    <h2>多选与可移除标签</h2>
    <DemoBlock
      :code="Example02Code"
      desc="multiple 输出去重后的值数组；配合 filterable 时，搜索框固定在下拉面板顶部，打开后自动聚焦。搜索框内的清空按钮只清除关键词，已选标签保持不变。"
      ><Example02
    /></DemoBlock>

    <h2>折叠已选标签</h2>
    <DemoBlock :code="CollapsedCode" desc="collapse-tags 开启折叠；max-collapse-tags 指定展示数量（默认 1），其余以 +N 展示，已选值保持完整。"><Collapsed /></DemoBlock>

    <h2>本地筛选</h2>
    <DemoBlock
      :code="Example03Code"
      desc="filterable 按选项标签做不区分大小写的本地匹配；选中、关闭或失焦后保留关键词，清空按钮会同时清空选择和关键词。"
      ><Example03
    /></DemoBlock>

    <h2>远程用户搜索</h2>
    <DemoBlock
      :code="Example04Code"
      desc="查询固定等待 900 ms，便于观察加载；选中结果后保留远程搜索词，输入“失败”可稳定触发错误提示。"
      ><Example04
    /></DemoBlock>

    <h2>业务插槽</h2>
    <DemoBlock
      :code="Example05Code"
      desc="prefix、option、selected、tag、empty、loading 和 footer 可承载品牌、区域与权限信息。"
      ><Example05
    /></DemoBlock>

    <h2>禁用状态</h2>
    <DemoBlock
      :code="Example06Code"
      desc="disabled 可锁定整个选择器；单个选项也可按业务状态禁止选择。"
      ><Example06
    /></DemoBlock>

    <h2>五档尺寸</h2>
    <DemoBlock
      :code="Example07Code"
      desc="size 支持 mini、small、default、medium、large，适配不同信息密度。"
      ><Example07
    /></DemoBlock>

    <h2>外部控制与无匹配结果</h2>
    <DemoBlock :code="MethodsCode" desc=""><Methods /></DemoBlock>
    <h2>万级选项虚拟滚动</h2>
    <DemoBlock
      :code="VirtualCode"
      desc="virtual 只挂载可见选项；自定义选项需保持 itemHeight 指定的固定行高。"
      ><Virtual
    /></DemoBlock>
  </div>
</template>

<style scoped>
.select-demo-stack {
  display: grid;
  gap: 10px;
  width: min(100%, 480px);
}
.select-demo-stack > span {
  color: #6b7280;
  font-size: 13px;
}
.select-demo-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.select-size-list {
  display: grid;
  align-items: start;
  gap: 12px;
  width: min(100%, 480px);
}
.slot-label {
  white-space: nowrap;
  color: #475569;
  font-size: 12px;
}
.slot-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}
.slot-option small {
  color: #64748b;
}
.slot-footer {
  color: #64748b;
  font-size: 12px;
}
.slot-tag-remove {
  border: 0;
  padding: 0 2px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}
@media (max-width: 720px) {
  .select-demo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
