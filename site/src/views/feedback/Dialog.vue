<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { ZtButton } from '@ztechjs/zt-ui';
import { ZtDialog } from '@ztechjs/zt-alert';
import type { DialogInstance } from '@ztechjs/zt-alert';
import '@ztechjs/zt-alert/style.css';
const result = ref('等待保存报表');
const opened = ref(false);
let dialog: DialogInstance<{ name: string }> | undefined;
let alive = true;
async function open(fullscreen = false) {
  if (opened.value) {
    dialog?.focus();
    return;
  }
  opened.value = true;
  const input = document.createElement('input');
  input.placeholder = '报表名称';
  input.setAttribute('aria-label', '报表名称');
  input.value = '月度经营报表';
  input.style.cssText =
    'box-sizing:border-box;width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:8px;color:#182236;background:white';
  dialog = ZtDialog.open<{ name: string }>({
    title: '编辑报表',
    subtitle: '原生 DOM 表单 · 模拟异步保存',
    width: 640,
    fullscreen,
    showZoom: true,
    showFooter: true,
    confirmText: '保存',
    render(container) {
      const hint = document.createElement('p');
      hint.textContent =
        '输入报表名称。保存期间按钮显示加载，完成后返回业务结果。';
      const tools = document.createElement('button');
      tools.type = 'button';
      tools.textContent = '切换全屏';
      tools.style.marginTop = '16px';
      tools.onclick = () => dialog?.toggleFullscreen();
      container.append(hint, input, tools);
      return () => {
        tools.onclick = null;
        hint.remove();
        input.remove();
        tools.remove();
      };
    },
    async onConfirm(controls) {
      if (!input.value.trim()) {
        input.focus();
        result.value = '请输入报表名称';
        return;
      }
      controls.setConfirmLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 900));
        if (alive) {
          controls.setConfirmLoading(false);
          await controls.close('api', { name: input.value.trim() });
        }
      } finally {
        controls.setConfirmLoading(false);
      }
    },
  });
  const closed = await dialog.closed;
  if (!alive) return;
  opened.value = false;
  result.value = `关闭原因：${closed.reason}；返回值：${JSON.stringify(closed.value) ?? 'undefined'}`;
}
onBeforeUnmount(() => {
  alive = false;
  dialog?.setConfirmLoading(false);
  void dialog?.close('api');
});
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row">
      <ZtButton @click="open()">打开编辑弹窗</ZtButton>
      <ZtButton @click="open(true)">全屏弹窗</ZtButton>
    </div>
    <p class="result" role="status">{{ result }}</p>
    <p>
      标题栏可切换全屏；宽度低于 768px 时默认全屏。确认按钮由业务调用 close()
      关闭；取消、遮罩、Esc 与右上角关闭按钮均可观察关闭原因。
    </p>
  </div>
</template>

<style scoped>
.demo-stack {
  display: grid;
  gap: 14px;
}
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
p {
  margin: 0;
  line-height: 1.7;
}
.result {
  padding: 10px 14px;
  border: 1px solid var(--zt-border, #dce2ed);
  border-radius: 8px;
  overflow-wrap: anywhere;
}
</style>
