<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Controlled from './Controlled.vue';
import ControlledCode from './Controlled.vue?raw';
</script>
<template>
  <div class="doc-section">
    <h1>Tooltip 文字提示</h1>
    <p>简短辅助说明支持悬停、键盘聚焦、延迟和定位；长内容请使用 Popover。</p>
    <h2>方位与键盘触发</h2>
    <DemoBlock :code="BasicCode"><Basic /></DemoBlock>
    <h2>受控显示、延迟与禁用</h2>
    <DemoBlock :code="ControlledCode"><Controlled /></DemoBlock>
  </div>
</template>
