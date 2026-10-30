<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtPagination } from '@ztechjs/zt-ui';
const page = ref(1),
  pageSize = ref(10);
</script>
<template>
  <ZtPagination
    v-model:current-page="page"
    v-model:page-size="pageSize"
    :page-sizes="[10, 20, 50]"
    :total="1268"
    layout="total, sizes, prev, pager, next, jumper"
    background
    @size-change="page = 1"
  />
  <p>查询参数：page={{ page }}，page_size={{ pageSize }}</p>
</template>
