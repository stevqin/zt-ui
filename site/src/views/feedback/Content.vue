<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { ZtButton } from '@ztechjs/zt-ui';
import { ZtDialog } from '@ztechjs/zt-alert';
import type { DialogInstance } from '@ztechjs/zt-alert';
import '@ztechjs/zt-alert/style.css';
const source = ref<HTMLElement>();
const opened = ref(false);
let dialog: DialogInstance | undefined;
async function open(mode: 'text' | 'html' | 'node' | 'render') {
  if (opened.value) {
    dialog?.focus();
    return;
  }
  opened.value = true;
  dialog = ZtDialog.open({
    title: '内容输入与实例控制',
    width: 600,
    showFooter: true,
    showCancelButton: false,
    confirmText: '关闭',
    ...(mode === 'text'
      ? { content: '<strong>这是纯文本，不会解析为 HTML</strong>' }
      : {}),
    ...(mode === 'html'
      ? {
          html: '<h3 style="color:#245edb">可信 HTML 标题</h3><p>仅使用代码内固定内容；动态内容应先消毒。</p>',
        }
      : {}),
    ...(mode === 'node' ? { content: source.value } : {}),
    ...(mode === 'render'
      ? {
          render(container, controls) {
            let timer: ReturnType<typeof setTimeout> | undefined;
            const tools = document.createElement('div');
            tools.style.cssText = 'display:flex;flex-wrap:wrap;gap:12px';
            const button = (text: string, action: () => void) => {
              const node = document.createElement('button');
              node.type = 'button';
              node.textContent = text;
              node.onclick = action;
              tools.append(node);
            };
            button('更新标题和宽度', () =>
              dialog?.update({ title: '实例已更新', width: 800 }),
            );
            button('显示正文加载', () => {
              controls.setLoading(true, '正在读取详情…');
              if (timer) clearTimeout(timer);
              timer = setTimeout(() => controls.setLoading(false), 1200);
            });
            button('切换全屏', () => dialog?.toggleFullscreen());
            container.append(tools);
            return () => {
              if (timer) clearTimeout(timer);
              tools.querySelectorAll('button').forEach((node) => {
                node.onclick = null;
              });
              tools.remove();
            };
          },
        }
      : {}),
    onConfirm: (controls) => {
      void controls.close();
    },
  });
  await dialog.closed;
  opened.value = false;
}
onBeforeUnmount(() => {
  dialog?.setLoading(false);
  void dialog?.close('api');
});
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row">
      <ZtButton @click="open('text')">纯文本内容</ZtButton>
      <ZtButton @click="open('html')">可信 HTML</ZtButton>
      <ZtButton @click="open('node')">移动现有 DOM 节点</ZtButton>
      <ZtButton @click="open('render')">render 与实例控制</ZtButton>
    </div>
    <div class="result">
      <span ref="source">这个 DOM 节点会移动到弹窗，关闭后还原到这里。</span>
    </div>
    <p>
      render 返回的清理函数会在关闭时执行。正文加载只覆盖内容区，1.2
      秒后恢复，可点击页脚“关闭”；Drawer 也支持
      content、html、render、update、setLoading、setConfirmLoading 和 focus。
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
