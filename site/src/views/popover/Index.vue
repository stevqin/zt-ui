<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Example01 from './Example01.vue';
import Example01Code from './Example01.vue?raw';
import Example02 from './Example02.vue';
import Example02Code from './Example02.vue?raw';
import Example03 from './Example03.vue';
import Example03Code from './Example03.vue?raw';
import Placement from './Placement.vue';
import PlacementCode from './Placement.vue?raw';
</script>

<template>
  <div class="component-examples">
    <p>默认宽高随内容自然展开，仅在超过视口可用空间时换行或滚动。width / height 的数字值转换为 px，字符串作为 CSS 长度；显式设置后固定对应维度，未设置的另一维继续自适应。尺寸或内容变化会自动重新定位。</p>
    <h3>基础用法</h3>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h3>触发方式</h3>
    <DemoBlock :code="Example02Code"><Example02 /></DemoBlock>
    <h3>手动控制</h3>
    <DemoBlock :code="Example03Code"><Example03 /></DemoBlock>
    <h3>方位、箭头与禁用</h3>
    <DemoBlock :code="PlacementCode" desc=""><Placement /></DemoBlock>
  </div>
</template>

<style scoped>
.popover-row {
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
}
</style>
