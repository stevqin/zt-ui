<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
import Controlled from './Controlled.vue';
import ControlledCode from './Controlled.vue?raw';
</script>
<template>
  <div class="component-examples">
    <h3>方位与键盘触发</h3>
    <DemoBlock :code="BasicCode"><Basic /></DemoBlock>
    <h3>受控显示、延迟与禁用</h3>
    <DemoBlock :code="ControlledCode"><Controlled /></DemoBlock>
  </div>
</template>
