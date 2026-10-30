<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtSplitter } from '@ztechjs/zt-ui';
const ratio = ref(35);
</script>
<template>
  <p>左栏 {{ Math.round(ratio) }}%</p>
  <ZtSplitter v-model="ratio" :min="20" :max="75" collapsible style="height: 220px">
    <template #first>
      <div class="pane">
        商品目录
        <br />
        秋冬新品
        <br />
        经典系列
      </div>
    </template>
    <template #second><div class="pane">商品详情区域</div></template>
  </ZtSplitter>
</template>
<style scoped>
.pane {
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
  background: #1677ff0d;
}
</style>
