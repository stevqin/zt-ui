<script setup lang="ts">
import "@ztechjs/zt-alert/style.css";
import { onBeforeUnmount, ref } from "vue";
import { ZtDrawer, type DrawerInstance } from "@ztechjs/zt-alert";
const result = ref("尚未打开");
const owned = new Set<DrawerInstance>();
function reset() {
  for (const instance of owned)
    void instance.setLoading(false).setConfirmLoading(false).close();
  owned.clear();
  result.value = "已关闭本例浮层";
}
onBeforeUnmount(reset);
function track(instance: DrawerInstance) {
  owned.add(instance);
  void instance.closed.then((value) => {
    owned.delete(instance);
    result.value = `关闭原因：${value.reason}`;
  });
}

let current: DrawerInstance | undefined;
function open() {
  if (current && owned.has(current)) {
    current.focus();
    return;
  }
  current = ZtDrawer.open({
    title: "示例详情",
    render(container, controls) {
      const content = document.createElement("p");
      content.textContent = "这是用于演示的草稿详情。";
      const updateButton = document.createElement("button");
      updateButton.textContent = "更新内容";
      const update = () => {
        controls.update({ title: "已更新详情" });
        content.textContent = "草稿内容已更新。";
        result.value = "内容已更新";
      };
      const closeButton = document.createElement("button");
      closeButton.textContent = "关闭详情";
      const close = () => {
        void controls.close();
      };
      updateButton.addEventListener("click", update);
      closeButton.addEventListener("click", close);
      container.append(content, updateButton, closeButton);
      return () => {
        updateButton.removeEventListener("click", update);
        closeButton.removeEventListener("click", close);
      };
    },
    showFooter: true,
    showCancelButton: true,
    onConfirm(controls) {
      void controls.close("close", "accepted");
    },
  });
  track(current);
  result.value = "详情已打开";
}
</script>
<template>
  <div class="example-stack">
    <div class="example-row">
      <button @click="open">打开详情</button>
    </div>
    <p role="status">{{ result }}</p>
  </div>
</template>
