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
import Slots from './Slots.vue';
import SlotsCode from './Slots.vue?raw';
</script>

<template>
  <div class="doc-section password-doc">
    <h1>Password 密码框</h1>
    <p>专门用于密码输入，默认提供可访问的显隐切换按钮。</p>
    <h2>基础用法</h2>
    <DemoBlock :code="Example01Code" desc="点击眼睛图标可切换密码可见状态。"
      ><Example01
    /></DemoBlock>
    <h2>清空与隐藏切换按钮</h2>
    <DemoBlock :code="Example02Code" desc="支持清空，也可以通过 show-toggle 关闭显隐按钮。"
      ><Example02
    /></DemoBlock>
    <h2>校验状态</h2>
    <DemoBlock :code="Example03Code" desc="沿用 Input 的 success、warning 和 error 状态。"
      ><Example03
    /></DemoBlock>
    <h2>尺寸</h2>
    <DemoBlock :code="Example04Code" desc="支持 mini、small、default、medium、large 五档尺寸。"
      ><Example04
    /></DemoBlock>
    <h2>禁用与只读</h2>
    <DemoBlock :code="Example05Code" desc="disabled 会禁用输入与显隐操作，readonly 适合仅查看场景。"
      ><Example05
    /></DemoBlock>

    <h2>组合插槽与字数限制</h2>
    <DemoBlock :code="SlotsCode" desc=""><Slots /></DemoBlock>
  </div>
</template>

<style scoped>
.password-demo {
  display: grid;
  gap: 12px;
  width: min(100%, 440px);
}
</style>
