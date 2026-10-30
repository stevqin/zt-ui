<script setup lang="ts">
import { ref, computed } from 'vue';
import { ZtSplitter } from '@ztechjs/zt-ui';
const ratio = ref(55);
</script>
<template>
  <ZtSplitter
    v-model="ratio"
    direction="vertical"
    :min="25"
    :max="80"
    :step="2"
    label="调整编辑区高度"
    style="height: 300px"
  >
    <template #first>
      <div class="pane">
        查询编辑区
        <br />
        SELECT * FROM orders
      </div>
    </template>
    <template #second><div class="pane">查询结果：128 条记录</div></template>
  </ZtSplitter>
</template>
<style scoped>
.pane {
  padding: 20px;
  background: #8881;
  height: 100%;
  box-sizing: border-box;
}
</style>
