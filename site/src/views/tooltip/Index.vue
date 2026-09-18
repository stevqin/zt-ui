<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Controlled from './Controlled.vue';
import ControlledCode from './Controlled.vue?raw';
</script>
<template>
  <div class="component-examples">
    <p>width / height 接受数字（转换为 px）或字符串（CSS 长度）。省略时按内容大小展示，宽度为 max-content 并受视口最大宽度约束；短文本紧凑、长文本换行。显式 width / height 固定外框尺寸，超出视口时受边界约束；指定高度后仅内容区滚动，箭头固定。尺寸与内容变化会重新定位，空间不足自动调整方位。可用键盘聚焦触发器，Escape 关闭提示。</p>
    <h3>方位与键盘触发</h3>
    <DemoBlock :code="BasicCode"><Basic /></DemoBlock>
    <h3>受控显示、延迟与禁用</h3>
    <DemoBlock :code="ControlledCode"><Controlled /></DemoBlock>
  </div>
</template>
