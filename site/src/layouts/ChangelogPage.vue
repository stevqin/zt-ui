<script setup lang="ts">
import changelog from "../../../CHANGELOG.md?raw";
import { renderMarkdown } from "../app/markdown";
const content = renderMarkdown(changelog.replace(/^#\s+更新日志\s*\r?\n/, ""));
</script>
<template>
  <article class="doc-article">
    <div class="page-eyebrow">RELEASES</div>
    <h1>更新日志</h1>
    <p class="page-description">组件库版本发布记录。</p>
    <div class="changelog-content" v-html="content"></div>
  </article>
</template>
