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
  const icon = document.createElement("span");
  icon.textContent = "◈";
  icon.style.fontSize = "32px";
  instance = ZtLoading.open({
    text: "正在准备下载…",
    icon,
    maskColor: "rgba(20, 30, 50, 0.72)",
  });
  result.value = "下载准备中";
  timer = setTimeout(() => {
    instance?.update({
      text: "下载文件已准备完成",
      icon: null,
      maskColor: "rgba(20, 30, 50, 0.5)",
    });
    timer = setTimeout(() => {
      void instance?.close();
      instance = undefined;
      result.value = "可以下载示例文件";
    }, 800);
  }, 700);
}
</script>
<template>
  <div class="example-stack">
    <div class="example-row">
      <button @click="start">准备下载</button
      ><button @click="reset">重置</button>
    </div>
    <p role="status">{{ result }}</p>
  </div>
</template>
