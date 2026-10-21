<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { ZtTable, type ZtTableColumn, type ZtTableSort } from '@ztechjs/zt-ui';
const source = [
  { id: 1, name: '杭州旗舰店', sales: 12500 },
  { id: 2, name: '上海静安店', sales: 25300 },
  { id: 3, name: '深圳中心店', sales: 18600 },
];
const data = ref([...source]),
  loading = ref(false);
const message = ref('点击销售额表头，模拟向服务端提交排序请求。');
const columns: ZtTableColumn[] = [
  { prop: 'name', label: '门店' },
  {
    prop: 'sales',
    label: '销售额',
    sortable: true,
    align: 'right',
    formatter: (value) => `¥${Number(value).toLocaleString('zh-CN')}`,
  },
];
let requestId = 0;
onBeforeUnmount(() => requestId++);
async function query(sort: ZtTableSort) {
  const id = ++requestId;
  loading.value = true;
  message.value = `请求参数：${sort.prop} / ${sort.order ?? 'null'}`;
  // 用本地延迟模拟接口，实际使用时替换为业务请求。
  await new Promise((resolve) => setTimeout(resolve, 240));
  if (id !== requestId) return;
  data.value = !sort.order
    ? [...source]
    : [...source].sort(
        (a, b) => (a.sales - b.sales) * (sort.order === 'ascending' ? 1 : -1),
      );
  loading.value = false;
  message.value = `已接收服务端结果：${sort.order === 'ascending' ? '升序' : sort.order === 'descending' ? '降序' : '原始顺序'}`;
}
</script>
<template>
  <div class="example">
    <ZtTable
      :data="data"
      :columns="columns"
      :loading="loading"
      remote
      @sort-change="query"
    />
    <p role="status">{{ message }}</p>
    <p>
      remote 模式只发出排序事件，由调用方请求并更新 data；加载期间禁止重复排序。
    </p>
  </div>
</template>
<style scoped>
.example {
  display: grid;
  gap: 16px;
}
p {
  margin: 0;
  color: var(--zt-text-muted, #626262);
  font-size: 12px;
  line-height: 1.7;
}
</style>
