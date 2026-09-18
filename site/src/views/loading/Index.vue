<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Basic from './Basic.vue';
import BasicCode from './Basic.vue?raw';
</script>
<template>
  <div class="component-examples">
    <h3>区域加载</h3>
    <DemoBlock :code="BasicCode"><Basic /></DemoBlock>
  </div>
</template>
