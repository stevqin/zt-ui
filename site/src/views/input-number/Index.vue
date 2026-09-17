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
import Methods from './Methods.vue';
import MethodsCode from './Methods.vue?raw';
</script>

<template>
  <div class="doc-section number-doc">
    <h1>InputNumber 数字输入框</h1>
    <p>使用按钮、键盘方向键或直接输入来调整数值。</p>
    <h2>基础用法</h2>
    <DemoBlock :code="Example01Code" desc="使用 v-model 绑定 number 或 null。"
      ><Example01
    /></DemoBlock>
    <h2>范围与步进</h2>
    <DemoBlock :code="Example02Code" desc="min、max 限制范围，step 设置每次增减量。"
      ><Example02
    /></DemoBlock>
    <h2>精度与严格步进</h2>
    <DemoBlock
      :code="Example03Code"
      desc="precision 固定小数位；step-strictly 将输入校准到步进倍数。"
      ><Example03
    /></DemoBlock>
    <h2>控制按钮布局</h2>
    <DemoBlock
      :code="Example04Code"
      desc="default 将按钮分置两侧，left 和 right 将按钮堆叠在指定一侧；也可以完全隐藏。"
      ><Example04
    /></DemoBlock>
    <h2>尺寸</h2>
    <DemoBlock :code="Example05Code" desc="支持 mini、small、default、medium、large 五档尺寸。"
      ><Example05
    /></DemoBlock>
    <h2>禁用与只读</h2>
    <DemoBlock :code="Example06Code" desc="disabled 禁止所有交互，readonly 保留聚焦能力并禁用增减。"
      ><Example06
    /></DemoBlock>

    <h2>事件反馈与实例方法</h2>
    <DemoBlock :code="MethodsCode" desc=""><Methods /></DemoBlock>
  </div>
</template>

<style scoped>
.number-demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}
.number-demo-row > span {
  color: #6b7280;
  font-size: 13px;
}
</style>
