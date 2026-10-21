<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { ZtButton } from '@ztechjs/zt-ui';
import { ZtMessageBox } from '@ztechjs/zt-alert';
import type { NoticeStatus } from '@ztechjs/zt-alert';
import '@ztechjs/zt-alert/style.css';
const result = ref('等待操作');
const busy = ref(false);
const statuses: NoticeStatus[] = ['success', 'error', 'warning', 'info'];
async function run(
  kind: 'short' | 'alert' | 'confirm' | 'prompt',
  icon: NoticeStatus = 'info',
) {
  busy.value = true;
  try {
    if (kind === 'short') {
      const value = await ZtMessageBox('提示', '这是三参数快捷调用。', icon);
      result.value = `快捷调用结果：${JSON.stringify(value)}`;
    } else if (kind === 'alert') {
      const value = await ZtMessageBox.alert({
        title: '操作提示',
        text: '报表已生成，可在下载中心查看。',
        icon,
        button: '知道了',
      });
      result.value = `alert 结果：${JSON.stringify(value)}`;
    } else if (kind === 'confirm') {
      const accepted = await ZtMessageBox.confirm({
        title: '确认删除报表？',
        text: '这是效果演示，不会删除真实数据。',
        icon: 'warning',
        dangerMode: true,
        buttons: ['保留', '确认删除'],
      });
      result.value = `confirm 返回：${accepted}（${accepted ? '已确认' : '已取消'}）`;
    } else {
      const name = await ZtMessageBox.prompt({
        title: '新建报表',
        text: '输入名称后确认；也可取消。',
        icon: 'info',
        content: {
          element: 'input',
          attributes: { placeholder: '报表名称', maxlength: 30 },
        },
      });
      result.value =
        name === null
          ? 'prompt 返回 null：已取消'
          : `prompt 返回：${JSON.stringify(name)}${name === '' ? '（空字符串）' : ''}`;
    }
  } finally {
    busy.value = false;
  }
}
onBeforeUnmount(() => {
  if (busy.value) ZtMessageBox.close();
});
</script>

<template>
  <div class="demo-stack">
    <div class="demo-row">
      <ZtButton
        v-for="status in statuses"
        :key="status"
        :disabled="busy"
        @click="run('alert', status)"
        >{{ status }} 图标</ZtButton
      >
    </div>
    <div class="demo-row">
      <ZtButton :disabled="busy" @click="run('short')">三参数快捷调用</ZtButton>
      <ZtButton :disabled="busy" @click="run('confirm')">危险操作确认</ZtButton>
      <ZtButton :disabled="busy" @click="run('prompt')">输入名称</ZtButton>
    </div>
    <p class="result" role="status">{{ result }}</p>
    <p>
      默认弹性入场，状态图标同步描边。确认返回 true；取消、Esc 或点击遮罩返回
      false。prompt 可区分取消与空输入。
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
