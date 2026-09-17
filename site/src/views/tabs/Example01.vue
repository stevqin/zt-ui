<script setup lang="ts">
import { ref } from 'vue';
import { ZtTabPane, ZtTabs } from '@ztechjs/zt-ui';
const active = ref('overview');
</script>

<template>
  <ZtTabs v-model="active"
    ><ZtTabPane name="overview" label="概览">概览内容</ZtTabPane
    ><ZtTabPane name="disabled" label="已禁用" disabled>不可选择</ZtTabPane
    ><ZtTabPane name="detail" label="详情" lazy>详情内容</ZtTabPane></ZtTabs
  >
</template>
