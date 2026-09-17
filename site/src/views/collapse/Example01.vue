<script setup lang="ts">
import { ref } from 'vue';
import { ZtCollapse, ZtCollapseItem } from '@ztechjs/zt-ui';
const open = ref(['guide']);
</script>

<template>
  <ZtCollapse v-model="open"
    ><ZtCollapseItem name="guide" title="使用说明">默认展开的内容。</ZtCollapseItem
    ><ZtCollapseItem name="api" title="接口约定" lazy>首次打开后再渲染。</ZtCollapseItem
    ><ZtCollapseItem name="disabled" title="不可用" disabled>禁用内容</ZtCollapseItem></ZtCollapse
  >
</template>
