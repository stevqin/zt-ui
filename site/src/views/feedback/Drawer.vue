<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { ZtButton } from '@ztechjs/zt-ui';
import { ZtDrawer, ZtMessageBox } from '@ztechjs/zt-alert';
import type { DrawerInstance } from '@ztechjs/zt-alert';
import '@ztechjs/zt-alert/style.css';
const result = ref('尚未应用筛选');
const opened = ref(false);
let drawer: DrawerInstance<{ keyword: string }> | undefined;
let asking = false;
let alive = true;
async function open() {
  if (opened.value) {
    drawer?.focus();
    return;
  }
  opened.value = true;
  let dirty = false;
  const input = document.createElement('input');
  input.setAttribute('aria-label', '门店关键词');
  input.placeholder = '输入门店关键词后尝试关闭';
  input.style.cssText =
    'box-sizing:border-box;width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:8px;color:#182236;background:white';
  const markDirty = () => {
    dirty = true;
  };
  drawer = ZtDrawer.open<{ keyword: string }>({
    title: '门店筛选',
    subtitle: '右侧抽屉 · 未保存关闭拦截',
    width: 520,
    showFooter: true,
    confirmText: '应用筛选',
    bodyPadding: 24,
    render(container) {
      const hint = document.createElement('p');
      hint.textContent = '修改关键词后关闭抽屉，会先弹出放弃修改确认框。';
      input.addEventListener('input', markDirty);
      container.append(hint, input);
      return () => {
        input.removeEventListener('input', markDirty);
        hint.remove();
        input.remove();
      };
    },
    async beforeClose(reason) {
      if (!alive || reason === 'api' || !dirty) return true;
      asking = true;
      try {
        return await ZtMessageBox.confirm({
          title: '放弃未应用的筛选？',
          text: '取消后继续编辑。',
          icon: 'warning',
        });
      } finally {
        asking = false;
      }
    },
    onConfirm: (controls) => {
      void controls.close('api', { keyword: input.value });
    },
  });
  const closed = await drawer.closed;
  if (!alive) return;
  opened.value = false;
  result.value = `关闭原因：${closed.reason}；筛选结果：${JSON.stringify(closed.value) ?? 'undefined'}`;
}
onBeforeUnmount(() => {
  alive = false;
  if (asking) ZtMessageBox.close();
  void drawer?.close('api');
});
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row"><ZtButton @click="open">打开筛选抽屉</ZtButton></div>
    <p class="result" role="status">{{ result }}</p>
    <p>
      抽屉固定从右侧弹性滑入。输入后尝试取消、Esc、遮罩或关闭按钮，观察
      beforeClose 异步拦截与嵌套弹层；应用筛选后通过 closed 取得结果。
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
