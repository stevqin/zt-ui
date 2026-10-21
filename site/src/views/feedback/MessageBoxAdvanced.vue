<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { ZtButton } from '@ztechjs/zt-ui';
import { ZtMessageBox } from '@ztechjs/zt-alert';
import '@ztechjs/zt-alert/style.css';
const result = ref('等待操作');
const busy = ref(false);
let alive = true;
let ownsBox = false;
let closeTimer: ReturnType<typeof setTimeout> | undefined;
async function open(mode: 'actions' | 'timer' | 'async' | 'steady' | 'api') {
  busy.value = true;
  ownsBox = true;
  try {
    if (mode === 'actions') {
      const pending = ZtMessageBox({
        title: '选择导出范围',
        text: '自定义按钮可以返回任意业务值。',
        buttons: {
          cancel: '取消',
          page: { text: '当前页', value: 'page' },
          confirm: { text: '全部数据', value: 'all' },
        },
      });
      ZtMessageBox.setActionValue({
        confirm: { scope: 'all', format: 'xlsx' },
      });
      result.value = `按钮结果：${JSON.stringify(await pending)}`;
    } else if (mode === 'api') {
      const pending = ZtMessageBox({
        title: '命令式关闭',
        text: '1.5 秒后由 ZtMessageBox.close() 关闭。',
        button: '立即关闭',
      });
      closeTimer = setTimeout(() => ZtMessageBox.close(), 1500);
      await pending;
      result.value = '命令式提示已关闭';
    } else if (mode === 'timer') {
      await ZtMessageBox({
        title: '保存成功',
        text: '2 秒后自动关闭；无操作按钮。',
        icon: 'success',
        buttons: false,
        timer: 2000,
      });
      result.value = '定时提示已关闭';
    } else if (mode === 'steady') {
      await ZtMessageBox({
        title: '轻量动画',
        text: 'shake: false 关闭弹性回弹；本例仅允许点击按钮关闭。',
        icon: 'info',
        shake: false,
        closeOnClickOutside: false,
        closeOnEsc: false,
        button: '关闭提示',
      });
      result.value = '轻量动画提示已关闭';
    } else {
      const action = await ZtMessageBox({
        title: '模拟异步查询',
        text: '查询按钮会保持弹窗并进入加载态，约 1 秒后恢复按钮并主动关闭。',
        closeOnClickOutside: false,
        buttons: {
          cancel: { text: '关闭' },
          confirm: { text: '查询', value: 'query', closeModal: false },
        },
      });
      if (action === 'query' && alive) {
        result.value = `查询中：${JSON.stringify(ZtMessageBox.getState())}`;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (!alive) return;
        ZtMessageBox.stopLoading();
        ZtMessageBox.close();
        ownsBox = false;
        result.value =
          '模拟查询完成：已 stopLoading() 恢复按钮并 close() 关闭弹窗。Promise 仅结算一次。';
      }
    }
  } finally {
    if (closeTimer) clearTimeout(closeTimer);
    if (mode !== 'async' || !ZtMessageBox.getState().isOpen) ownsBox = false;
    busy.value = false;
  }
}
onBeforeUnmount(() => {
  alive = false;
  if (closeTimer) clearTimeout(closeTimer);
  if (ownsBox) ZtMessageBox.close();
});
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row">
      <ZtButton :disabled="busy" @click="open('actions')"
        >多按钮与自定义返回值</ZtButton
      >
      <ZtButton :disabled="busy" @click="open('timer')">定时关闭</ZtButton>
      <ZtButton :disabled="busy" @click="open('steady')"
        >关闭回弹与遮罩退出</ZtButton
      >
      <ZtButton :disabled="busy" @click="open('async')"
        >保留弹窗与恢复按钮</ZtButton
      >
      <ZtButton :disabled="busy" @click="open('api')">命令式关闭</ZtButton>
    </div>
    <p class="result" role="status">{{ result }}</p>
    <p>
      setDefaults(options) 可在应用初始化时统一设置文案与关闭行为，例如
      ZtMessageBox.setDefaults({ button: '知道了', closeOnClickOutside: false
      })。
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
