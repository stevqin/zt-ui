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

// The icon option accepts an Element (cloned by the service), not Vue VNodes.
// Keep all strokes inside the SVG viewBox so the 30px icon slot stays unclipped.
function createIcon(ready = false) {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "1.8");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");
  icon.setAttribute("aria-hidden", "true");
  icon.style.color = "var(--zt-loading-text-color, currentColor)";
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    ready ? "M5 12.5 9.5 17 19 7" : "M12 4v11m-4-4 4 4 4-4M5 16v4h14v-4",
  );
  icon.append(path);
  return icon;
}

function start(showIcon = true) {
  reset();
  instance = ZtLoading.open({
    text: "正在准备下载…",
    icon: showIcon ? createIcon() : null,
    maskColor: "rgba(20, 30, 50, 0.72)",
  });
  result.value = "下载准备中";
  timer = setTimeout(() => {
    instance?.update({
      text: "下载文件已准备完成",
      icon: showIcon ? createIcon(true) : null,
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
      <button @click="start()">准备下载</button
      ><button @click="start(false)">仅显示加载环</button
      ><button @click="reset">重置</button>
    </div>
    <p class="muted">仅显示加载环时保留旋转指示器，不显示中心图标。</p>
    <p role="status">{{ result }}</p>
  </div>
</template>
