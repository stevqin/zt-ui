<script setup lang="ts">
import { computed, ref } from "vue";
import { ZtInfiniteScroll } from "@ztechjs/zt-ui";

const container = ref<HTMLElement>();
const source = Array.from({ length: 25 }, (_, index) => ({
  id: index + 1,
  name: `${["无线键盘", "便携鼠标", "桌面支架", "扩展坞"][index % 4]} ${String(index + 1).padStart(2, "0")}`,
  stock: 20 + ((index * 7) % 80),
}));
const items = ref<typeof source>([]);
const page = ref(0),
  total = ref(0);
const pageSize = 10;
const finished = computed(
  () => page.value > 0 && items.value.length >= total.value,
);

async function load(signal: AbortSignal) {
  const nextPage = page.value + 1;
  await new Promise((resolve) => setTimeout(resolve, 350));
  if (signal.aborted) return;
  // 模拟分页接口；实际项目替换为携带 page、pageSize 和 signal 的请求。
  const response = {
    code: 200,
    message: "success",
    data: {
      list: source.slice((nextPage - 1) * pageSize, nextPage * pageSize),
      total: source.length,
      page: nextPage,
      pageSize,
    },
  };
  items.value.push(...response.data.list);
  total.value = response.data.total;
  page.value = response.data.page;
}
</script>

<template>
  <div class="pagination-demo">
    <div class="pagination-demo__heading">
      <strong>商品库存</strong
      ><span>已加载 {{ items.length }} / {{ page ? total : "—" }} 条</span>
    </div>
    <div
      ref="container"
      class="pagination-demo__viewport"
      role="region"
      aria-label="商品库存列表"
      tabindex="0"
    >
      <ZtInfiniteScroll
        :container="() => container"
        :load="load"
        :finished="finished"
        :distance="40"
      >
        <ul class="pagination-demo__list">
          <li v-for="item in items" :key="item.id" :data-id="item.id">
            <span>{{ item.name }}</span
            ><small>库存 {{ item.stock }} 件</small>
          </li>
        </ul>
        <template #loading>正在加载第 {{ page + 1 }} 页…</template>
        <template #finished>全部 {{ total }} 条商品已加载</template>
      </ZtInfiniteScroll>
    </div>
  </div>
</template>

<style scoped>
.pagination-demo {
  display: grid;
  gap: 12px;
  max-width: 560px;
  min-width: 0;
}
.pagination-demo__heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.pagination-demo__heading strong {
  font-size: 14px;
  font-weight: 600;
}
.pagination-demo__heading > span {
  font-size: 12px;
  color: var(--doc-muted, #667085);
  font-variant-numeric: tabular-nums;
}
.pagination-demo__viewport {
  height: 280px;
  overflow: auto;
  overscroll-behavior: contain;
  border: 1px solid var(--doc-border, #e5e7eb);
  border-radius: var(--zt-radius, 11px);
}
.pagination-demo__viewport:focus-visible {
  outline: 2px solid var(--doc-brand, #1677ff);
  outline-offset: 2px;
}
.pagination-demo__list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.pagination-demo__list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: var(--zt-infinite-scroll-padding-y, 12px) var(--zt-infinite-scroll-padding-x, 16px);
  border-bottom: 1px solid var(--doc-border, #e5e7eb);
  font-size: inherit;
  line-height: 1.5;
}
.pagination-demo__list small {
  flex: none;
  font-size: max(11px, .92em);
  color: var(--doc-muted, #667085);
  font-variant-numeric: tabular-nums;
}
</style>
