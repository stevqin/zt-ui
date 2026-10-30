<script setup lang="ts">
import "@ztechjs/zt-alert/style.css";
import { onBeforeUnmount, ref } from "vue";
import { ZtLoading, type LoadingInstance } from "@ztechjs/zt-alert";
const result = ref("等待开始");
let instance: LoadingInstance | undefined;
let timer: ReturnType<typeof setTimeout> | undefined;
function reset() {
  clearTimeout(timer);
  void instance?.close();
  instance = undefined;
  result.value = "已结束加载";
}
onBeforeUnmount(reset);

function start() {
  reset();
  instance = ZtLoading.open("正在读取示例数据…");
  result.value = "任务进行中";
  timer = setTimeout(() => {
    instance?.update("已读取数据，正在生成预览…");
    timer = setTimeout(() => {
      void instance?.close();
      instance = undefined;
      result.value = "预览已生成";
    }, 800);
  }, 700);
}
</script>
<template>
  <div class="example-stack">
    <div class="example-row">
      <button @click="start">开始全屏任务</button
      ><button @click="reset">重置</button>
    </div>
    <p role="status">{{ result }}</p>
  </div>
</template>
