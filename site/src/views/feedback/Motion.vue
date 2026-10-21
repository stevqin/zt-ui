<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { ZtButton } from '@ztechjs/zt-ui';
import {
  ZtDialog,
  ZtDrawer,
  ZtMessage,
  ZtMessageBox,
  ZtNotification,
} from '@ztechjs/zt-alert';
import type { NoticeId, OverlayInstance } from '@ztechjs/zt-alert';
import '@ztechjs/zt-alert/style.css';

const viewport = ref(0);
const reducedMotion = ref(false);
const detail = ref('选择一种效果。关闭浮层后可再次点击，完整重播进场与退场。');
const busy = ref(false);
let overlay: OverlayInstance | undefined;
let ownsBox = false;
let alive = true;
let media: MediaQueryList | undefined;
const messages = new Set<NoticeId>();
const notices = new Set<NoticeId>();
const timers = new Set<ReturnType<typeof setTimeout>>();
function syncEnvironment() {
  viewport.value = window.innerWidth;
  reducedMotion.value = media?.matches ?? false;
}
onMounted(() => {
  media = window.matchMedia('(prefers-reduced-motion: reduce)');
  syncEnvironment();
  window.addEventListener('resize', syncEnvironment);
  media.addEventListener('change', syncEnvironment);
});
async function dialog(fullscreen = false) {
  if (busy.value) return;
  busy.value = true;
  detail.value = fullscreen
    ? '全屏模式：轻量淡入淡出，用于和普通弹窗对照。'
    : '普通模式：约 560ms 底部起跳、拉伸挤压和回弹；关闭时先缩小，再下落淡出。';
  overlay = ZtDialog.open({
    title: fullscreen ? '全屏淡入对照' : '新版果冻弹窗',
    subtitle: fullscreen
      ? '全屏模式使用轻量动画'
      : '窄屏也保持普通弹窗，便于观察回弹',
    width: 'min(560px, calc(100vw - 32px))',
    fullscreenBelow: 0,
    fullscreen,
    showZoom: true,
    showFooter: true,
    showCancelButton: false,
    confirmText: '关闭并观察退场',
    content: fullscreen
      ? '这是全屏模式。点击关闭，观察轻量淡出，再与“果冻弹窗”对比。'
      : '观察窗口从下方起跳后拉伸、挤压并回弹收住。点击关闭，观察先原地缩小、再下落淡出的两段退场。',
    onConfirm: (controls) => {
      void controls.close();
    },
  });
  await overlay.closed;
  if (alive) busy.value = false;
}
async function box(steady = false) {
  if (busy.value) return;
  busy.value = true;
  ownsBox = true;
  detail.value = steady
    ? 'shake: false：关闭弹性回弹，保留轻量效果。'
    : 'MessageBox：约 560ms 果冻回弹，图标在首次横向回缩时同步描边。';
  try {
    await ZtMessageBox({
      title: steady ? '轻量效果对照' : '果冻回弹与图标描边',
      text: '观察窗口形变、图标圆框与对勾绘制。关闭后可重复点击体验。',
      icon: 'success',
      shake: !steady,
      button: '关闭并观察退场',
    });
  } finally {
    ownsBox = false;
    if (alive) busy.value = false;
  }
}
async function drawer() {
  if (busy.value) return;
  busy.value = true;
  detail.value =
    'Drawer：约 480ms 侧向果冻滑入、330ms 滑出。此例关闭窄屏自动全屏，以观察侧向效果。';
  overlay = ZtDrawer.open({
    title: '侧向果冻抽屉',
    width: 'min(420px, calc(100vw - 32px))',
    fullscreenBelow: 0,
    content: '观察右侧滑入后的轻微越界和回弹，再点击关闭观察侧向退场。',
  });
  await overlay.closed;
  if (alive) busy.value = false;
}
function stack(notification = false) {
  const api = notification ? ZtNotification : ZtMessage;
  const ids = notification ? notices : messages;
  ids.forEach((id) => api.close(id));
  ids.clear();
  detail.value = `${notification ? '通知从右侧' : '消息从顶部'}以约 440ms 弹性进入，三条依次堆叠；随后关闭中间一条，观察两段退场与平滑补位。`;
  for (let index = 0; index < 3; index++) {
    const timer = setTimeout(() => {
      timers.delete(timer);
      const id = api.success({
        title: `第 ${index + 1} 条`,
        content: '观察入场、描边与堆叠位置',
        duration: 5000,
      });
      ids.add(id);
      if (index === 1) {
        const closing = setTimeout(() => {
          timers.delete(closing);
          api.close(id);
        }, 1600);
        timers.add(closing);
      }
    }, index * 650);
    timers.add(timer);
  }
}
onBeforeUnmount(() => {
  alive = false;
  timers.forEach((timer) => clearTimeout(timer));
  messages.forEach((id) => ZtMessage.close(id));
  notices.forEach((id) => ZtNotification.close(id));
  void overlay?.close();
  if (ownsBox) ZtMessageBox.close();
  window.removeEventListener('resize', syncEnvironment);
  media?.removeEventListener('change', syncEnvironment);
});
</script>

<template>
  <div class="motion-demo">
    <p class="motion-environment">
      当前视口：{{ viewport }}px · 减少动态效果：{{
        reducedMotion ? '已开启，组件会简化动画' : '未开启'
      }}
    </p>
    <p>
      普通 Dialog 在小于 768px
      时默认自动全屏，会改用轻量淡入。本组为观察动效设置 fullscreenBelow:
      0，窄屏也能看到普通窗口的果冻回弹；下方业务示例保留默认自适应。
    </p>
    <div class="motion-actions">
      <ZtButton :disabled="busy" @click="dialog()">果冻弹窗</ZtButton>
      <ZtButton :disabled="busy" @click="dialog(true)">全屏淡入对照</ZtButton>
      <ZtButton :disabled="busy" @click="box()">弹窗与图标描边</ZtButton>
      <ZtButton :disabled="busy" @click="box(true)">无回弹对照</ZtButton>
      <ZtButton :disabled="busy" @click="drawer">侧向果冻抽屉</ZtButton>
      <ZtButton :disabled="busy" @click="stack()">消息堆叠与补位</ZtButton>
      <ZtButton :disabled="busy" @click="stack(true)">通知堆叠与补位</ZtButton>
    </div>
    <p class="motion-detail" role="status">{{ detail }}</p>
  </div>
</template>

<style scoped>
.motion-demo {
  display: grid;
  gap: 16px;
}
.motion-demo p {
  margin: 0;
  line-height: 1.8;
}
.motion-environment {
  color: var(--doc-muted);
  font-size: 13px;
}
.motion-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.motion-detail {
  padding: 12px;
  border: 1px solid var(--doc-line);
  border-radius: 8px;
}
</style>
