<script setup lang="ts">
import DemoBlock from '@/components/DemoBlock.vue';
import Example01 from './Example01.vue';
import Example01Code from './Example01.vue?raw';
import Directions from './Directions.vue';
import DirectionsCode from './Directions.vue?raw';
</script>

<template>
  <div class="component-examples">
    <h3>带边框的详情</h3>
    <DemoBlock :code="Example01Code"><Example01 /></DemoBlock>
    <h3>布局、列数与标签插槽</h3>
    <DemoBlock :code="DirectionsCode" desc=""><Directions /></DemoBlock>
  </div>
</template>
