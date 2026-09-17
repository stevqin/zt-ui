<script setup lang="ts">
import { ref } from 'vue';
import { ZtSplitter } from '@ztechjs/zt-ui';
const width = ref(40);
const lastEvent = ref('尚未调整');
</script>
<template>
  <div>
    <p>第一栏 {{ width.toFixed(0) }}% · {{ lastEvent }}</p>
    <ZtSplitter
      v-model="width"
      :min="20"
      :max="75"
      collapsible
      @resize-end="lastEvent = '拖动结束'"
      @collapse="lastEvent = $event ? '已收起' : '已展开'"
      ><template #first
        ><div class="pane">
          目录<br />可拖动或聚焦分隔条使用键盘。
        </div></template
      ><template #second><div class="pane">正文区域</div></template></ZtSplitter
    >
  </div>
</template>
<style scoped>
.pane {
  padding: 20px;
  min-height: 160px;
  box-sizing: border-box;
}
</style>
