<script setup lang="ts">
import { RouterLink } from "vue-router";
import { releases } from "../content/releases";
import { renderMarkdown } from "../app/markdown";
const entries = releases.map((release) => ({
  ...release,
  summaryHtml: renderMarkdown(release.summary),
  sections: release.sections.map((section) => ({
    ...section,
    html: renderMarkdown(section.body),
  })),
}));
</script>
<template>
  <article class="doc-article changelog-page">
    <div class="page-eyebrow">开发指南 / RELEASE NOTES</div>
    <h1>更新日志</h1>
    <p class="page-description">
      按版本汇总新增能力、交互优化与问题修复，帮助你了解升级重点和接入变化。
    </p>
    <nav class="release-quick-nav" aria-label="版本快速导航">
      <RouterLink
        v-for="release in entries"
        :key="release.id"
        :to="{ path: '/guide/changelog', hash: `#${release.id}` }"
        >v{{ release.version }}</RouterLink
      >
    </nav>
    <div class="changelog-content">
      <section
        v-for="(release, index) in entries"
        :id="release.id"
        :key="release.id"
        class="release-entry"
        :class="{ 'is-latest': index === 0 }"
        :aria-labelledby="`${release.id}-title`"
      >
        <header class="release-meta">
          <span v-if="index === 0" class="release-badge">本次更新</span>
          <h2 :id="`${release.id}-title`">
            <a v-if="release.compareUrl" :href="release.compareUrl"
              >v{{ release.version }}</a
            ><template v-else>v{{ release.version }}</template>
          </h2>
          <time :datetime="release.date">{{ release.date }}</time>
        </header>
        <div class="release-body">
          <div
            v-if="release.summary.trim()"
            class="release-summary"
            v-html="release.summaryHtml"
          ></div>
          <section
            v-for="section in release.sections"
            :key="section.title"
            class="release-section"
          >
            <h3>{{ section.title }}</h3>
            <div v-html="section.html"></div>
          </section>
        </div>
      </section>
    </div>
  </article>
</template>
