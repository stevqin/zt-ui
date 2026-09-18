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
  <div class="component-examples input-doc">
    <h3>基础用法</h3>
    <DemoBlock :code="Example01Code" desc="使用 v-model 双向绑定文本。"><Example01 /></DemoBlock>
    <h3>清空与字数限制</h3>
    <DemoBlock
      :code="Example02Code"
      desc="clearable 提供清空按钮；maxlength 配合 show-word-limit 显示字数。"
      ><Example02
    /></DemoBlock>
    <h3>组合插槽</h3>
    <DemoBlock :code="Example03Code" desc="prepend、append、prefix 和 suffix 可组合扩展输入内容。"
      ><Example03
    /></DemoBlock>
    <h3>校验状态</h3>
    <DemoBlock :code="Example04Code" desc="status 提供成功、警告和错误边框反馈。"
      ><Example04
    /></DemoBlock>
    <h3>尺寸</h3>
    <DemoBlock :code="Example05Code" desc="支持 mini、small、default、medium、large 五档尺寸。"
      ><Example05
    /></DemoBlock>
    <h3>禁用与只读</h3>
    <DemoBlock :code="Example06Code" desc="disabled 禁止操作，readonly 保留可聚焦和复制能力。"
      ><Example06
    /></DemoBlock>

    <h3>事件反馈与实例方法</h3>
    <DemoBlock :code="MethodsCode" desc=""><Methods /></DemoBlock>
  </div>
</template>

<style scoped>
.input-demo {
  display: grid;
  gap: 12px;
  width: min(100%, 440px);
}
.input-demo > span {
  color: #6b7280;
  font-size: 13px;
}
</style>
