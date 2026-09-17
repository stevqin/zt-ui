<script setup lang="ts">
import { ref } from 'vue';
import { ZtCollapse, ZtCollapseItem } from '@ztechjs/zt-ui';
const single = ref('one');
</script>

<template>
  <ZtCollapse v-model="single" accordion
    ><ZtCollapseItem name="one" title="第一项">第一项内容</ZtCollapseItem
    ><ZtCollapseItem name="two" title="第二项">第二项内容</ZtCollapseItem></ZtCollapse
  >
</template>
