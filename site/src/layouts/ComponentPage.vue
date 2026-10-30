<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { findPage, pages } from "../content/components";
import { apiDocuments } from "../app/api";
import type { ApiDocuments } from "../app/types";
import ExampleCard from "../components/ExampleCard.vue";
import ApiReference from "../components/ApiReference.vue";
const route = useRoute(),
  page = computed(() => findPage(String(route.params.id)));
const api = computed(
  () => apiDocuments[page.value?.id ?? ""]?.components ?? [],
);
const index = computed(() => pages.findIndex((p) => p.id === page.value?.id));
</script>
<template>
  <article v-if="page" :key="page.id" class="doc-article">
    <div class="page-eyebrow">组件 / {{ page.name }}</div>
    <h1>
      {{ page.name }} <span>{{ page.title }}</span>
    </h1>
    <p class="page-description">{{ page.description }}</p>
    <div v-if="page.usage.length" class="usage-note">
      <strong>何时使用</strong>
      <ul>
        <li v-for="line in page.usage" :key="line">{{ line }}</li>
      </ul>
    </div>
    <ExampleCard
      v-for="example in page.examples"
      :key="page.id + example.id"
      :example="example"
    />
    <ApiReference v-if="api.length" :components="api" />
    <section v-else id="api" class="api-reference">
      <h2>反馈 API</h2>
      <p class="section-description">命令式反馈由独立的 <code>@ztechjs/zt-alert</code> 提供，上方示例包含安装后的导入方式与完整调用代码。</p>
      <a href="https://github.com/stevqin/zt-alert#readme" target="_blank" rel="noreferrer">查看反馈组件的完整 API 文档 ↗</a>
    </section>
    <footer class="article-pagination">
      <RouterLink v-if="index > 0" :to="`/components/${pages[index - 1].id}`"
        ><small>← 上一组件</small>{{ pages[index - 1].name }}
        {{ pages[index - 1].title }}</RouterLink
      ><RouterLink
        v-if="index < pages.length - 1"
        :to="`/components/${pages[index + 1].id}`"
        ><small>下一组件 →</small>{{ pages[index + 1].name }}
        {{ pages[index + 1].title }}</RouterLink
      >
    </footer>
  </article>
  <article v-else class="doc-article">
    <h1>未找到组件</h1>
    <RouterLink to="/components">浏览组件总览 →</RouterLink>
  </article>
</template>
