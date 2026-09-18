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
import Zero from './Zero.vue';
import ZeroCode from './Zero.vue?raw';
</script>

<template>
  <div class="component-examples">
    <h3>基础用法</h3>
    <DemoBlock :code="Example01Code" desc="数字超过 max 时显示 max+；show-zero 可显示 0。"
      ><Example01
    /></DemoBlock>
    <h3>尺寸</h3>
    <DemoBlock :code="Example02Code" desc="size 提供 mini、small、default、medium、large 五档尺寸。"
      ><Example02
    /></DemoBlock>
    <h3>小红点</h3>
    <DemoBlock :code="Example03Code" desc="设置 is-dot 以小圆点标注。"><Example03 /></DemoBlock>
    <h3>颜色状态</h3>
    <DemoBlock :code="Example04Code" desc="通过 status 设置徽标颜色。"><Example04 /></DemoBlock>
    <h3>自定义内容</h3>
    <DemoBlock :code="Example05Code" desc="circle 默认为 true，单字符为正圆、多字符扩展为胶囊形且不受全局圆角影响；设为 false 后继承全局圆角。value 也可以是字符串。"><Example05 /></DemoBlock>
    <h3>自定义偏移</h3>
    <DemoBlock :code="Example06Code" desc="offset 使用 [x, y] 控制徽标位置。"
      ><Example06
    /></DemoBlock>
    <h3>隐藏徽标</h3>
    <DemoBlock :code="Example07Code" desc="设置 hidden 隐藏徽标。"><Example07 /></DemoBlock>

    <h3>零值、最大值与截断</h3>
    <DemoBlock :code="ZeroCode" desc=""><Zero /></DemoBlock>
  </div>
</template>

<style scoped>
.badge-row {
  gap: 24px !important;
}
</style>
