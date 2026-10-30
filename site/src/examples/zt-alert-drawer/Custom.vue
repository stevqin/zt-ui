<script setup lang="ts">
import "@ztechjs/zt-alert/style.css";
import { onBeforeUnmount, ref } from "vue";
import { ZtDrawer, type DrawerInstance } from "@ztechjs/zt-alert";
const result = ref("尚未打开");
const owned = new Set<DrawerInstance>();
function reset() {
  for (const timer of timers) clearTimeout(timer);
  timers.clear();
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

const timers = new Set<ReturnType<typeof setTimeout>>();
onBeforeUnmount(() => {
  for (const timer of timers) clearTimeout(timer);
  timers.clear();
});
function open() {
  let title = "示例草稿";
  const instance = ZtDrawer.open({
    title: "编辑草稿",
    showFooter: true,
    showCancelButton: true,
    maskClosable: false,
    render(container) {
      const label = document.createElement("label");
      label.textContent = "草稿名称 ";
      const input = document.createElement("input");
      input.value = title;
      const change = () => {
        title = input.value;
      };
      input.addEventListener("input", change);
      label.append(input);
      container.append(label);
      return () => {
        input.removeEventListener("input", change);
        label.remove();
      };
    },
    async onConfirm(controls) {
      controls.setConfirmLoading(true);
      await new Promise<void>((resolve) => {
        const timer = setTimeout(() => {
          timers.delete(timer);
          resolve();
        }, 600);
        timers.add(timer);
      });
      result.value = `已保存：${title}`;
      controls.setConfirmLoading(false);
      await controls.close("close", title);
      await instance.closed;
      result.value = `已保存：${title}`;
    },
  });
  track(instance);
  result.value = "请输入名称后确认";
}
</script>
<template>
  <div class="example-stack">
    <div class="example-row">
      <button @click="open">编辑草稿</button
      ><button @click="reset">重置</button>
    </div>
    <p role="status">{{ result }}</p>
  </div>
</template>
