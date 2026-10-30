<script setup lang="ts">
import { computed, ref } from "vue";
import { groups, pages } from "../content/components";
const props = defineProps<{ extensionsOnly?: boolean }>();
const query = ref("");
const filtered = computed(() =>
  pages.filter(
    (p) =>
      (props.extensionsOnly
        ? p.group === "extensions"
        : p.group !== "extensions") &&
      `${p.name} ${p.title} ${p.description}`
        .toLowerCase()
        .includes(query.value.trim().toLowerCase()),
  ),
);
</script>
<template>
  <article class="doc-article overview-page">
    <div class="page-eyebrow">COMPONENTS</div>
    <h1>{{ extensionsOnly ? "扩展组件库" : "组件总览" }}</h1>
    <p class="page-description">
      {{
        extensionsOnly
          ? "zt-alert 提供消息、通知、确认框、对话框、抽屉与加载等命令式反馈能力。"
          : "从基础控件到复杂业务交互，找到适合当前场景的组件。"
      }}
    </p>
    <input
      class="overview-search"
      type="search"
      placeholder="筛选组件名称或用途…"
      aria-label="筛选组件"
      v-model="query"
    />
    <p class="overview-count">{{ filtered.length }} 个组件文档</p>
    <template v-for="group in groups" :key="group.id"
      ><section
        v-if="filtered.some((p) => p.group === group.id)"
        :id="group.id"
        class="overview-group"
      >
        <h2>{{ group.title }}</h2>
        <div class="component-grid">
          <RouterLink
            v-for="page in filtered.filter((p) => p.group === group.id)"
            :key="page.id"
            :to="`/components/${page.id}`"
            class="component-tile"
            ><span class="tile-label">{{ page.name }}</span>
            <h3>{{ page.title }}</h3>
            <p>{{ page.description }}</p>
            <span class="tile-arrow" aria-hidden="true">↗</span></RouterLink
          >
        </div>
      </section></template
    >
    <p v-if="!filtered.length" class="empty-search">
      没有匹配的组件，请更换关键词。
    </p>
  </article>
</template>
