<script setup lang="ts">
import type { Guide } from "../content/guides";
import { highlightCode, copyText } from "../app/source";
import { ref } from "vue";
defineProps<{ guide: Guide }>();
const message = ref("");
async function copy(code: string) {
  try {
    await copyText(code);
    message.value = "已复制";
  } catch {
    message.value = "复制失败，请选择代码手动复制";
  }
}
</script>
<template>
  <article class="doc-article">
    <div class="page-eyebrow">开发指南</div>
    <h1>{{ guide.title }}</h1>
    <p class="page-description">{{ guide.description }}</p>
    <section
      v-for="section in guide.sections"
      :key="section.id"
      :id="section.id"
      class="guide-section"
    >
      <h2>{{ section.title }}</h2>
      <p>{{ section.text }}</p>
      <div v-if="section.code" class="guide-code">
        <button @click="copy(section.code)">复制代码</button>
        <pre
          tabindex="0"
        ><code v-html="highlightCode(section.code)"></code></pre>
      </div>
    </section>
    <p role="status">{{ message }}</p>
    <RouterLink class="text-link" to="/components">浏览组件 →</RouterLink>
  </article>
</template>
