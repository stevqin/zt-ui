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
import NativeForm from './NativeForm.vue';
import NativeFormCode from './NativeForm.vue?raw';
</script>

<template>
  <div class="component-examples">
    <h3>基础用法</h3>
    <p>使用 <code>status</code> 设置颜色状态。</p>
    <DemoBlock
      :code="Example01Code"
      desc="通过 `status` 属性来定义按钮的颜色状态，默认为 `default`。"
      ><Example01
    /></DemoBlock>

    <h3>尺寸</h3>
    <p>提供五种尺寸以适应不同场景。</p>
    <DemoBlock
      :code="Example02Code"
      desc="通过 `size` 属性设置尺寸，可选值：`mini`、`small`、`default`、`medium`、`large`。"
      ><Example02
    /></DemoBlock>

    <h3>圆形按钮</h3>
    <p>设置 <code>circle</code> 属性可得到圆形图标按钮。</p>
    <DemoBlock
      :code="Example03Code"
      desc="第一行：`status` 全色系。第二行：不同 `size` 的圆形按钮。"
      ><Example03
    /></DemoBlock>

    <h3>加载态</h3>
    <p>点击按钮加载数据，显示 loading 状态。</p>
    <DemoBlock
      :code="Example04Code"
      desc="通过 `loading` 属性设置加载状态。使用 `loading-text` 自定义加载文案。"
      ><Example04
    /></DemoBlock>

    <h3>禁用态</h3>
    <DemoBlock :code="Example05Code" desc="通过 `disabled` 属性禁用按钮。"><Example05 /></DemoBlock>

    <h3>原生提交与重置</h3>
    <DemoBlock :code="NativeFormCode" desc=""><NativeForm /></DemoBlock>
  </div>
</template>
