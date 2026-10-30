<script setup lang="ts">
import { computed, ref } from "vue";
import {
  ZtInput,
  ZtButton,
  ZtSelect,
  ZtTable,
  ZtTag,
  type ZtTableColumn,
} from "@ztechjs/zt-ui";
const query = ref(""),
  category = ref<string | null>(null);
const inventory = [
  { id: 1, name: "机械键盘", category: "日常", stock: 128 },
  { id: 2, name: "便携鼠标", category: "通勤", stock: 64 },
  { id: 3, name: "桌面支架", category: "通勤", stock: 96 },
];
const rows = computed(() =>
  inventory.filter(
    (row) =>
      row.name.includes(query.value) &&
      (!category.value || row.category === category.value),
  ),
);
const columns: ZtTableColumn[] = [
  { prop: "name", label: "商品名称" },
  { prop: "category", label: "场景", width: 90 },
  { prop: "stock", label: "可用库存", width: 100, align: "right" },
];
const current = ref("");
function reset() {
  query.value = "";
  category.value = null;
  current.value = "已重置筛选";
}
</script>
<template>
  <div class="home-page">
    <section class="home-hero">
      <div class="hero-copy">
        <p class="hero-eyebrow">VUE 3 · TYPESCRIPT</p>
        <h1>为业务界面<br />而构建<span>。</span></h1>
        <p class="hero-description">
          Zt UI 提供从基础输入到复杂表格的组件，<br
            class="desktop-break"
          />让交互保持一致，让开发更专注。
        </p>
        <div class="hero-actions">
          <RouterLink class="primary-button" to="/guide/quick-start"
            >快速开始 <span>→</span></RouterLink
          ><RouterLink class="secondary-button" to="/components"
            >浏览组件</RouterLink
          >
        </div>
        <div class="install-command">
          <code>npm install @ztechjs/zt-ui</code><span>Vue 3.5+</span>
        </div>
      </div>
      <div class="hero-preview">
        <div class="preview-caption">
          <span class="live-dot"></span> 实时组件预览<span>商品管理</span>
        </div>
        <div class="preview-heading">
          <div>
            <h2>商品列表</h2>
            <p>组合组件，构建业务界面</p>
          </div>
          <ZtTag status="success">可交互</ZtTag>
        </div>
        <div class="home-filters">
          <ZtInput
            v-model="query"
            clearable
            placeholder="搜索商品名称"
            aria-label="搜索商品名称"
          /><ZtSelect
            v-model="category"
            clearable
            placeholder="全部场景"
            :options="[
              { label: '通勤', value: '通勤' },
              { label: '日常', value: '日常' },
            ]"
          /><ZtButton @click="reset">重置</ZtButton>
        </div>
        <ZtTable :columns="columns" :data="rows" />
        <div class="preview-footer">
          <span>共 {{ rows.length }} 条记录</span
          ><span role="status">{{ current || "试试筛选与全局外观设置" }}</span>
        </div>
      </div>
    </section>
    <section class="home-principles">
      <div>
        <span class="principle-icon">⌘</span>
        <h2>从真实用法开始</h2>
        <p>可操作的组件示例，配合完整 Vue 源码，直接开始你的项目。</p>
      </div>
      <div>
        <span class="principle-icon">◐</span>
        <h2>一致的外观配置</h2>
        <p>全局尺寸、圆角与明暗主题，让组件适应不同业务界面。</p>
      </div>
      <div>
        <span class="principle-icon">{ }</span>
        <h2>明确的接口契约</h2>
        <p>完整的属性、事件、插槽与类型说明，减少接入时的猜测。</p>
      </div>
    </section>
    <section class="home-featured">
      <div class="section-heading">
        <div>
          <p class="page-eyebrow">BUILD WITH COMPONENTS</p>
          <h2>从常用组件开始</h2>
        </div>
        <RouterLink to="/components">查看全部组件 →</RouterLink>
      </div>
      <div class="featured-grid">
        <RouterLink
          v-for="item in [
            {
              id: 'button',
              name: 'Button',
              title: '按钮',
              description: '表达操作与优先级',
            },
            {
              id: 'form',
              name: 'Form',
              title: '表单',
              description: '组织输入、校验和提交',
            },
            {
              id: 'table',
              name: 'Table',
              title: '表格',
              description: '清晰呈现与操作数据',
            },
            {
              id: 'vtable-grid',
              name: 'VTableGrid',
              title: '数据表格',
              description: '查询、编辑与复杂数据场景',
            },
          ]"
          :key="item.id"
          :to="`/components/${item.id}`"
          ><span>{{ item.name }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <b>↗</b></RouterLink
        >
      </div>
    </section>
    <footer class="home-footer">
      <span>Zt UI · Vue 3 组件库</span
      ><a
        href="https://github.com/stevqin/zt-ui"
        target="_blank"
        rel="noreferrer"
        >GitHub ↗</a
      ><span>MIT License</span>
    </footer>
  </div>
</template>
