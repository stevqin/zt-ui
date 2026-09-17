<script setup lang="ts">
import { ref } from 'vue';
import { ZtSelect, type ZtSelectOption } from '@ztechjs/zt-ui';
const userDirectory: ZtSelectOption[] = [
  { label: '陈晨 · 商品企划部', value: 'u-1001' },
  { label: '林晓 · 零售运营部', value: 'u-1002' },
  { label: '周远 · 供应链中心', value: 'u-1003' },
  { label: '王静 · 财务管理部', value: 'u-1004' },
];
const selectedUser = ref<string | null>(null);
function searchUsers(keyword: string): Promise<ZtSelectOption[]> {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      const normalized = keyword.trim().toLowerCase();
      if (normalized === '失败') {
        reject(new Error('员工目录服务暂时不可用'));
        return;
      }
      resolve(userDirectory.filter((option) => option.label.toLowerCase().includes(normalized)));
    }, 900);
  });
}
</script>

<template>
  <div class="select-demo-stack">
    <ZtSelect
      v-model="selectedUser"
      remote
      :remote-method="searchUsers"
      :debounce="0"
      clearable
      style="width: 660px"
      aria-label="员工目录"
      remote-error-text="员工目录加载失败，请修改关键词后重试"
      placeholder="输入姓名或部门；输入“失败”查看错误"
      multiple
    >
      <template #loading>正在查询员工目录...</template>
    </ZtSelect>
    <span>每次查询固定等待 900 ms，搜索“陈”可返回结果。</span>
  </div>
</template>

<style scoped>
.select-demo-stack {
  display: grid;
  gap: 10px;
  width: min(100%, 480px);
}
.select-demo-stack > span {
  color: #6b7280;
  font-size: 13px;
}
.select-demo-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.select-size-list {
  display: grid;
  align-items: start;
  gap: 12px;
  width: min(100%, 480px);
}
.slot-label {
  white-space: nowrap;
  color: #475569;
  font-size: 12px;
}
.slot-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}
.slot-option small {
  color: #64748b;
}
.slot-footer {
  color: #64748b;
  font-size: 12px;
}
.slot-tag-remove {
  border: 0;
  padding: 0 2px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}
@media (max-width: 720px) {
  .select-demo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
