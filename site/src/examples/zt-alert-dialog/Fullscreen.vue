<script setup lang="ts">
import "@ztechjs/zt-alert/style.css";
import { onBeforeUnmount, ref } from "vue";
import { ZtDialog, type DialogInstance } from "@ztechjs/zt-alert";
const result = ref("尚未打开");
const owned = new Set<DialogInstance>();
let timer: ReturnType<typeof setTimeout> | undefined;
function reset() {
  clearTimeout(timer);
  for (const instance of owned)
    void instance.setLoading(false).setConfirmLoading(false).close();
  owned.clear();
  result.value = "已关闭本例浮层";
}
onBeforeUnmount(reset);
function track(instance: DialogInstance) {
  owned.add(instance);
  void instance.closed.then((value) => {
    owned.delete(instance);
    result.value = `关闭原因：${value.reason}`;
  });
}

let current: DialogInstance | undefined;
function open() {
  if (current && owned.has(current)) {
    current.focus();
    return;
  }
  current = ZtDialog.open({
    title: "文档预览",
    render(container, controls) {
      const content = document.createElement("p");
      content.textContent = "预览内容准备完成。";
      const toggleButton = document.createElement("button");
      toggleButton.textContent = "切换全屏";
      const toggle = () => {
        controls.toggleFullscreen?.();
        result.value = "已切换全屏状态";
      };
      const loadButton = document.createElement("button");
      loadButton.textContent = "加载内容";
      const load = () => {
        clearTimeout(timer);
        controls.setLoading(true, "正在重新读取文档…");
        result.value = "正在加载内容";
        timer = setTimeout(() => {
          controls.setLoading(false);
          content.textContent = "已重新读取 3 段示例内容。";
          result.value = "内容加载完成";
          timer = undefined;
        }, 900);
      };
      toggleButton.addEventListener("click", toggle);
      loadButton.addEventListener("click", load);
      container.append(content, toggleButton, loadButton);
      return () => {
        clearTimeout(timer);
        toggleButton.removeEventListener("click", toggle);
        loadButton.removeEventListener("click", load);
      };
    },
    showZoom: true,
    width: 640,
  });
  track(current);
  result.value = "预览已打开";
}
</script>
<template>
  <div class="example-stack">
    <div class="example-row">
      <button @click="open">打开预览</button>
    </div>
    <p role="status">{{ result }}</p>
  </div>
</template>
