<script setup lang="ts">
import { ref } from 'vue';
import { ZtTree, type ZtTreeLoader, type ZtTreeNode } from '@ztechjs/zt-ui';
const data: ZtTreeNode[] = [{ id: 'root', name: '区域仓库', leaf: false }];
const load: ZtTreeLoader = async (node) => {
  await new Promise((resolve) => setTimeout(resolve, 350));
  return [
    { id: `${node.id}-east`, name: '华东仓', leaf: true },
    { id: `${node.id}-south`, name: '华南仓', leaf: true },
  ];
};
</script>

<template>
  <div class="demo">
    <ZtTree
      :data="data"
      :fields="{ key: 'id', label: 'name', isLeaf: 'leaf' }"
      :load="load"
      virtual
      :height="220"
    />
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  gap: 16px;
  max-width: 100%;
}
.demo p {
  margin: 0;
}
</style>
