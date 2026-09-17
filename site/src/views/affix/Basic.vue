<script setup lang="ts">
import { ref } from 'vue';
import { ZtAffix, ZtButton } from '@ztechjs/zt-ui';
const panel = ref<HTMLElement>(),
  fixed = ref(false);
</script>
<template>
  <div>
    <p>状态：{{ fixed ? '已固定' : '随内容滚动' }}</p>
    <div ref="panel" class="panel">
      <div class="spacer">向下滚动查看固定效果</div>
      <ZtAffix :container="() => panel" :offset="8" @change="fixed = $event"
        ><div class="toolbar"><ZtButton>筛选条件</ZtButton></div></ZtAffix
      >
      <div class="long">报表内容</div>
    </div>
  </div>
</template>
<style scoped>
.panel {
  height: 260px;
  overflow: auto;
  border: 1px solid #8a9ab044;
}
.spacer {
  height: 100px;
  padding: 16px;
}
.toolbar {
  padding: 8px;
  background: #eff5ff;
  border: 1px solid #adc3ef;
  border-radius: 6px;
}
.long {
  height: 700px;
  padding: 20px;
}
</style>
