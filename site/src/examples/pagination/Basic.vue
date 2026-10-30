<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtPagination } from '@ztechjs/zt-ui';
const page = ref(1);
const orders = Array.from(
  { length: 23 },
  (_, index) => `订单 ${String(index + 1).padStart(3, '0')}`,
);
const visible = computed(() => orders.slice((page.value - 1) * 5, page.value * 5));
</script>
<template>
  <ul>
    <li v-for="order in visible" :key="order">{{ order }}</li>
  </ul>
  <ZtPagination
    v-model:current-page="page"
    :page-size="5"
    :total="orders.length"
    layout="prev, pager, next, total"
  />
</template>
